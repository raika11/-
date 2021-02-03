package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


/**
 * 작업 Repository
 * 2021. 2. 1. 김정민
 *
 */
public interface JobContentRepositorySupport {

    /**
     * 작업 목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 작업 목록
     */
    Page<JobContent> findJobContentList(JobContentSearchDTO search, Pageable pageable);
}