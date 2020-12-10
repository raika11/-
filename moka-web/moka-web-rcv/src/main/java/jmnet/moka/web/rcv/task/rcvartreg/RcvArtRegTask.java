package jmnet.moka.web.rcv.task.rcvartreg;

import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.jamxml.process.XmlGenProcess;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.rcvartreg.process.RcvArtRegToJamArticleTotalProcess;
import jmnet.moka.web.rcv.task.rcvartreg.service.RcvArtRegService;
import jmnet.moka.web.rcv.taskinput.DBTaskInput;
import jmnet.moka.web.rcv.taskinput.DBTaskInputData;
import jmnet.moka.web.rcv.util.XMLUtil;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.rcvartreg
 * ClassName : RcvArtRegTask
 * Created : 2020-12-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-01 001 오후 4:41
 */
public class RcvArtRegTask extends Task<DBTaskInputData> {
    public RcvArtRegTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        final RcvArtRegService rcvArtRegService = getTaskManager().getRcvArtRegService();
        return new DBTaskInput() {
            @Override
            public TaskInputData getTaskInputData() {
                return new DBTaskInputData(rcvArtRegService.getUspRcvArticleIudSelList());
            }
        };
    }

    @Override
    protected boolean doVerifyData(DBTaskInputData taskInputData) {
        return taskInputData.getInputData().size() > 0;
    }

    @Override
    protected void doProcess(DBTaskInputData taskInputData)
            throws RcvDataAccessException {
        final MokaRcvConfiguration rcvConfiguration = getTaskManager().getRcvConfiguration();

        final RcvArtRegService rcvArtRegService = getTaskManager().getRcvArtRegService();
        for( Map<String, Object> map : taskInputData.getInputData() ) {
            try {
                doProcessChild(taskInputData, RcvArtRegToJamArticleTotalProcess.getJamArticleTotalVo(map, rcvArtRegService, rcvConfiguration, taskInputData));
                rcvArtRegService.insertReceiveJobStep( map, "");
            }
            catch (Exception e){
                rcvArtRegService.insertReceiveJobStep( map, "예외 발생");
                throw new RcvDataAccessException( e.getMessage());
            }
        }
    }

    private void doProcessChild(DBTaskInputData taskInputData, JamArticleTotalVo articleTotal) {
        XmlGenProcess.doProcess( taskInputData, articleTotal, getTaskManager());

        final RcvArtRegService rcvArtRegService = getTaskManager().getRcvArtRegService();
        rcvArtRegService.setUspRcvArticleIudComplete(articleTotal);
    }
}
