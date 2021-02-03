package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobDeletedContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobDeletedContent;
import jmnet.moka.core.tps.mvc.schedule.server.repository.JobDeletedContentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.Optional;

@Service
@Slf4j
public class JobDeletedContentServiceImpl implements JobDeletedContentService{

    @Autowired
    private JobDeletedContentRepository jobDeletedContentRepository;

    private final EntityManager entityManager;

    public JobDeletedContentServiceImpl(@Qualifier("tpsEntityManagerFactory") EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public JobDeletedContent saveJobDeletedContent(JobDeletedContent jobDeletedContent) {
        return jobDeletedContentRepository.save(jobDeletedContent);
    }

    @Override
    public Page<JobDeletedContent> findJobContentList(JobDeletedContentSearchDTO search) {
        return jobDeletedContentRepository.findJobDeletedContentList(search, search.getPageable());
    }

    @Override
    public Optional<JobDeletedContent> findJobDeletedContentById(Long seqNo) {
        return jobDeletedContentRepository.findById(seqNo);
    }

    @Override
    public void deletedJobDeletedContent(JobDeletedContent jobDeletedContent) {
        jobDeletedContentRepository.delete(jobDeletedContent);
    }

}