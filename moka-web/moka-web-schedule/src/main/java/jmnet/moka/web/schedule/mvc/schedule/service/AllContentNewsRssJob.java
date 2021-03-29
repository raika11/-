package jmnet.moka.web.schedule.mvc.schedule.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.mybatis.dto.AllContentNewsRssDTO;
import jmnet.moka.web.schedule.mvc.mybatis.mapper.AllContentNewsRssJobMapper;
import jmnet.moka.web.schedule.mvc.mybatis.vo.AllContentNewsVO;
import jmnet.moka.web.schedule.support.StatusResultType;
import jmnet.moka.web.schedule.support.common.FileUpload;
import jmnet.moka.web.schedule.support.common.ReplaceSymbol;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * all content 뉴스정보를 조회하여 rss 파일로 FTP 업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : AllContentNewsRssJob
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-24
 */
@Slf4j
@Component
public class AllContentNewsRssJob extends AbstractScheduleJob {

    @Value("중앙일보")
    String sMediaName;

    @Value("https://joongang.joins.com/")
    String sMediaUrl;

    @Value("http://joongang.joins.com")
    String joongangSvrWebDomain;

    @Value("https://images.joins.com")
    String imagesSvrWebDomain;

    @Value("https://news.joins.com")
    String newsSvrWebDomain;

    @Autowired
    AllContentNewsRssJobMapper allContentNewsRssJobMapper;

    Map<String, Map<String, String>> ctgInfoMapAllContent = new HashMap<>();


