package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
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

    void deleteJobContent(JobContent jobContent);

}
