package jmnet.moka.web.rcv.common.task;

import java.util.Map;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.base
 * ClassName : TaskService
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 5:50
 */
interface TaskService {
    void operation(int opCode, String id, Map<String, Object> responseMap) throws InterruptedException;
    boolean isAlive();
    boolean isPaused();
}