    @Override
    public void invoke(GenContent info) {
        GenContent scheduleInfo = info;
        GenStatus scheduleResult = info.getGenStatus();

        //필요정보 초기화
        getCtgInfo();

        try {
            // -1 = 전체조회
            String ctg = "-1";
            String media = "JO";
            String filename = "";

            //입력된 파라미터 확인(ctg, media)
            log.debug("param : {}", scheduleInfo.getPkgOpt());
            if (McpString.isNotEmpty(scheduleInfo.getPkgOpt())) {
                JSONObject jsonParam = (JSONObject) new JSONParser().parse(scheduleInfo.getPkgOpt());
                ctg = McpString.defaultValue((String) jsonParam.get("ctg"));
                media = McpString.defaultValue((String) jsonParam.get("media"));
                filename = McpString.defaultValue((String) jsonParam.get("filename"));

                //media = JO:중앙(1,3), IO:일간(29), J:중앙사용(joongang_use=y), I:일간사용(ilgan_use=y)
                if (media.equals("I")) {
                    sMediaName = "일간스포츠";
                    sMediaUrl = "https://isplus.joins.com/";
                }
            }
            log.debug("{} ctg : {}", scheduleInfo.getJobSeq(), ctg);
            log.debug("{} media : {}", scheduleInfo.getJobSeq(), media);
            log.debug("{} filename : {}", scheduleInfo.getJobSeq(), filename);

            //해당하는 뉴스 정보 조회
            AllContentNewsRssDTO dto = new AllContentNewsRssDTO();
            dto.setCtgIdStr(ctg);
            dto.setMediaCd(media);
            List<AllContentNewsVO> list = allContentNewsRssJobMapper.findAll(dto);

            if (list.isEmpty()) {
                throw new MokaException("조회된 all content 뉴스 기사가 없습니다.");
            }

            //RSS String 생성
            StringBuffer stringBuffer = makeArticleRss(ctg, list);
            log.debug("stringBuffer : {} ", stringBuffer);

            //파일 업로드
            FileUpload fileUpload = new FileUpload(scheduleInfo, mokaCrypt);
            boolean success = fileUpload.stringFileUpload(stringBuffer.toString(), filename);

            //업로드 성공 시 GenStatus.content에 파일생성에 사용된 String 저장
            if (success) {
                scheduleResult.setContent(stringBuffer.toString());
            }

            //AbstractSchduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
            setFinish(success, info);

        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.toString());
            setFinish(StatusResultType.FAILED_JOB, e.getMessage(), info);
        }
    }

    private StringBuffer makeArticleRss(String ctg, List<AllContentNewsVO> list)
            throws ParseException {
        //ctg에 해당하는 정보 수신 (해당하는 ctg가 없는 경우 전체기사로 처리)
        Map<String, String> ctgInfo = (ctgInfoMapAllContent.containsKey(ctg)) ? ctgInfoMapAllContent.get(ctg) : ctgInfoMapAllContent.get("-1");

        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);

        SimpleDateFormat format1 = new SimpleDateFormat("MM/dd/yyyy hh:mm:ss");
        String ampm = calendar.get(Calendar.AM_PM) == Calendar.AM ? "AM" : "PM";
        String now = format1.format(date) + " " + ampm;

        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("<rss version=\"2.0\" >");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("   <channel>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <title>" + sMediaName + " | " + ctgInfo.get("sCtgKr") + "</title>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <link>" + joongangSvrWebDomain + "</link>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <language>ko</language>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <copyright>Copyright by JoongAng Ilbo Co., Ltd. All Rights Reserved</copyright>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <pubDate>" + now + "</pubDate>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <lastBuildDate>" + now + "</lastBuildDate>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <description>" + sMediaName + " - 아시아 첫 인터넷 신문 - Joins</description>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <image>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("           <title>" + sMediaName + "</title>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("           <url>" + imagesSvrWebDomain + "/common/rss08/JoongAngIlbo_CI_Signature.png</url>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("           <link>" + joongangSvrWebDomain + "</link>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       </image>");
        stringBuffer.append(System.lineSeparator());

        for (AllContentNewsVO vo : list) {
            String sFdUrl = newsSvrWebDomain + "/article/" + vo.getTotalId() + ctgInfo.get("sCrmTag");

            //description
            String description = replaceSymbol(vo.getArtContent(), "content");
            if (vo
                    .getNoBulkImg()
                    .trim()
                    .length() > 0) {
                //벌크를 보내지 않는 이미지 삭제
                description = description.replaceAll(
                        "<div(.)*class=\"ab_photo(.)*\"[^<>]*><div(.)*class=\"image\"><img(.)*src=\"https://pds.joins.com(" + vo
                                .getNoBulkImg()
                                .replace(",", "|") + ")\"[^<>]*><span(.)*class=\"mask\"></span></div>(.)*</div>(<br>+)?", "");
            }
            //기사 하단 카피라이트 추가
            description = description + "<br>" + "ⓒ" + sMediaName + "(" + sMediaUrl + "), 무단 전재 및 재배포 금지";
            //3연속 BR은 제거
            description = description.replaceAll("((\\s|&nbsp;)*<[bB][rR](\\/)?>(\\s)*){3,}", "<br/><br/>");

            //author
            String author = McpString.defaultValue(vo.getArtReporter());
            if (author.length() > 0 && !author.contains("N/A")) {
                author = author + " 기자";
            }

            //pubDate
            SimpleDateFormat stringFormat = new SimpleDateFormat("yyyyMMddHHmmss");
            Date newsDate = stringFormat.parse(vo.getServiceDay() + vo.getServiceTime());
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
            String pubDate = dateFormat.format(newsDate);

            stringBuffer.append("       <item>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <title><![CDATA[" + replaceSymbol(vo.getArtTitle(), "title") + "]]></title>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <link><![CDATA[" + sFdUrl + "]]></link>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <description><![CDATA[" + description + "]]></description>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <author><![CDATA[" + author + "]]></author>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <pubDate>" + pubDate + "</pubDate>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("       </item>");
            stringBuffer.append(System.lineSeparator());

        }

        stringBuffer.append("<  /channel>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("</rss>");

        return stringBuffer;
    }

    //asp 소스의 심볼처리를 그대로 이식
    public String replaceSymbol(String origin, String type) {
        origin = McpString.defaultValue(origin);
        ReplaceSymbol replaceSymbol = new ReplaceSymbol();

        //fnRemoveContentSpecialChar
        origin = replaceSymbol.fnRemoveContentSpecialChar(origin);

        if (type.equals("title")) {
            //fnDelete_tag
            origin = replaceSymbol.fnDelete_tag(origin);

        } else if (type.equals("content")) {
            //페이지 내 하드코딩
            origin = origin.replace("", "");

            //a태그 제거
            origin = origin.replaceAll("<a ?[\\/\\!]*?[^<>]*?>[^<>]*</a>", "");
            origin = origin.replaceAll("<a[^<>]*> *?<img[^<>]*> *?<span[^<>]*></span> *?</a>", "");

            //관련기사 틀 제거
            origin = origin.replaceAll(
                    "<div[^<>]*><div[^<>]*><h2><strong>관련기사</strong></h2></div><div[^<>]*><ul[^<>]*>(<li><h2[^<>]*></h2></li>)*</ul></div></div>",
                    "");

            //이미지없는 이미지 틀 제거
            origin = origin.replaceAll("<div[^<>]*> *?<div class=\"image\"> *?</div> *?</div>", "");

        }

        return origin;
    }

    //코드화에 대한 방침이 없는 관계로 소스 하드코딩 대신 데이터의 하드코딩으로 대체 > 추후 DB화 시 대체필요
    //완성된 설계없이 추가된 사항을 하나씩 전달하는 현재 업무진행방식으로는 코드화 불가능
    private void getCtgInfo() {
        Map<String, String> ctgInfo = new HashMap<>();

        ctgInfo.put("sCtgKr", "");
        ctgInfo.put("sCtgEn", "");
        ctgInfo.put("sCrmTag", "");
        ctgInfoMapAllContent.put("", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "전체기사");
        ctgInfo.put("sCtgEn", "total");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-total_list");
        ctgInfoMapAllContent.put("-1", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "정치");
        ctgInfo.put("sCtgEn", "politics");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-politics");
        ctgInfoMapAllContent.put("10", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "경제");
        ctgInfo.put("sCtgEn", "money");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-economy");
        ctgInfoMapAllContent.put("11", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "사회");
        ctgInfo.put("sCtgEn", "society");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-society");
        ctgInfoMapAllContent.put("12", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "지구촌");
        ctgInfo.put("sCtgEn", "world");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-global");
        ctgInfoMapAllContent.put("13", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "스포츠");
        ctgInfo.put("sCtgEn", "sports");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-sports");
        ctgInfoMapAllContent.put("14", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "연예");
        ctgInfo.put("sCtgEn", "star");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-star");
        ctgInfoMapAllContent.put("15", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "IT·과학");
        ctgInfo.put("sCtgEn", "ITScience");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-ITScience");
        ctgInfoMapAllContent.put("16", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "문화");
        ctgInfo.put("sCtgEn", "culture");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-culture");
        ctgInfoMapAllContent.put("17", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "사설·칼럼");
        ctgInfo.put("sCtgEn", "opinion");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-column");
        ctgInfoMapAllContent.put("20", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "화제");
        ctgInfo.put("sCtgEn", "topic");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-focus");
        ctgInfoMapAllContent.put("22", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "스포츠·연예");
        ctgInfo.put("sCtgEn", "sportsenter");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-focus");
        ctgInfoMapAllContent.put("14,15", ctgInfo);

    }
}
