package jmnet.moka.web.rcv.task.cpxml;

import java.nio.file.Path;
import java.util.Date;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleListVo;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleTotalVo;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpComponentVo;
import jmnet.moka.web.rcv.taskinput.FileTaskInput;
import jmnet.moka.web.rcv.taskinput.FileTaskInputData;
import jmnet.moka.web.rcv.util.FtpUtil;
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
 * Package : jmnet.moka.web.rcv.task.cpxml
 * ClassName : CpXmlRcvTask
 * Created : 2020-11-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-10 010 오후 4:59
 */
@Slf4j
public class CpXmlRcvTask extends Task<FileTaskInputData<CpArticleTotalVo, CpArticleListVo>> {
    private String sourceCode;
    private String receiveImage;
    private String pdsUploadKeyTitle;
    private String editYn;

    public CpXmlRcvTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        return new FileTaskInput<>(CpArticleTotalVo.class, CpArticleListVo.class);
    }

    @Override
    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super.load(node, xu);

        this.sourceCode = xu.getString(node, "./@sourceCode", "");
        if (McpString.isNullOrEmpty(this.sourceCode)) {
            throw new RcvException("sourceCode 환경 값 설정이 잘못되었습니다.");
        }
        this.receiveImage = xu.getString(node, "./@receiveImage", "N");
        this.editYn = xu.getString(node, "./@editYn", "N");
        this.pdsUploadKeyTitle = xu.getString(node, "./@pdsUploadKeyTitle", "");
        if (McpString.isNullOrEmpty(this.pdsUploadKeyTitle)) {
            throw new RcvException("pdsUploadKeyTitle 환경 값 설정이 잘못되었습니다.");
        }
    }

    @Override
    protected boolean doVerifyData(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData) {
        final CpArticleTotalVo cpArticleTotalVo = taskInputData.getTotalData();
        if (cpArticleTotalVo == null) {
            log.error("cp ArticleTotalVo를 생성할 수 없습니다.");
            return false;
        }

        final CpArticleListVo artcleList = cpArticleTotalVo.getMainData();

        if (artcleList == null) {
            cpArticleTotalVo.logError("정상적인 XML 파일이 아닙니다. {}", taskInputData.getFile());
            return false;
        }

        if (artcleList.getArticles() == null || artcleList
                .getArticles()
                .size() == 0) {
            cpArticleTotalVo.logError("처리할 Article이 없는 XML 파일입니다. {}", taskInputData.getFile());
            return false;
        }

        return true;
    }

    @Override
    protected void doProcess(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData)
            throws RcvDataAccessException {
        final CpArticleTotalVo cpArticleTotalVo = taskInputData.getTotalData();

        cpArticleTotalVo.setSourceCode(this.sourceCode);
        cpArticleTotalVo.setEditYn(this.editYn);

        final CpArticleListVo artcleList = cpArticleTotalVo.getMainData();
        for (CpArticleVo article : artcleList.getArticles()) {
            cpArticleTotalVo.setCurArticle(article);
            article.doReplaceInsertData(this.sourceCode);

            do {
                try {
                    doProcessChild(taskInputData, cpArticleTotalVo);
                   } catch (Exception e) {
                    cpArticleTotalVo.logError("기사 해석 에러 발생 반복 {}", e);
                    if( isEnd() )
                        break;
                    sleep( false );
                    continue;
                }
                break;
            } while (true);
        }
    }

    private void doProcessChild(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData, CpArticleTotalVo cpArticleTotalVo)
            throws RcvDataAccessException {
        final CpArticleVo article = cpArticleTotalVo.getCurArticle();
        final MokaRcvConfiguration rcvConfiguration = getTaskManager().getRcvConfiguration();

        for (CpComponentVo componet : article.getComponents()) {
            if (componet
                    .getType()
                    .compareTo("I") != 0) {
                continue;
            }
            if (McpString.isNullOrEmpty(componet.getUrl())) {
                continue;
            }

            String localFilePath;
            String imageFileName;
            if (this.receiveImage.compareTo("Y") == 0) {
                // 로컬이미지 다운로드(FTP에 이미지파일도 함께 올려주는 경우)
                imageFileName = Path
                        .of(componet.getUrl())
                        .getFileName()
                        .toString();
                localFilePath = Path
                        .of(taskInputData
                                .getTaskInput()
                                .getDirScan()
                                .getPath(), imageFileName)
                        .toString();
                log.info("local file {}, {}", imageFileName, localFilePath);
            } else {
                final int equalPos = componet
                        .getUrl()
                        .lastIndexOf("=", componet
                                .getUrl()
                                .length() - 2);
                if (equalPos != -1) {
                    // 맥심(maxim)같은 경우
                    imageFileName = componet
                            .getUrl()
                            .substring(equalPos + 1);
                    if (!imageFileName.contains(".")) {
                        imageFileName = imageFileName.concat(".jpg");
                    }
                } else {
                    imageFileName = FilenameUtils.getName(componet.getUrl());
                }

                // 외부 이미지 로컬에 저장
                localFilePath = taskInputData.getTempFileName(rcvConfiguration.getTempDir());
                if (!RcvImageUtil.downloadImage(componet.getUrl(), localFilePath)) {
                    log.error("image download failed {}", componet.getUrl());
                    localFilePath = "";
                }
            }
            if (!McpString.isNullOrEmpty(localFilePath)) {
                imageFileName = imageFileName
                        .replace("\r", "")
                        .replace("\n", "");

                log.info("local file {}, {}", imageFileName, localFilePath);

                final String uploadPath = "/news/component/"
                        .concat(this.pdsUploadKeyTitle)
                        .concat("/")
                        .concat(McpDate.dateStr(new Date(), "yyyyMM/dd/"));

                if (!FtpUtil.uploadFle(rcvConfiguration.getPdsBackFtpConfig(), localFilePath, uploadPath, imageFileName)) {
                    log.error("PDS Back Image Upload Failed !! {} {}", uploadPath, imageFileName);
                } else {
                    log.info("PDS Back Image Upload Success !! {} {}", uploadPath, imageFileName);
                }

                if (!FtpUtil.uploadFle(rcvConfiguration.getPdsFtpConfig(), localFilePath, uploadPath, imageFileName)) {
                    log.error("PDS Image Upload Failed !! {} {}", uploadPath, imageFileName);
                } else {
                    final String serviceImageUrl = rcvConfiguration
                            .getImageWebSvrUrl()
                            .concat(uploadPath)
                            .concat(imageFileName);

                    log.info("PDS  Image Upload Success !! {} {} {}", serviceImageUrl, uploadPath, imageFileName);

                    // 본문에 이미지태그가 안들어오는 기사들은 상단에 가운데정렬 이미지로 추가한다.
                    if (this.sourceCode.compareTo("j4") == 0) {
                        String ImageTag = "<div><!--@img_tag_s@--><div class=\"html_photo_center\"><img src=\""
                                .concat(serviceImageUrl)
                                .concat("\" />");
                        if (!McpString.isNullOrEmpty(componet.getDesc())) {
                            ImageTag = ImageTag
                                    .concat("<span class=\"rt\">")
                                    .concat(componet.getDesc())
                                    .concat("</span>");
                        }
                        ImageTag = ImageTag.concat("</div><!--@img_tag_e@--></div>");

                        article.setContent(ImageTag
                                .concat("\r\n")
                                .concat(article.getContent()));
                    } else {
                        article.setContent(article
                                .getContent()
                                .replace(RcvUtil.cpReplaceInsertData(componet.getUrl()), serviceImageUrl));
                    }
                }
                componet.setUrl(uploadPath.concat(imageFileName));
            }
        }

        final CpXmlRcvService cpXmlRcvService = getTaskManager().getCpXmlRcvService();
        cpXmlRcvService.doInsertUpdateArticleData(cpArticleTotalVo);
    }

    @Override
    protected void doAfterProcess(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData)
            throws RcvDataAccessException {
        super.doAfterProcess(taskInputData);
    }
}
