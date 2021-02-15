package jmnet.moka.web.push.support.scheduler;

/**
 * <pre>
 * Schedule Job interface
 * Project : moka
 * Package : jmnet.moka.web.push.support.schedule
 * ClassName : ScheduleJob
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
public interface Scheduler {

    /**
     * task를 실행한다.
     *
     * @param info PushSchedule
     */
    void doTask(PushSchedulerJob info);
}
