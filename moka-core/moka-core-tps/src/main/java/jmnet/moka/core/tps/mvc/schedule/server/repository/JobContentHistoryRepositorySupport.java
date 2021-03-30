package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentHistorySearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContentHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 작업예약 Repository 2021. 3. 30. 김정민
 */
public interface JobContentHistoryRepositorySupport {

    /**
     * 작업예약 목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 작업예약 목록
     */
    Page<JobContentHistory> findJobContentHistoryList(JobContentHistorySearchDTO search, Pageable pageable);
}
