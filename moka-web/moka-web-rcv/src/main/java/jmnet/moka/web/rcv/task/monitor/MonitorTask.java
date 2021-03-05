package jmnet.moka.web.rcv.task.monitor;

import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.base.TaskManager;
import jmnet.moka.web.rcv.taskinput.ObjectTaskInput;
import jmnet.moka.web.rcv.taskinput.ObjectTaskInputData;
import jmnet.moka.web.rcv.util.XMLUtil;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.monitor
 * ClassName : MonitorTask
 * Created : 2021-02-24 024 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-24 024 오후 1:17
 */
public class MonitorTask extends Task<ObjectTaskInputData<TaskManager>> {
    public MonitorTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        return new ObjectTaskInput() {
            @Override
            public TaskInputData getTaskInputData() {
                return new ObjectTaskInputData<>(getTaskManager());
            }
        };
    }

    @Override
    protected boolean doVerifyData(ObjectTaskInputData<TaskManager> taskInputData) {
        return true;
    }

    @Override
    public void doProcess(ObjectTaskInputData<TaskManager> taskInputData)
            throws RcvDataAccessException {
        final TaskManager taskManager = taskInputData.getInputData();

        for( TaskGroup group : taskManager.getTaskGroups() ) {
            for( Task<?> task : group.getTasks()) {
                task.processMonitor();
            }
        }
    }
}
