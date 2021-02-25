package jmnet.moka.web.rcv.common.task;

import java.util.Map;
import jmnet.moka.web.rcv.code.OpCode;

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

@SuppressWarnings("unused")
interface TaskService {
    boolean operation(OpCode opCode, Map<String, String> param, Map<String, Object> responseMap, boolean allFromWeb) throws InterruptedException;
    boolean isAlive();
    boolean isPaused();
}
