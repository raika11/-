package jmnet.moka.web.schedule.mvc.reserve.service;

import jmnet.moka.web.schedule.support.reserve.AbstractReserveJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * SNS 예약 배포 처리 Service
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.reserve.service
 * ClassName : ArticleSnsShareServiceImpl
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Service
public class SnsShareReserveJob extends AbstractReserveJob {


    @Override
    public void invoke() {
        // 작업 테이블에서 조회하여
        log.debug("비동기 예약 작업 처리 : {}", reserveJob.getJobSeq());
    }
}
