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

    JobDeletedContent saveJobDeletedContent(JobDeletedContent jobDeletedContent);

    Page<JobDeletedContent> findJobContentList(JobDeletedContentSearchDTO search);

    Optional<JobDeletedContent> findJobDeletedContentById(Long jobSeq);

    void deletedJobDeletedContent(JobContent jobContent, JobDeletedContent jobDeletedContent);

}
