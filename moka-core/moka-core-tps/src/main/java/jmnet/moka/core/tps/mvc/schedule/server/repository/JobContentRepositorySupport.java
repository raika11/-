package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;


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

    /**
     * 특정작업 존재여부 확인
     *
     * @param search   검색조건
     * @return 작업
     */
    Optional<JobContent> findJobContent(JobContentSearchDTO search);
}
