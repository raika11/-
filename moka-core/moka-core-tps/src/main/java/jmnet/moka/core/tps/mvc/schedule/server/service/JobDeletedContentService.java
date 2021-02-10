package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobDeletedContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobDeletedContent;
import org.springframework.data.domain.Page;

import java.util.Optional;

/**
 * 삭제된 작업 Service
 * 2021. 2. 2. 김정민
 *
 */
public interface JobDeletedContentService {

    /**
     * 삭제된 작업 등록
     *
     * @param jobDeletedContent 삭제된 작업
     * @return 삭제된 작업
     */
    JobDeletedContent saveJobDeletedContent(JobDeletedContent jobDeletedContent);

    /**
     * 삭제된 작업 목록 조회
     *
     * @param search 조회정보
     * @return 삭제된 작업 목록
     */
    Page<JobDeletedContent> findJobContentList(JobDeletedContentSearchDTO search);

    /**
     * 삭제된 작업 상세 조회
     *
     * @param jobSeq 삭제된 작업번호
     * @return 삭제된 작업
     */
    Optional<JobDeletedContent> findJobDeletedContentById(Long jobSeq);

    /**
     * 복원된 작업 삭제
     *
     * @param jobContent 복원할 작업, jobDeletedContent 복원한 작업
     * @return 삭제된 작업 목록
     */
    void deletedJobDeletedContent(JobContent jobContent, JobDeletedContent jobDeletedContent);

}
