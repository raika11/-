package jmnet.moka.web.bulk.task.bulkdump.process.basic;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.regex.Pattern;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.code.SenderStatus;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.service.SlackMessageService;
import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvCP;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvGlobal;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobTotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.sub.BulkDumpJobFileVo;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import jmnet.moka.web.bulk.util.BulkStringUtil;
import jmnet.moka.web.bulk.util.BulkTagUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.basic
 * ClassName : BulkDumpProcess
 * Created : 2021-01-21 021 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-21 021 오후 2:55
 */
@Slf4j
public class BulkDumpProcess {
    public static BulkDumpResult doProcess(TotalVo<BulkDumpTotalVo> totalVo, BulkArticle article, BulkDumpEnv bulkDumpEnv, BulkDumpTask bulkDumpTask, BulkDumpJobTotalVo dumpJobTotal) {
        final BulkDumpEnvGlobal dumpEnvGlobal = bulkDumpEnv.getBulkDumpEnvGlobal();
        final SlackMessageService slackMessageService = bulkDumpTask.getTaskManager().getSlackMessageService();
        final ObjectMapper objectMapper = bulkDumpTask.getTaskManager().getObjectMapper();
        final BulkDumpService dumpService = bulkDumpTask.getTaskManager().getBulkDumpService();

        BulkDumpResult result = BulkDumpResult.SUCCESS;

        final String backIud = article.getIud().toString();
        for(BulkDumpEnvCP dumpEnvCP : bulkDumpEnv.getDumpEnvCPs() ) {
            if(!dumpEnvCP.getContent().contains(article.getTargetCode()))
                continue;

            final boolean isDelSite = !McpString.isNullOrEmpty(article.getBulkDelSite()) &&
                    Arrays.stream(article.getBulkDelSite().split(",")).filter(c -> c.equals(dumpEnvCP.getSendSiteCode())).findAny().orElse(null) != null;
            if( !McpString.isNullOrEmpty(dumpEnvCP.getSendSiteCode()) ) {
                if( !article.getIud().toString().equals("D")) {
                    // IUD 가 "D" 가 아닐 경우 bulkSendSite 와 bulkDelSite 에 항목이 있는 지 체크
                    if( article.getBulkSendSite() != null ) {
                        if( Arrays.stream(article.getBulkSendSite().split(",")).filter(c -> c.equals(dumpEnvCP.getSendSiteCode())).findAny().orElse(null) == null) {
                            if( !isDelSite ) {
                                continue;
                            }
                        }
                    }
                }
            }

            if( isDelSite ) {
                article.getIud().setData("D");
                article.getIud2().setData("D");
                article.getIud3().setData("D");
            }
            else {
                article.getIud().setData(backIud);
                article.getIud2().setData(backIud);
                article.getIud3().setData(backIud);
            }

            final BulkDumpJobVo dumpJob = BulkDumpJobVo.makeBulkDumpJob( dumpEnvCP, dumpJobTotal, dumpEnvCP.getDir() );

            result = doProcess_CpProcess( totalVo, dumpEnvCP, article, dumpJobTotal, dumpJob, bulkDumpTask, dumpService, slackMessageService);
            if( result != BulkDumpResult.SUCCESS)
                return result;
        }

        if( !dumpJobTotal.isNotFinalDump() )
            result = dumpJobTotal.exportDumpJobTotal(dumpEnvGlobal.getDirDump(), objectMapper);

        return result;
    }

