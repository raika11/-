package jmnet.moka.web.schedule.support.schedule;

import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;

/**
 * <pre>
 * Schedule Job interface
 * Project : moka
 * Package : jmnet.moka.web.schedule.support.schedule
 * ClassName : ScheduleJob
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
public interface ScheduleJob {

    /**
     * task를 실행한다.
     *
     * @param info GenContent
     */
    void doTask(GenContent info);
}
