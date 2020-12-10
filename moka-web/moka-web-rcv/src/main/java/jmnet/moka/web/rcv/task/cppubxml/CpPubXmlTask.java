package jmnet.moka.web.rcv.task.cppubxml;

import java.io.File;
import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.cppubxml.service.CpPubXmlService;
import jmnet.moka.web.rcv.task.cppubxml.vo.CpPubNewsMLTotalVo;
import jmnet.moka.web.rcv.task.cppubxml.vo.CpPubNewsMLVo;
import jmnet.moka.web.rcv.taskinput.FileTaskInput;
import jmnet.moka.web.rcv.taskinput.FileTaskInputData;
import jmnet.moka.web.rcv.taskinput.FileTaskInputFilePreProcess;
import jmnet.moka.web.rcv.util.RcvFileUtil;
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
public class CpPubXmlTask extends Task<FileTaskInputData<CpPubNewsMLTotalVo, CpPubNewsMLVo>> {
    private String sourceCode;

    public CpPubXmlTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        FileTaskInput<CpPubNewsMLTotalVo, CpPubNewsMLVo> taskInput = new FileTaskInput<>(CpPubNewsMLTotalVo.class, CpPubNewsMLVo.class);
        taskInput.setFilePreProcess(new FileTaskInputFilePreProcess() {
            @Override
            public boolean preProcess(File file) {
                try {
                    final String dumpText = RcvFileUtil.readFromXml(file);
                    if (!McpString.isNullOrEmpty(dumpText)) {
                        taskInput.setSourceBuffer(CpPubXmlCodeConverter.convText(dumpText));
                        return true;
                    }
                } catch (Exception e) {
                    log.error("File preprocess error {}", file);
                }
                return false;
            }
        });
        return taskInput;
    }

    @Override
    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super.load(node, xu);
        this.sourceCode = xu.getString(node, "./@sourceCode", "");
        if (McpString.isNullOrEmpty(this.sourceCode)) {
            throw new RcvException("sourceCode 환경 값 설정이 잘못되었습니다.");
        }
    }

    @Override
    protected boolean doVerifyData(FileTaskInputData<CpPubNewsMLTotalVo, CpPubNewsMLVo> taskInputData) {
        final CpPubNewsMLTotalVo newsMLTotal = taskInputData.getTotalData();
        if (newsMLTotal == null) {
            log.error("cpPub NewsMLTotalVo를 생성할 수 없습니다.");
            return false;
        }

        final CpPubNewsMLVo newsML = newsMLTotal.getMainData();
        if (newsML == null) {
            newsMLTotal.logError("정상적인 XML 파일이 아닙니다. {}", taskInputData.getFile());
            return false;
        }

        if (!newsMLTotal
                .getXmlFileName()
                .doFilenameParse(FilenameUtils.getBaseName(taskInputData
                        .getFile()
                        .toString()), this.sourceCode)) {
            newsMLTotal.logError("파일 이름 룰이 정상이 아닙니다. {}", taskInputData.getFile());
            return false;
        }

        newsMLTotal.setArticleItemId(newsML
                .getNewsItem()
                .getIdentification()
                .getNewsIdentifier()
                .getNewsItemId());
        if (newsMLTotal.getArticleItemId().length() > 7) {
            newsMLTotal.setArticleItemId(newsMLTotal.getArticleItemId().substring(newsMLTotal.getArticleItemId().length() - 7));
        }

        String[] split = newsML
                .getNewsItem()
                .getIdentification()
                .getNewsIdentifier()
                .getPublicIdentifier()
                .split(":");
        if (split.length > 0) {
            newsMLTotal.setArticleIssue(split[0]);
        }

        if (newsML.getNewsItem()
                .getNewsComponents()
                .getEquivalentsList()
                .length() == 0) {
            newsMLTotal.getXmlFileName().setPassProcess(true);
            newsMLTotal.getXmlFileName().setPassReason("NewsComponent 가 하나도 없는 데이터이다.");
        }

        return true;
    }

    @Override
    protected void doProcess(FileTaskInputData<CpPubNewsMLTotalVo, CpPubNewsMLVo> taskInputData)
            throws RcvDataAccessException {
        final CpPubNewsMLTotalVo newsMLTotal = taskInputData.getTotalData();
        if (newsMLTotal.getXmlFileName().isPassProcess()) {
            newsMLTotal.logInfo("해당 파일은 처리 대상 xml 이 아닙니다. {} {}", taskInputData.getFile(), newsMLTotal.getXmlFileName().getPassReason());
            taskInputData.setSuccess(true);
            return;
        }
        newsMLTotal.setSourceCode(this.sourceCode);
        newsMLTotal.setXmlBody(taskInputData.getTaskInput().getSourceBuffer());

        final CpPubXmlService cpPubXmlService = getTaskManager().getCpPubXmlService();
        Map<String, String> ret = cpPubXmlService.doInsertUpdateArticleData(newsMLTotal);

        String retValue = "";
        if (ret != null) {
            retValue = ret.get("RET_VALUE");
        }

        if (McpString.isNullOrEmpty(retValue) || !retValue.equals("SU")) {
            newsMLTotal.logError("Xml Database Insert/Update Error [{}] {}", retValue, taskInputData.getFile());
        } else {
            taskInputData.setSuccess(true);
            newsMLTotal.logInfo("Xml Database Insert/Update Success !! [{}] {}", retValue, taskInputData.getFile());
        }
    }

    @Override
    protected void doAfterProcess(FileTaskInputData<CpPubNewsMLTotalVo, CpPubNewsMLVo> taskInputData)
            throws RcvDataAccessException {
        super.doAfterProcess(taskInputData);

        taskInputData.doAfterProcess();
    }
}
