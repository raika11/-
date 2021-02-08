package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobDeletedContent;
import org.springframework.data.domain.Page;

import java.util.Optional;

/**
 * 작업 Service
 * 2021. 1. 26. 김정민
 *
 */
public interface JobContentService {
    Page<JobContent> findJobContentList(JobContentSearchDTO search);

    Optional<JobContent> findJobContentById(Long jobSeq);

    JobContent saveJobContent(JobContent jobContent);

    JobContent updateJobContent(JobContent jobContent);

    void deleteJobContent(JobDeletedContent jobDeletedContent, JobContent jobContent);

    /**
     * 등록가능한 데이터인지 체크한다.
     *
     * @param search 작업 정보
     * @return 중복여부
     */
    boolean isValidData(JobContentSearchDTO search);

}
