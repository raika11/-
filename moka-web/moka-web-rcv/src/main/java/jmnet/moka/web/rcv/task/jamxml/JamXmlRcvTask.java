package jmnet.moka.web.rcv.task.jamxml;

import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemVo;
import jmnet.moka.web.rcv.taskinput.FileTaskInput;
import jmnet.moka.web.rcv.taskinput.FileTaskInputData;
import jmnet.moka.web.rcv.util.FtpUtil;
import jmnet.moka.web.rcv.util.RcvFileUtil;
import jmnet.moka.web.rcv.util.RcvImageUtil;
import jmnet.moka.web.rcv.util.RcvUtil;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task
 * ClassName : JamXMLRcvTask
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 4:15
 */
@Slf4j
public class JamXmlRcvTask extends Task<FileTaskInputData<JamArticleTotalVo, JamArticleVo>> {
    private int sourceCode;

    public JamXmlRcvTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        return new FileTaskInput<>(JamArticleTotalVo.class, JamArticleVo.class);
    }

    @Override
    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super.load(node, xu);
        this.sourceCode = RcvUtil.ParseInt(xu.getString(node, "./@sourceCode", ""));
        if (this.sourceCode == 0) {
            throw new RcvException("sourceCode 환경 값 설정이 잘못되었습니다.");
        }
    }

    @Override
    protected boolean doVerifyData(FileTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData) {
        final JamArticleTotalVo jamArticleTotalVo = taskInputData.getTotalData();
        if (jamArticleTotalVo == null) {
            log.error("JamArticleTotalVo를 생성할 수 없습니다.");
            return false;
        }

        if (jamArticleTotalVo.getMainData() == null) {
            jamArticleTotalVo.logError("정상적인 XML 파일이 아닙니다. {}", taskInputData.getFile());
            return false;
        }

        if (McpString.isNullOrEmpty(jamArticleTotalVo
                .getMainData()
                .getIud())) {
            jamArticleTotalVo.logError("iud flag 없음 {}", taskInputData.getFile());
            return false;
        }

        if (McpString.isNullOrEmpty(jamArticleTotalVo
                .getMainData()
                .getTitle())) {
            jamArticleTotalVo.logError("title 없음 {}", taskInputData.getFile());
            return false;
        }

        if (jamArticleTotalVo
                .getMainData()
                .getCategoies()
                .size() == 0) {
            jamArticleTotalVo.logError("분류 코드 없음 {}", taskInputData.getFile());
            return false;
        }
        return true;
    }

    @Override
    protected void doProcess(FileTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData)
            throws RcvDataAccessException {
        final JamXmlRcvService jamXmlRcvService = getTaskManager().getJamXmlRcvService();

        JamArticleTotalVo jamArticleTotalVo = taskInputData.getTotalData();
        jamArticleTotalVo.setSourceCode(this.sourceCode);
        jamArticleTotalVo.setXmlFileNM(taskInputData
                .getFile()
                .toPath()
                .getFileName()
                .toString());

        Map<String, String> map = jamXmlRcvService.selectSectCodeByContCode(jamArticleTotalVo);
        if (map == null || map.size() == 0 || map.get("SERVCODE") == null || map.get("SECTCODE") == null) {
            jamArticleTotalVo.logError("중앙일보 분류코드에 없는 코드가 넘어옴,  selectSectCodeByContCode Error");
            return;
        }
        jamArticleTotalVo.setServCode(map.get("SERVCODE"));
        jamArticleTotalVo.setSectCode(map.get("SECTCODE"));

        //스타기자 타입 (커버:Z, 와이드:Y, 인터뷰:X, 갤러리:W, 영상:V)이고, 스타기자인 경우 첫번째 이미지 썸네일을 생성하고 워터마크를 적용한다.
        if (("Z,Y,X,W,V").contains(jamArticleTotalVo
                .getMainData()
                .getTmplType())) {
            if (!doProcessStarImage(taskInputData, jamXmlRcvService, jamArticleTotalVo)) {
                jamArticleTotalVo.logError("스타 기자 이미지 처리 에러  selectSectCodeByContCode Error");
                throw new RcvDataAccessException("스타 기자 이미지 처리 에러");
            }
        }

        // Contents Item 처리
        for (ItemVo item : jamArticleTotalVo
                .getMainData()
                .getContents()
                .getItems()) {
            doProcessContentsItem(taskInputData, jamArticleTotalVo, item);
        }

        //***************************************************************************************************
        //기사 본문에 pds, news 수정
        //네이버, 인스타그램 이전 경로일 경우 변경
        jamArticleTotalVo
                .getMainData()
                .getContents()
                .setBody(jamArticleTotalVo
                        .getMainData()
                        .getContents()
                        .getBody()
                        .replace("http://pds.joins.com", "https://pds.joins.com")
                        .replace("http://news.joins.com", "https://news.joins.com")
                        .replace("http://mnews.joins.com", "https://mnews.joins.com")
                        .replace("//tv.naver.com/v/", "//tv.naver.com/embed/")
                        .replace("//www.instagram.com/tv/", "//www.instagram.com/p/"));
        //***************************************************************************************************


        /*
        //기사 저장 및 수정
        if (oRcvArt.IUD.ToString().Trim() == "I" || oRcvArt.IUD.ToString().Trim() == "U")
        {
            strRcvResult = new Biz_Tx().SetReceiveArticleData(strSourceCode, oRcvArt);
        }
        else if (oRcvArt.IUD.ToString().Trim() == "D")
        {
            strRcvResult = new Biz_Tx().DelReceiveArticleData(strSourceCode, oRcvArt);
        */



        /*
        if (!jamXmlRcvService.insertReceiveJobStep(jamArticleTotalVo)) {
            return;
        }

         */

        //taskInputData.setSuccess( true );
    }

    private boolean doProcessStarImage(FileTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData, JamXmlRcvService jamXmlRcvService, JamArticleTotalVo jamArticleTotalVo)
            throws RcvDataAccessException {
        final String tmpRepList = jamArticleTotalVo
                .getMainData()
                .getReporterJcmsRepSeqList();
        final String tmpKwdList = jamArticleTotalVo
                .getMainData()
                .getKeywordTagList();
        if (McpString.isNullOrEmpty(tmpRepList) || McpString.isNullOrEmpty(tmpKwdList)) {
            return true;
        }

        //본문 첫번째 사진과 워터마크 이미지가 있으면 공유용 이미지를 제작한다.
        List<Map<String, String>> mapList = jamXmlRcvService.selectIssueSeriesReporter(tmpRepList, tmpKwdList);
        if (mapList.size() == 0) {
            return true;
        }

        Map<String, String> map = mapList.get(0);
        if (map
                .get("STAR_REP_YN")
                .compareTo("Y") != 0) {
            return true;
        }

        ItemVo vo = jamArticleTotalVo
                .getMainData()
                .getContents()
                .getItemsByType("HP");
        if (vo == null) {
            return true;
        }

        final String imageUrl = vo.getUrl();
        // 외부 이미지
        final String imageResizeUrl = getTaskManager().getRcvConfiguration().getImageResizerUrl();
        final String sourceImageUrl = imageResizeUrl + "/?t=k&w=600&h=314&u=" + imageUrl;
        final String watermarkUrl = map.get("LOGO_IMG_SHR");
        if (McpString.isNullOrEmpty(imageUrl)) {
            return true;
        }

        final String tempFileName = taskInputData.getTempFileName(getTaskManager()
                .getRcvConfiguration()
                .getTempDir());
        if (tempFileName == null) {
            throw new RcvDataAccessException("Temp File을 만들 수 없습니다.");
        }

        try {
            if (!RcvImageUtil.combineWatermarkImage(tempFileName, sourceImageUrl, watermarkUrl)) {
                return false;
            }

            final String targetFileName = FilenameUtils
                    .getName(imageUrl)
                    .concat(".shr.jpg");
            String pdsUploadPath = imageUrl.substring(imageUrl.indexOf("/news"));
            pdsUploadPath = pdsUploadPath.substring(0, pdsUploadPath.lastIndexOf("/") + 1);

            if (!FtpUtil.uploadFle(getTaskManager()
                    .getRcvConfiguration()
                    .getPdsFtpConfig(), tempFileName, pdsUploadPath, targetFileName)) {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @Override
    protected void doAfterProcess(FileTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData)
            throws RcvDataAccessException{
        super.doAfterProcess(taskInputData);

        final JamXmlRcvService jamXmlRcvService = getTaskManager().getJamXmlRcvService();

        String targetDir;
        if( !taskInputData.isSuccess() ){
            targetDir = taskInputData
                    .getTaskInput()
                    .getDirFailed();
            final JamArticleTotalVo jamArticleTotalVo = taskInputData.getTotalData();

//            jamXmlRcvService.updateReceiveJobStep( articleVo.getIud(), "0", "0", articleVo.getMediaCode().getValue(), articleVo.getId().getValue(), articleVo.get  );

            getTaskManager().sendErrorSMS("[JamRecv] XML 처리 오류");
        }else{
            targetDir = taskInputData
                    .getTaskInput()
                    .getDirSuccess();
        }

        try {
            RcvFileUtil.moveFileToDateDir(taskInputData.getFile(), targetDir, McpDate.dateStr(new Date(), "yyyyMM/dd"));
        } catch (RcvException e) {
            log.error(e.getMessage());
        }
    }

    private void doProcessContentsItem(FileTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData, JamArticleTotalVo jamArticleTotalVo, ItemVo item) {
        final String type = item
                .getType()
                .toUpperCase();
        switch (type) {
            case "MF":
            case "MH": {
                //우얄라 동영상 대표 이미지 다운로드/업로드(PDS)
                //http://cf.c.ooyala.com/dlYXQ0YzE6ta1Aczbf1hjCfi5zFe489v/3Gduepif0T1UGY8H4xMDoxOjA4MTsiGN
                //브라이트코브
                //https://cf-images.ap-northeast-1.prod.boltdns.net/v1/jit/6057955867001/963c3493-1a68-48ff-9b21-b7a89ac89d5b/main/1280x720/7s476ms/match/image.jpg
                //https://cf-images.ap-northeast-1.prod.boltdns.net/v1/static/6057955867001/dd7fc2ec-5c72-405d-85b6-2350aa5759ab/5d27de6c-6418-412f-bfdc-49651a4d4415/1280x720/match/image.jpg

                if (McpString.isNullOrEmpty(item.getPoster())) {
                    return;
                }

                if (!(item
                        .getPoster()
                        .contains("http://") || item
                        .getPoster()
                        .contains("https://"))) {
                    return;
                }

                final MokaRcvConfiguration rcvConfiguration = getTaskManager().getRcvConfiguration();

                boolean success = false;

                final String tempFileName = taskInputData.getTempFileName(rcvConfiguration.getTempDir());
                if (RcvImageUtil.downloadImage(item.getPoster(), tempFileName)) {
                    String uploadFileName;
                    if (item
                            .getPoster()
                            .split("/").length > 7) {
                        uploadFileName = "ovp_" + item
                                .getPoster()
                                .split("/")[6] + ".jpg";
                    } else {
                        uploadFileName = "ooyala_" + item
                                .getPoster()
                                .split("/")[item
                                .getPoster()
                                .split("/").length - 2] + ".jpg";
                    }

                    final String uploadPath = "news/component/htmlphoto_mmdata/".concat(McpDate.dateStr(new Date(), "yyyyMM/dd/"));
                    if (FtpUtil.uploadFle(rcvConfiguration.getPdsFtpConfig(), tempFileName, uploadPath, uploadFileName)) {
                        item.setPoster("/" + uploadPath + uploadFileName);
                        success = true;
                    } else {
                        jamArticleTotalVo.logError("동영상 대표 이미지 업로드(PDS) 실패");
                    }
                } else {
                    jamArticleTotalVo.logError("동영상 대표 이미지 다운로드 실패");
                }

                if (!success) {
                    item.setPoster("");
                }
                break;
            }
            case "NN": {
                //네이버 영상 embed url이 변경됐다. 이전 경로일 경우 변경
                item.setUrl(item
                        .getUrl()
                        .replace("//tv.naver.com/v/", "//tv.naver.com/embed/"));
                break;
            }
        }
    }
}

