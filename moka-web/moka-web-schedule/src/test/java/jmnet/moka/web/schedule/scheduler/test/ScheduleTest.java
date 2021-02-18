package jmnet.moka.web.schedule.scheduler.test;

import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.support.schedule.ScheduleJobHandler;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
public class ScheduleTest {

    @Autowired
    private ScheduleJobHandler handler;

    @Test
    public void crsRefineApiCallTest() {

        handler.appendJob(GenContent
                .builder()
                .jobSeq(1l)
                .jobType("S") //SCHEDULE 에서 TB_GEN_CONTENT.JOB_TYPE의 형태로 변경
                .programeNm("jmnet.moka.web.schedule.mvc.schedule.service.DummyScheduleJob")
                .period(1l)
                .build());

        log.debug("실행 테스트");

        handler.removeJob(1l);

        log.debug("종료 테스트");
    }

    @Test
    public void ovpScheduleTest()
            throws InterruptedException {

        handler.appendJob(GenContent
                .builder()
                .jobSeq(1l)
                .jobType("S") //SCHEDULE 에서 TB_GEN_CONTENT.JOB_TYPE의 형태로 변경
                .programeNm("jmnet.moka.web.schedule.mvc.schedule.service.OvpAudioScheduleJob")
                .period(5l)
                .build());

        log.debug("실행 테스트");

        handler.removeJob(1000l);

        Thread.sleep(1000000000);

        log.debug("종료 테스트");
    }
}
