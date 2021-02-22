package jmnet.moka.web.schedule.scheduler.test;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.sns.SnsPublishDTO;
import jmnet.moka.core.common.sns.SnsTypeCode;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatusHistory;
import jmnet.moka.web.schedule.mvc.reserve.service.SnsShareReserveJob;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
public class ReserveJobTest {

    @Autowired
    private SnsShareReserveJob snsShareReserveJob;


    @Test
    public void snsShareReserveJobTest()
            throws Exception {

        GenStatusHistory history = GenStatusHistory
                .builder()
                .jobSeq(11l)
                .paramDesc(ResourceMapper
                        .getDefaultObjectMapper()
                        .writeValueAsString(SnsPublishDTO
                                .builder()
                                .message("메세지")
                                .reserveDt(McpDate.minutePlus(McpDate.now(), 2))
                                .totalId(23899166l)
                                .snsType(SnsTypeCode.FB)
                                .build()))
                .build();

        snsShareReserveJob.publishSnsArticleSnsShare(history);



        log.debug("종료 테스트");
    }
}
