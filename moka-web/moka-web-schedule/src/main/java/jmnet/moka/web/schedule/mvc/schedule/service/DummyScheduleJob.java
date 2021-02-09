package jmnet.moka.web.schedule.mvc.schedule.service;

import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * Job Task 동작 테스트용 Dummy 객체
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : DummyScheduleJob
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
@Slf4j
@Component
public class DummyScheduleJob extends AbstractScheduleJob {
    @Override
    public void invoke() {
        log.debug("task 실행!!");
    }
}