    private static final Pattern PATTERN_CpFormat = Pattern.compile("(\\{_.*?_})", Pattern.CASE_INSENSITIVE);
    private static BulkDumpResult doProcess_CpProcess(TotalVo<BulkDumpTotalVo> totalVo, BulkDumpEnvCP dumpEnvCP, BulkArticle article, BulkDumpJobTotalVo dumpJobTotal, BulkDumpJobVo dumpJob,
            BulkDumpTask bulkDumpTask, BulkDumpService dumpService, SlackMessageService slackMessageService) {
        final ObjectMapper objectMapper = bulkDumpTask.getTaskManager().getObjectMapper();

        //noinspection ConstantConditions,LoopStatementThatDoesntLoop
        do {
            final String iud = article.getIud().toString();
            if( dumpEnvCP.getName().equals("DAUM_SEARCH_JDAILY") ) {
                switch (iud) {
                    case "D": case "U":
                        // 중앙데일리 다음카카오 검색제휴, 기사 송고 C(생성)지원, 수정/삭제는 벌크 생성제외. - 2016.08.24 by sean.
                        totalVo.logInfo( "BULK Job Action '{}' aid ={} PATH ({}) for {} was skip created.", iud, article.getTotalId(), dumpEnvCP.getDir(), dumpEnvCP.getName());
                        return BulkDumpResult.SUCCESS;
                }
            }

            if (iud.equals("D")) {
                if (!doProcess_CpProcessWriteSwitchTags(dumpEnvCP, article, dumpEnvCP.getFormatDelete(), dumpJobTotal, dumpJob)) {
                    break;
                }
            } else {
                final boolean isOvpDownloadSuccess = doProcess_CpProcessOvpDownload(totalVo, dumpEnvCP, article, dumpJobTotal, dumpJob,
                        slackMessageService);
                if (!isOvpDownloadSuccess) {
                    return BulkDumpResult.TIMEOUT_OVP;
                }
                if (!doProcess_CpProcessWriteSwitchTags(dumpEnvCP, article, dumpEnvCP.getFormat(), dumpJobTotal, dumpJob)) {
                    break;
                }
            }

            Map<String, String> notReplacedMap = new HashMap<>();
            BulkTagUtil.getMatchesMarkTagList( PATTERN_CpFormat, dumpJob.getCpFormat(), "notMatched",  notReplacedMap );
            if( notReplacedMap.size() > 0 ) {
                final String joined = String.join( ",", new HashSet<>(notReplacedMap.values()) );
                totalVo.logError( "BULK Job Action '{}' aid ={} TAG ({}) for {} has not matched tag list", iud, article.getTotalId(), joined, dumpEnvCP.getName());
            }

            if( !dumpJobTotal.exportDumpJob(dumpEnvCP, dumpJob, objectMapper) )
                break;

            totalVo.getMainData().setCurPortalDiv( dumpEnvCP.getName() );
            totalVo.getMainData().setCurPortalIud( iud );
            totalVo.getMainData().setCurPortalSenderStatus(SenderStatus.Ready);
            totalVo.getMainData().setCurPortalContent( dumpJob.getCpFormat() );

            dumpService.insertBulkPortalLog(totalVo);

            return BulkDumpResult.SUCCESS;
        }while( false );
        return BulkDumpResult.FAIL_DUMP_CP_PROCESS;
    }

    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    private static boolean doProcess_CpProcessWriteSwitchTags(BulkDumpEnvCP dumpEnvCP, BulkArticle article, String format, BulkDumpJobTotalVo dumpJobTotal, BulkDumpJobVo dumpJob) {
        boolean success;

        final String cpFormat = doProcess_CpProcessSwitchTags( article, format, dumpEnvCP.getType());
        String fileName = dumpJobTotal.getBulkJobFileName(dumpEnvCP.getFileExt());
        switch ( dumpEnvCP.getName() ) {
            case "MS_JA": case "MS_ISPULS": case "MS_JA_ECO":
                fileName = String.format( "000%s.%s",  article.getTotalId().toString(), dumpEnvCP.getFileExt() );
                break;
            default:
                log.trace(" BulkDumpProcess :: doProcess_CpProcessWriteSwitchTags no switch");
                break;
        }
        final String tmpFileName = BulkFileUtil.getTempFileName(dumpJobTotal.getSourceDir(), dumpEnvCP.getFileExt() );

        BufferedWriter bs = null;
        try {
            if( tmpFileName == null ) {
                throw new BulkException("파일 이름을 생성할 수 없습니다.");
            }
            if ("U8".equals(dumpEnvCP.getEncodeType())) {
                bs = new BufferedWriter
                        (new OutputStreamWriter(new FileOutputStream(tmpFileName), StandardCharsets.UTF_8));
            }
            else {
                bs = new BufferedWriter
                        (new OutputStreamWriter(new FileOutputStream(tmpFileName), "EUC-KR"));
            }
            bs.write(cpFormat);
            dumpJobTotal.getSourceFileNames().add(tmpFileName);
            dumpJob.getSourceJobFiles().add( new BulkDumpJobFileVo(tmpFileName, fileName));
            dumpJob.setCpFormat( cpFormat );

            success = true;
        } catch (Exception e) {
            success = false;
            e.printStackTrace();
        } finally {
            if (bs != null) {
                try {
                    bs.flush();
                    bs.close();
                } catch (Exception ignore) {
                    log.trace(" BulkDumpProcess :: doProcess_CpProcessWriteSwitchTags Exception" );
                }
            }
        }
        return success;
    }

