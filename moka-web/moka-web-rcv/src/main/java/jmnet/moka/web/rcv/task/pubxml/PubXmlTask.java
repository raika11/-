package jmnet.moka.web.rcv.task.pubxml;

import java.io.File;
import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.code.OpCode;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.pubxml.service.PubXmlService;
import jmnet.moka.web.rcv.task.pubxml.vo.PubNewsMLTotalVo;
import jmnet.moka.web.rcv.task.pubxml.vo.PubNewsMLVo;
import jmnet.moka.web.rcv.taskinput.FileXmlTaskInput;
import jmnet.moka.web.rcv.taskinput.FileXmlTaskInputData;
import jmnet.moka.web.rcv.taskinput.FileXmlTaskInputFilePreProcess;
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
public class PubXmlTask extends Task<FileXmlTaskInputData<PubNewsMLTotalVo, PubNewsMLVo>> {
    private String sourceCode;

    public PubXmlTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        FileXmlTaskInput<PubNewsMLTotalVo, PubNewsMLVo> taskInput = new FileXmlTaskInput<>(PubNewsMLTotalVo.class, PubNewsMLVo.class);
        taskInput.setFilePreProcess(new FileXmlTaskInputFilePreProcess() {
            @Override
            public boolean preProcess(File file) {
                try {
                    final String dumpText = RcvFileUtil.readFromXml(file);
                    if (!McpString.isNullOrEmpty(dumpText)) {
                        taskInput.setSourceBuffer(PubXmlCodeConverter.convText(dumpText));
                        return true;
                    }
                } catch (Exception e) {
                    log.error("{} {} : 정상적인 XML 파일이 아닙니다. : pre-Process error", getTaskName(), file);
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
    protected boolean doVerifyData(FileXmlTaskInputData<PubNewsMLTotalVo, PubNewsMLVo> taskInputData) {
        final PubNewsMLTotalVo newsMLTotal = taskInputData.getTotalData();
        if (newsMLTotal == null) {
            log.error("{} {} : 정상적인 XML 파일이 아닙니다. : XML 파싱 에러", getTaskName(), taskInputData.getFile());
            return false;
        }

        final PubNewsMLVo newsML = newsMLTotal.getMainData();
        if (newsML == null) {
            newsMLTotal.logError("{} {} : 정상적인 XML 파일이 아닙니다.", getTaskName(), taskInputData.getFile());
            return false;
        }

        if (!newsMLTotal
                .getXmlFileName()
                .doFilenameParse(FilenameUtils.getBaseName(taskInputData
                        .getFile()
                        .toString()), this.sourceCode)) {
            newsMLTotal.logError("{} {} : 파일 이름 룰이 정상이 아닙니다.", getTaskName(), taskInputData.getFile());
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
    protected void doProcess(FileXmlTaskInputData<PubNewsMLTotalVo, PubNewsMLVo> taskInputData)
            throws RcvDataAccessException {
        final PubNewsMLTotalVo newsMLTotal = taskInputData.getTotalData();
        if (newsMLTotal.getXmlFileName().isPassProcess()) {
            newsMLTotal.logInfo("{} 해당 파일은 처리 대상 xml 이 아닙니다. {} {}", getName(), taskInputData.getFile(), newsMLTotal.getXmlFileName().getPassReason());
            taskInputData.setSuccess(true);
            return;
        }
        newsMLTotal.logInfo("{} {} 등록 시작", getTaskName(), taskInputData.getFile());

        newsMLTotal.setSourceCode(this.sourceCode);
        newsMLTotal.setXmlBody(taskInputData.getTaskInput().getSourceBuffer());

        final PubXmlService pubXmlService = getTaskManager().getPubXmlService();
        Map<String, String> ret = pubXmlService.doInsertUpdateArticleData(newsMLTotal);

        String retValue = "";
        if (ret != null) {
            retValue = ret.get("RET_VALUE");
        }

        if (McpString.isNullOrEmpty(retValue) || !retValue.equals("SU")) {
            newsMLTotal.logError("{} {} Xml Database Insert/Update Error [{}] ", getTaskName(), taskInputData.getFile(), retValue);
        } else {
            taskInputData.setSuccess(true);
            newsMLTotal.logInfo("{} {} 등록 완료 [{}]", getTaskName(), taskInputData.getFile(), retValue);
        }
    }

    @Override
    protected void doAfterProcess(FileXmlTaskInputData<PubNewsMLTotalVo, PubNewsMLVo> taskInputData)
            throws RcvDataAccessException, InterruptedException {
        super.doAfterProcess(taskInputData);

        taskInputData.doAfterProcess();
    }

    @Override
    protected void status(Map<String, Object> map) {
        super.status(map);
        map.put("sourceCode", sourceCode);
    }

    @SuppressWarnings("DuplicatedCode")
    @Override
    public boolean operation(OpCode opCode, Map<String, String> param, Map<String, Object> responseMap, boolean allFromWeb)
            throws InterruptedException {
        if (opCode == OpCode.resume || opCode == OpCode.pause) {
            if (param.containsKey("sourceCode")) {
                final String sourceCode = param.get("sourceCode");
                if( this.sourceCode.equals(sourceCode) ) {
                    setPause(opCode == OpCode.pause);
                    return true;
                }
            }
            return false;
        }
        return super.operation(opCode, param, responseMap, allFromWeb);
    }
}
