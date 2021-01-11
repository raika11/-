package jmnet.moka.web.bulk.common.task;

import java.util.Map;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.base
 * ClassName : TaskService
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 5:50
 */

interface TaskService {
    void operation(int opCode) throws InterruptedException;
    void operation(int opCode, Map<String, Object> responseMap) throws InterruptedException;
    boolean isAlive();
    boolean isPaused();
}