    private static String doProcess_CpProcessSwitchTags(BulkArticle article, String format, String type) {
        for( String key : article.getDataMap().keySet() ){
            MapString mapString = article.getDataMap().get(key);
            format = format.replace( key, mapString.toString() );
        }

        format = format.replace( "{_NOWYYMMDDHHMMSS_}", McpDate.dateStr(new Date(), "yyyyMMddHHmmss") );
        format = format.replace( "{_NOWHH:MM:SS_}", McpDate.dateStr(new Date(), "HH:mm:ss") );

        if( type.equals("HTML"))
            format = format.replace( "{_CONT_}", article.getContentHtml().toString() );
        else if( type.equals("TXT"))
            format = format.replace( "{_CONT_}", article.getContentText().toString() );

        String reptJtbcOne = "JTBC";
        if( !article.getArtReporter().isEmpty() ){
            String[] reporter = article.getArtReporter().toString().split(",");
            if( reporter.length > 0 )
                reptJtbcOne = reporter[0];
        }
        format = format.replace( "{_REPT_JTBC_ONE_}", reptJtbcOne  );

        if( article.getMediaFullName().contains("중앙일보") ) {
            format = format.replace( "{_REPT_MS_}", article.getArtReporter().toString().replace("n/a", "중앙일보 기자") );
        }
        else if( article.getMediaFullName().contains("일간스포츠") ) {
            format = format.replace( "{_REPT_MS_}", article.getArtReporter().toString().replace("n/a", "일간스포츠 기자") );
        }
        else {
            format = format.replace( "{_REPT_MS_}", article.getArtReporter().toString() );
        }

        format = format.replace( "{_URL_NAVER_}", article.getServiceurl().toString().replace("&", "&amp;") );


        String[] des = article.getContentHtmlMs().toString().split("\\.");
        if( des.length > 0 ) {
            format = format.replace( "{_DES_}", des[0] );
        }
        else {
            format = format.replace( "{_DES_}", "" );
        }

        if( article.getMediaFullName().contains("중앙일보") ) {
            format = format.replace("{_LOGO_}", "http://images.joins.com/ui_joins/news10/common/navi/v2/t_joins.gif")
                           .replace("{_COPYRIGHT_}", "Copyrightsⓒ온라인 중앙, All rights reserved.");
        }
        else if( article.getMediaFullName().contains("일간스포츠") ) {
            format = format.replace("{_LOGO_}", "http://images.joins.com/ui_portal/portal2010/isplus/t_isplus.gif")
                           .replace("{_COPYRIGHT_}", "Copyrightsⓒ일간스포츠, All rights reserved.");
        }

        /* 매거진용 D 일경우 URL 삽입 */
        switch (article.getMediaFullName().toString()) {
            case "월간중앙":
                format = format.replace("{_DELURL_}", "http://magazine.joins.com/monthly/article_view.asp?aid=" + article
                        .getTotalId()
                        .toString());
                break;
            case "뉴스위크":
                format = format.replace("{_DELURL_}", "http://magazine.joins.com/newsweek/article_view.asp?aid=" + article
                        .getTotalId()
                        .toString());
                break;
            case "포브스":
                format = format.replace("{_DELURL_}", "http://magazine.joins.com/forbes/article_view.asp?aid=" + article
                        .getTotalId()
                        .toString());
                break;
            default:
                log.trace(" BulkDumpProcess :: doProcess_CpProcessSwitchTags no switch");
                break;
        }

        return format;
    }

