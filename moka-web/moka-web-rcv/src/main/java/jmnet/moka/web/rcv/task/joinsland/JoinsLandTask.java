package jmnet.moka.web.rcv.task.joinsland;

import java.text.ParseException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.joinsland.service.JoinsLandService;
import jmnet.moka.web.rcv.task.joinsland.vo.JoinsLandArticleTotalVo;
import jmnet.moka.web.rcv.task.joinsland.vo.JoinsLandArticleVo;
import jmnet.moka.web.rcv.taskinput.FileXmlTaskInput;
import jmnet.moka.web.rcv.taskinput.FileXmlTaskInputData;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.joinsland
 * ClassName : JoinsLandTask
 * Created : 2021-02-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-01 001 오전 9:25
 */
@Slf4j
public class JoinsLandTask extends Task<FileXmlTaskInputData<JoinsLandArticleTotalVo, JoinsLandArticleVo>> {
    public JoinsLandTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        return new FileXmlTaskInput<>(JoinsLandArticleTotalVo.class, JoinsLandArticleVo.class);
    }

    @Override
    protected boolean doVerifyData(FileXmlTaskInputData<JoinsLandArticleTotalVo, JoinsLandArticleVo> taskInputData) {
        final JoinsLandArticleTotalVo articleTotal = taskInputData.getTotalData();
        if( articleTotal == null ) {
            log.error("{} {} : XML 파싱 에러, JoinsLandArticleTotalVo를 생성할 수 없습니다.", getTaskName(), taskInputData.getFile());
            return false;
        }

        final JoinsLandArticleVo article = articleTotal.getMainData();
        if (article == null) {
            articleTotal.logError("{} {} : 정상적인 XML 파일이 아닙니다.", getTaskName(), taskInputData.getFile());
            return false;
        }

        if (McpString.isNullOrEmpty(article.getServiceDay()) || McpString.isNullOrEmpty(article.getServiceTime())) {
            articleTotal.logError("{} {} : 정상적인 XML 파일이 아닙니다. ServiceDate", getTaskName(), taskInputData.getFile());
            return false;
        }

        if (article.getServiceDay().length() != 8 || article.getServiceTime().length() != 6) {
            articleTotal.logError("{} {} : 정상적인 XML 파일이 아닙니다. ServiceDate 2", getTaskName(), taskInputData.getFile());
            return false;
        }

        try {
            articleTotal.setInsDt(McpDate.date("yyyyMMddHHmmss", article.getServiceDay().concat(article.getServiceTime())));
        } catch (ParseException e) {
            articleTotal.logError("{} {} : 정상적인 XML 파일이 아닙니다. ServiceDate 3", getTaskName(), taskInputData.getFile());
            return false;
        }
        return true;
    }

    @Override
    public void doProcess(FileXmlTaskInputData<JoinsLandArticleTotalVo, JoinsLandArticleVo> taskInputData)
            throws RcvDataAccessException {
        final JoinsLandArticleTotalVo articleTotal = taskInputData.getTotalData();
        final JoinsLandArticleVo article = articleTotal.getMainData();

        articleTotal.logInfo( "{} 파일 [{}] {} [{}]-{} 시작", getTaskName(), taskInputData.getFile().getName(), article.getIud(), article.getTitle() );

        article.setContent( article.getContent()
                                   .replaceAll( "<br( *)(/*)>", "\r\n")
                                   .replaceAll( " name=\".*?(.jpg|.gif|.bmp)\"", "") );

        final JoinsLandService joinsLandService = getTaskManager().getJoinsLandService();
        joinsLandService.doInsertUpdateArticleData(articleTotal);

        taskInputData.setSuccess( true );

        articleTotal.logInfo( "{} 파일 [{}] {} [{}]-{} 완료", getTaskName(), taskInputData.getFile().getName(), article.getIud(), article.getTitle() );
    }

    @Override
    protected void doAfterProcess(FileXmlTaskInputData<JoinsLandArticleTotalVo, JoinsLandArticleVo> taskInputData)
            throws RcvDataAccessException, InterruptedException {
        super.doAfterProcess(taskInputData);

        taskInputData.doAfterProcess();
    }
}
