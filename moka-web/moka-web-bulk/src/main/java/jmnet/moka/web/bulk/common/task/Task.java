package jmnet.moka.web.bulk.common.task;

import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.web.bulk.common.taskinput.TaskInput;
import jmnet.moka.web.bulk.common.taskinput.TaskInputData;
import jmnet.moka.web.bulk.exception.BulkDataAccessException;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.task.base.TaskGroup;
import jmnet.moka.web.bulk.task.base.TaskManager;
import jmnet.moka.web.bulk.util.BulkUtil;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task
 * ClassName : Task
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 4:06
 */

@Getter
@Slf4j
public abstract class Task<T> extends TaskBase {
    private String name;
    private TaskInput taskInput;
    private final TaskGroup parentGroup;
    private int retryCount;
    private long tickLogTime;
    private long tickLogInterval;

    public Task(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        parentGroup = parent;
        load(node, xu);
    }

    public TaskManager getTaskManager() {
        return parentGroup.getTaskManager();
    }

    protected abstract TaskInput initTaskInput();

    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        this.name = xu.getString(node, "./@name", "task");

        this.tickLogInterval = TimeHumanizer.parse(xu.getString(node, "./@logIntervalTime", "1m"));
        this.tickLogTime = System.currentTimeMillis() + this.tickLogInterval;

        int intervalTime = TimeHumanizer.parse(xu.getString(node, "./@intervalTime", "10s"));
        if (intervalTime < 50) {
            intervalTime = 1000;
        }
        super.setSleepTime(intervalTime);

        this.taskInput = initTaskInput();
        if (this.taskInput == null) {
            throw new BulkException("InitTaskInput init Error");
        }
        taskInput.load(xu.getChildNode(node, "TaskInput"), xu);
        retryCount = BulkUtil.parseInt(xu.getString(node, "./@retryCount", "3"));
    }

    @Override
    public String getTaskName() {
        return String.format("[%s]-[%s]", getParentGroup().getName(), getName());
    }

    protected boolean canLoadTask() { return true; }

    protected abstract boolean doVerifyData(T taskInputData);

    protected abstract void doProcess(T taskInputData)
            throws BulkDataAccessException;

    protected void doAfterProcess(T taskInputData)
            throws BulkDataAccessException, InterruptedException {
        ((TaskInputData) taskInputData).deleteTempFiles();
    }

    @Override
    @SuppressWarnings("unchecked")
    public void run() {
        while (!Thread.currentThread().isInterrupted() && !isEnd()) {
            while (!isPause() && !isEnd()) {
                try {
                    if( canLoadTask() ) {
                        TaskInputData taskInputData = taskInput.getTaskInputData();
                        if (taskInputData != null) {
                            this.tickLogTime = System.currentTimeMillis() + tickLogInterval;
                            if (doVerifyData((T) taskInputData)) {
                                int retryCount = this.retryCount;
                                do {
                                    try {
                                        doProcess((T) taskInputData);
                                        break;
                                    } catch (Exception e) {
                                        taskInputData.logError("Exception {}", e);
                                    }

                                    if (--retryCount > 0) {
                                        taskInputData.logError("Exception retry {} ", this.retryCount - retryCount + 1);
                                        //noinspection BusyWait
                                        Thread.sleep(1000);
                                    }
                                } while (retryCount > 0);
                            }
                            try {
                                doAfterProcess((T) taskInputData);
                            } catch (Exception e) {
                                taskInputData.logError("doAfterProcess Database Exception {}", e);
                            }
                            if (taskInputData.isSuccess()) {
                                continue;
                            }
                        }else {
                            if( this.tickLogTime < System.currentTimeMillis() ) {
                                this.tickLogTime = System.currentTimeMillis() + this.tickLogInterval;
                                doIdleProcess();
                            }
                        }
                    }
                } catch (Exception e) {
                    log.error("예상치 못한 Process Exception", e);
                }
                this.sleep(false);
            }
            this.sleep(isPause());
        }
        setEnd(true);

        stopServer();
    }

    protected void doIdleProcess() {
        log.info( "{} 정상적으로 작업 대기 중입니다.", getTaskName());
    }

    protected void stopServer() {
    }
}