    private static boolean doProcess_CpProcessOvpDownload(TotalVo<BulkDumpTotalVo> totalVo, BulkDumpEnvCP dumpEnvCP, BulkArticle article, BulkDumpJobTotalVo dumpJobTotal, BulkDumpJobVo dumpJob, SlackMessageService slackMessageService) {
        //noinspection ConstantConditions,LoopStatementThatDoesntLoop
        do {
            if( !"Y".equals(dumpEnvCP.getDnVideo() ))
                break;
            if( !article.getBulkYn().substring(2).equals("Y"))
                break;

            final String cpName = dumpEnvCP.getName().toUpperCase().trim();

            boolean downloadSuccess = true;
            int loopCount = 0;
            for( BulkDumpNewsMMDataVo videoData : article.getBulkDumpNewsVideoList() ) {
                loopCount++;

                if( cpName.contains("JTBC") ) {
                    final String targetFilename = BulkStringUtil.format("{}.mp4", videoData.getVideoId());
                    final String videoUrl = "http://jcms.jtbc.joins.com/nas/newsvod/" + videoData.getVideoUrl();
                    doProcess_CpProcessOvpDownload_sub(totalVo, dumpEnvCP, dumpJobTotal, dumpJob, slackMessageService, videoData, videoUrl, targetFilename);
                    break;
                }
                else if( cpName.contains("NAVER") && article.getTargetCode().equals("SOY") ) {
                    final String targetFilename = BulkStringUtil.format("{}_{}.mp4", videoData.getVideoId(), loopCount);
                    downloadSuccess &= doProcess_CpProcessOvpDownload_sub(totalVo, dumpEnvCP, dumpJobTotal, dumpJob, slackMessageService, videoData, videoData.getVideoUrl(), targetFilename);
                }
                else if ( (cpName.contains("DAUM") || cpName.contains("EMPAS")) && article.isOvpArticle()){
                    final String targetFilename = BulkStringUtil.format("{}.mp4", videoData.getVideoId());
                    downloadSuccess &= doProcess_CpProcessOvpDownload_sub(totalVo, dumpEnvCP, dumpJobTotal, dumpJob, slackMessageService, videoData, videoData.getVideoUrl(), targetFilename);
                    break;
                }
            }
            return downloadSuccess;
        }while( false );

        return true;
    }

    private static boolean doProcess_CpProcessOvpDownload_sub(TotalVo<BulkDumpTotalVo> totalVo, BulkDumpEnvCP dumpEnvCP, BulkDumpJobTotalVo dumpJobTotal, BulkDumpJobVo dumpJob,
            SlackMessageService slackMessageService, BulkDumpNewsMMDataVo videoData, String videoUrl, String targetFilename) {

        final long startTime = System.currentTimeMillis();
        final boolean downloadSuccess = dumpJobTotal.downloadData( dumpJob, videoData, videoUrl, "mp4", targetFilename );
        if( downloadSuccess )
            totalVo.logInfo("BULK VIDEO FILE ({}) time taken({}ms) for ({}) was successfully created.", videoData.getVideoUrl(), System.currentTimeMillis() - startTime, dumpEnvCP.getName() );
        else {
            totalVo.logError("BULK VIDEO FILE ({}) for ({}) was failed !!.", videoData.getVideoUrl(), dumpEnvCP.getName());
            slackMessageService.sendSms( "BulkDumpOvp", BulkStringUtil.format("BULK VIDEO FILE ({}) for ({}) was failed !!.", videoData.getVideoUrl(), dumpEnvCP.getName()));
        }
        return downloadSuccess;
    }
}
