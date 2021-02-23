package jmnet.moka.web.push.support.scheduler;

import jmnet.moka.web.push.support.sender.PushSenderHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <pre>
 * Schedule Job 공통 기능
 * Project : moka
 * Package : jmnet.moka.web.push.support.schedule
 * ClassName : AbstractScheduleJob
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
public abstract class AbstractScheduler implements Scheduler {
    private static final Logger logger = LoggerFactory.getLogger(AbstractScheduler.class);

    protected PushSchedulerJob scheduleInfo;

    @Autowired
    protected PushSenderHandler pushSenderHandler;


    /**
     * 초기화
     *
     * @param info schedule job 정보
     */
    protected void init(PushSchedulerJob info) {
        scheduleInfo = info;
    }

    /**
     * 마무리 처리
     */
    public void finish() {
        // TODO 1. 처리 결과 update 등 마무리 처리
    }

    @Override
    public void doTask(PushSchedulerJob info) {
        init(info);
        try {
            invoke();
        } catch (Exception ex) {
            logger.error("schedule invoke error ", ex);
        } finally {
            finish();
        }

    }

    /**
     * 각 Job별 기능 구현
     */
    public abstract void invoke() throws Exception;
}
