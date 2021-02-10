package jmnet.moka.web.schedule.mvc.reserve.service;

import jmnet.moka.web.schedule.mvc.reserve.dto.ReserveJobDTO;
import jmnet.moka.web.schedule.support.reserve.AbstractReserveJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

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
@Component
public class SnsShareReserveJob extends AbstractReserveJob {


    @Override
    public void invoke(ReserveJobDTO reserveJob, Long taskSeq) {
        log.debug("비동기 예약 작업 처리 : {}", reserveJob.getJobSeq());

        /**
         * todo 1. 작업 테이블에서 조회하여 이미 완료 되었거나, 삭제 된 작업이 아닌 경우 진행 시작
         * - AbstractReserveJob에 공통 메소드 생성하여 사용할 수 있도록 조치 필요
         */

        /**
         * todo 2. 작업 테이블의 파라미터 정보를 Map 형태로 전환하여, procedure 또는 업무별 service 객체 호출
         * - 각 업무 담당자가 해당 영역 코딩은 구현할 예정
         */
    }
}
