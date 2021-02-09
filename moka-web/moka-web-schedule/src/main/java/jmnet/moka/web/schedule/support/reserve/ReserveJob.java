package jmnet.moka.web.schedule.support.reserve;

import jmnet.moka.web.schedule.mvc.reserve.dto.ReserveJobDTO;

/**
 * <pre>
 * ReserveJob Job interface
 * Project : moka
 * Package : jmnet.moka.web.schedule.support.reserve
 * ClassName : ReserveJob
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
public interface ReserveJob {

    /**
     * 비동기 작업 처리
     *
     * @param reserveJob 예약 정보
     * @param taskSeq    작업 일련번호
     */
    void asyncTask(ReserveJobDTO reserveJob, Long taskSeq);
}
