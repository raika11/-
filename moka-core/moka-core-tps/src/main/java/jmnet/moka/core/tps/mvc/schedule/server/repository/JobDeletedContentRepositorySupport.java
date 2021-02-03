package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobDeletedContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobDeletedContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 삭제된 작업 Repository
 * 2021. 2. 2. 김정민
 *
 */
public interface JobDeletedContentRepositorySupport {

    /**
     * 삭제된 작업 목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 작업 목록
     */
    Page<JobDeletedContent> findJobDeletedContentList(JobDeletedContentSearchDTO search, Pageable pageable);
}
