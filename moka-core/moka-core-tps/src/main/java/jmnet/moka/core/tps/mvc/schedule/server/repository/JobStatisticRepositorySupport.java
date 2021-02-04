package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobStatisticSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatistic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 작업 실행상태 Repository
 * 2021. 2. 3. 김정민
 *
 */
public interface JobStatisticRepositorySupport {

    /**
     * 작업 실행상태 목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 작업 목록
     */
    Page<JobStatistic> findJobStatisticList(JobStatisticSearchDTO search, Pageable pageable);
}
