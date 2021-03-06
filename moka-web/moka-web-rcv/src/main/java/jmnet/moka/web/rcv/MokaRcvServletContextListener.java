package jmnet.moka.web.rcv;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes;
import jmnet.moka.web.rcv.code.OpCode;
import jmnet.moka.web.rcv.task.base.TaskManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.conf
 * ClassName : MokaRcvServletContextListener
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오전 11:42
 */
@Slf4j
@Component
public class MokaRcvServletContextListener implements ServletContextListener {
    private final ActionLogger actionLogger;
    private final TaskManager taskManager;

    private final long startTime = System.currentTimeMillis();

    public MokaRcvServletContextListener(ActionLogger actionLogger, TaskManager taskManager) {
        this.actionLogger = actionLogger;
        this.taskManager = taskManager;
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        actionLogger.success("SYSTEM", LoggerCodes.ActionType.STARTUP, 0L);

        if (!taskManager.loadEnvFile()) {
            throw new RuntimeException("TaskManager Can't Load Env File");
        }

        try {
            taskManager.operation(OpCode.start);
        } catch (InterruptedException ignore) {
            log.trace("MokaRcvServletContextListener :: contextInitialized Exception" );
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {

        try {
            taskManager.operation(OpCode.stop);
        } catch (InterruptedException ignore) {
            log.trace("MokaRcvServletContextListener :: contextDestroyed Exception" );
        }
        actionLogger.success("SYSTEM", LoggerCodes.ActionType.SHUTDOWN, System.currentTimeMillis() - startTime);
    }
}
