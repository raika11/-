package jmnet.moka.web.rcv.common.task;

import java.util.Map;
import jmnet.moka.web.rcv.code.OpCode;
import jmnet.moka.web.rcv.util.ThreadUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.basic
 * ClassName : TaskBase
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 5:48
 */

@Getter
@Setter
@Slf4j
public abstract class TaskBase implements Runnable, TaskService {
    private Thread thread;
    private boolean isEnd;
    private boolean isPause;
    private int sleepTime = 1000;     // 기본 1초

    protected abstract String getTaskName();

    public long getThreadId() {
        if (thread == null) {
            return 0;
        }
        return thread.getId();
    }

    @Override
    public void operation(int opCode, String id, Map<String, Object> responseMap)
            throws InterruptedException {
        switch (opCode) {
            case OpCode.SERVE: {
                if (!this.isAlive()) {
                    this.thread = ThreadUtil.create(getTaskName(), this);
                    this.thread.setDaemon(false);
                    this.thread.start();
                }
                break;
            }
            case OpCode.STOP: {
                if (!this.isEnd) {
                    this.isEnd = true;
                    this.thread.interrupt();

                    if (this.thread.isAlive()) {
                        this.thread.join();
                    }
                }
                break;
            }
            case OpCode.PAUSE: {
                if (!this.isPause) {
                    this.isPause = true;
                }
                break;
            }
            case OpCode.RESUME: {
                if (this.isPaused()) {
                    if (this.isPause) {
                        this.isPause = false;
                    }
                }
                break;
            }
            case OpCode.LISTTASK: {
                if (responseMap != null) {
                    responseMap.put(getTaskName(), Long.toString(getThreadId()));
                }
                break;
            }
            default:
                break;
        }
    }

    @Override
    public boolean isAlive() {
        return this.thread != null && this.thread.isAlive();
    }

    @Override
    public boolean isPaused() {
        return isPause;
    }

    protected void sleep(boolean isPause) {
        if (this.getSleepTime() > 0) {
            try {
                final int sleepTimer = 100;
                final int countLoop = isPause ? 100 : this.getSleepTime() / sleepTimer;
                for (int i = 0; i < countLoop; i++) {
                    if (this.isEnd) {
                        break;
                    }
                    if (isPause && !this.isPause) {
                        break;
                    }
                    Thread.sleep(sleepTimer);
                }
            } catch (Exception ex2) {
                // do nothing
            }
        }
    }
}
