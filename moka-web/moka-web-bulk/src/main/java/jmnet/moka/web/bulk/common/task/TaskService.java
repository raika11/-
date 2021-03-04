package jmnet.moka.web.bulk.common.task;

import java.util.Map;
import jmnet.moka.web.bulk.code.OpCode;

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

@SuppressWarnings("unused")
interface TaskService {
    boolean operation(OpCode opCode, Map<String, String> param, Map<String, Object> responseMap, boolean equals) throws InterruptedException;
    boolean isAlive();
    boolean isPaused();
}
