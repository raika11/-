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
import jmnet.moka.web.rcv.task.cpxml.service.CpXmlService;
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
public class CpXmlTask extends Task<FileTaskInputData<CpArticleTotalVo, CpArticleListVo>> {
    private String sourceCode;
    private String receiveImage;
    private String pdsUploadKeyTitle;
    private String editYn;

    public CpXmlTask(TaskGroup parent, Node node, XMLUtil xu)
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

        final CpArticleListVo articleList = cpArticleTotalVo.getMainData();

        if (articleList == null) {
            cpArticleTotalVo.logError("정상적인 XML 파일이 아닙니다. {}", taskInputData.getFile());
            return false;
        }

        if (articleList.getArticles() == null || articleList
                .getArticles()
                .size() == 0) {
            cpArticleTotalVo.logError("처리할 article 이 없는 XML 파일입니다. {}", taskInputData.getFile());
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
        cpArticleTotalVo.setXmlFileNM(taskInputData.getFile().toPath().getFileName().toString());
        
        final CpXmlService cpXmlService = getTaskManager().getCpXmlService();

        final CpArticleListVo articleList = cpArticleTotalVo.getMainData();
        for (CpArticleVo article : articleList.getArticles()) {
            cpArticleTotalVo.setCurArticle(article);

            cpArticleTotalVo.setArtHistoryStep(1);
            cpXmlService.insertReceiveJobStep( cpArticleTotalVo, "");
            cpArticleTotalVo.setArtHistoryStep(2);

            article.doReplaceInsertData(this.sourceCode);
            cpArticleTotalVo.setPressDT( RcvUtil.getDateFromJamDateString(article.getPressDateTime())  );

            try {
                doProcessChild(taskInputData, cpArticleTotalVo);
                cpXmlService.insertReceiveJobStep( cpArticleTotalVo, "");
            }catch ( Exception e ) {
                cpArticleTotalVo.logError("예외 발생");
                cpXmlService.insertReceiveJobStep( cpArticleTotalVo, cpArticleTotalVo.getErrorMessageList());
                throw new RcvDataAccessException( e.getMessage() );
            }
        }
        taskInputData.setSuccess(true);
    }

    private void doProcessChild(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData, CpArticleTotalVo cpArticleTotalVo)
            throws RcvDataAccessException {
        final CpArticleVo article = cpArticleTotalVo.getCurArticle();
        final MokaRcvConfiguration rcvConfiguration = getTaskManager().getRcvConfiguration();

        for (CpComponentVo component : article.getComponents()) {
            if (!component.getType().equals("I")) {
                continue;
            }
            if (McpString.isNullOrEmpty(component.getUrl())) {
                continue;
            }

            String localFilePath;
            String imageFileName;
            if (this.receiveImage.equals("Y")) {
                // 로컬이미지 다운로드(FTP 에 이미지파일도 함께 올려주는 경우)
                imageFileName = Path.of(component.getUrl()).getFileName().toString();
                localFilePath = Path.of(taskInputData.getTaskInput().getDirScan().getPath(), imageFileName).toString();
                log.info("local file {}, {}", imageFileName, localFilePath);
            } else {
                final int equalPos = component
                        .getUrl()
                        .lastIndexOf("=", component
                                .getUrl()
                                .length() - 2);
                if (equalPos != -1) {
                    // 맥심(maxim)같은 경우
                    imageFileName = component
                            .getUrl()
                            .substring(equalPos + 1);
                    if (!imageFileName.contains(".")) {
                        imageFileName = imageFileName.concat(".jpg");
                    }
                } else {
                    imageFileName = FilenameUtils.getName(component.getUrl());
                }

                // 외부 이미지 로컬에 저장
                localFilePath = taskInputData.getTempFileName(rcvConfiguration.getTempDir());
                if (!RcvImageUtil.downloadImage(component.getUrl(), localFilePath)) {
                    log.error("image download failed {}", component.getUrl());
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

                /*
                PDS Bak 에는 Upload 하지 않는 걸로..
                if (!FtpUtil.uploadFle(rcvConfiguration.getPdsBackFtpConfig(), localFilePath, uploadPath, imageFileName)) {
                    log.error("PDS Back Image Upload Failed !! {} {}", uploadPath, imageFileName);
                } else {
                    log.info("PDS Back Image Upload Success !! {} {}", uploadPath, imageFileName);
                }
                 */

                if (!FtpUtil.uploadFle(rcvConfiguration.getPdsFtpConfig(), localFilePath, uploadPath, imageFileName)) {
                    log.error("PDS Image Upload Failed !! {} {}", uploadPath, imageFileName);
                } else {
                    final String serviceImageUrl = rcvConfiguration
                            .getImageWebSvrUrl()
                            .concat(uploadPath)
                            .concat(imageFileName);

                    log.info("PDS  Image Upload Success !! {} {} {}", serviceImageUrl, uploadPath, imageFileName);

                    // 본문에 이미지태그가 안들어오는 기사들은 상단에 가운데정렬 이미지로 추가한다.
                    if (this.sourceCode.equals("j4") ) {
                        String ImageTag = "<div><!--@img_tag_s@--><div class=\"html_photo_center\"><img src=\""
                                .concat(serviceImageUrl)
                                .concat("\" />");
                        if (!McpString.isNullOrEmpty(component.getDesc())) {
                            ImageTag = ImageTag
                                    .concat("<span class=\"rt\">")
                                    .concat(component.getDesc())
                                    .concat("</span>");
                        }
                        ImageTag = ImageTag.concat("</div><!--@img_tag_e@--></div>");

                        article.setContent(ImageTag
                                .concat("\r\n")
                                .concat(article.getContent()));
                    } else {
                        article.setContent(article
                                .getContent()
                                .replace(RcvUtil.cpReplaceInsertData(component.getUrl()), serviceImageUrl));
                    }
                }
                component.setUrl(uploadPath.concat(imageFileName));
            }
        }

        final CpXmlService cpXmlService = getTaskManager().getCpXmlService();
        cpXmlService.doInsertUpdateArticleData(cpArticleTotalVo);
    }

    @Override
    protected void doAfterProcess(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData)
            throws RcvDataAccessException {
        super.doAfterProcess(taskInputData);

        taskInputData.doAfterProcess();
    }
}
