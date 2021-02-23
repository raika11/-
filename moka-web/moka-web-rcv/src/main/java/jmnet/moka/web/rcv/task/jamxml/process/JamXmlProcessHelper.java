package jmnet.moka.web.rcv.task.jamxml.process;

import java.util.Date;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.base.TaskManager;
import jmnet.moka.web.rcv.task.jamxml.service.JamXmlService;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemVo;
import jmnet.moka.web.rcv.taskinput.FileXmlTaskInputData;
import jmnet.moka.web.rcv.util.FtpUtil;
import jmnet.moka.web.rcv.util.RcvImageUtil;
import jmnet.moka.web.rcv.util.RcvUtil;
import org.apache.commons.io.FilenameUtils;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml
 * ClassName : JamXmlRcvServiceHelper
 * Created : 2020-12-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-04 004 오후 2:41
 */
public class JamXmlProcessHelper {
    static public boolean doProcess_StarImage(FileXmlTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData, JamArticleTotalVo jamArticleTotalVo,
            TaskManager taskManager, JamXmlService jamXmlService)
            throws RcvDataAccessException {
        final String tmpRepList = jamArticleTotalVo.getMainData().getReporterJcmsRepSeqList();
        final String tmpKwdList = jamArticleTotalVo.getMainData().getKeywordTagList();
        if (McpString.isNullOrEmpty(tmpRepList) || McpString.isNullOrEmpty(tmpKwdList)) {
            return true;
        }

        //본문 첫번째 사진과 워터마크 이미지가 있으면 공유용 이미지를 제작한다.
        List<Map<String, String>> mapList = jamXmlService.selectIssueSeriesReporter(tmpRepList, tmpKwdList);
        if (mapList.size() == 0) {
            return true;
        }

        Map<String, String> map = mapList.get(0);
        if ( !RcvUtil.getMapStringData(map,"STAR_REP_YN").equals("Y") ) {
            return true;
        }

        ItemVo vo = jamArticleTotalVo.getMainData().getContents().getItemsByType("HP");
        if (vo == null) {
            return true;
        }

        final String imageUrl = vo.getUrl();
        // 외부 이미지
        final String imageResizeUrl = taskManager.getRcvConfiguration().getImageResizerSvrUrl();
        final String sourceImageUrl = imageResizeUrl + "/?t=k&w=600&h=314&u=" + imageUrl;
        final String watermarkUrl = map.get("LOGO_IMG_SHR");
        if (McpString.isNullOrEmpty(imageUrl)) {
            return true;
        }

        final String tempFileName = taskInputData.getTempFileName(taskManager.getRcvConfiguration().getTempDir());
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

            if (!FtpUtil.uploadFle(taskManager.getRcvConfiguration().getPdsFtpConfig(), tempFileName, pdsUploadPath, targetFileName)) {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public static void doProcess_ItemsPreprocess(FileXmlTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData, JamArticleTotalVo articleTotal,
            TaskManager taskManager, String type, ItemVo item) {
        final MokaRcvConfiguration rcvConfiguration = taskManager.getRcvConfiguration();

        switch (type) {
            case "MF":
            case "MH": {
                doProcess_ItemsPreprocess_OvpPreviewDownload(taskInputData, articleTotal, taskManager, item);
                break;
            }
            case "NN": {
                //네이버 영상 embed url 이 변경됐다. 이전 경로일 경우 변경
                item.setUrl(item.getUrl().replace("//tv.naver.com/v/", "//tv.naver.com/embed/"));
                break;
            }
            case "HP":{
                if( rcvConfiguration.getUploadToServiceImage().equals("Y") ) {
                    final String url = item.getUrl();
                    if( !McpString.isNullOrEmpty(url) ) {
                        final String localFilePath = taskInputData.getTempFileName(rcvConfiguration.getTempDir());
                        if (RcvImageUtil.downloadImage(url, localFilePath)) {
                            final String imageFileName = FilenameUtils.getName(url);
                            final String uploadPath = RcvUtil.getJamMiddleUrlPath(url);
                            if (!FtpUtil.uploadFle(rcvConfiguration.getPdsFtpConfig(), localFilePath, uploadPath, imageFileName)) {
                                articleTotal.logError("PDS Image Upload Failed !! {} {}", uploadPath, imageFileName);
                            }
                            else
                                articleTotal.logInfo("   -- UploadToService middle PDS Image Upload Success {} {}", uploadPath, imageFileName);
                        }
                        else
                            articleTotal.logError("image download failed {}", url);
                    }
                }
            }
        }
    }

    private static void doProcess_ItemsPreprocess_OvpPreviewDownload(FileXmlTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData,
            JamArticleTotalVo articleTotal, TaskManager taskManager, ItemVo item) {
        //우얄라 동영상 대표 이미지 다운로드/업로드(PDS)
        //http://cf.c.ooyala.com/dlYXQ0YzE6ta1Aczbf1hjCfi5zFe489v/3Gduepif0T1UGY8H4xMDoxOjA4MTsiGN
        //브라이트코브
        //https://cf-images.ap-northeast-1.prod.boltdns.net/v1/jit/6057955867001/963c3493-1a68-48ff-9b21-b7a89ac89d5b/main/1280x720/7s476ms/match/image.jpg
        //https://cf-images.ap-northeast-1.prod.boltdns.net/v1/static/6057955867001/dd7fc2ec-5c72-405d-85b6-2350aa5759ab/5d27de6c-6418-412f-bfdc-49651a4d4415/1280x720/match/image.jpg

        final MokaRcvConfiguration rcvConfiguration = taskManager.getRcvConfiguration();

        if (McpString.isNullOrEmpty(item.getPoster())) {
            return;
        }

        if (!(item.getPoster().contains("http://") || item.getPoster().contains("https://"))) {
            return;
        }

        boolean success = false;

        final String tempFileName = taskInputData.getTempFileName(rcvConfiguration.getTempDir());
        if (RcvImageUtil.downloadImage(item.getPoster(), tempFileName)) {
            String uploadFileName;
            if (item.getPoster().split("/").length > 7) {
                uploadFileName = "ovp_" + item.getPoster().split("/")[6] + ".jpg";
            } else {
                uploadFileName = "ooyala_" + item.getPoster().split("/")[item.getPoster().split("/").length - 2] + ".jpg";
            }

            final String uploadPath = "/news/component/htmlphoto_mmdata/".concat(McpDate.dateStr(new Date(), "yyyyMM/dd/"));
            if (FtpUtil.uploadFle(rcvConfiguration.getPdsFtpConfig(), tempFileName, uploadPath, uploadFileName)) {
                item.setPoster(uploadPath + uploadFileName);
                success = true;
            } else {
                articleTotal.logError("동영상 대표 이미지 업로드(PDS) 실패");
            }
        } else {
            articleTotal.logError("동영상 대표 이미지 다운로드 실패 {}", item.getPoster());
        }

        if (!success) {
            item.setPoster("");
        }
    }
}
