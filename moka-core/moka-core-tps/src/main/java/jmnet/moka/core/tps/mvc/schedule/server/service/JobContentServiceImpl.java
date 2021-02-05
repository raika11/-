package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.repository.JobContentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.Optional;


@Service
@Slf4j
public class JobContentServiceImpl implements JobContentService{

    @Autowired
    private JobContentRepository jobContentRepository;

    private final EntityManager entityManager;

    @Autowired
    public JobContentServiceImpl(@Qualifier("tpsEntityManagerFactory") EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Page<JobContent> findJobContentList(JobContentSearchDTO search) {
        return jobContentRepository.findJobContentList(search, search.getPageable());
    }

    @Override
    public Optional<JobContent> findJobContentById(Long jobSeq) {
        return jobContentRepository.findById(jobSeq);
    }

    @Override
    public JobContent saveJobContent(JobContent jobContent) {
        return jobContentRepository.save(jobContent);
    }

    @Override
    public JobContent updateJobContent(JobContent jobContent) {
        return jobContentRepository.save(jobContent);
    }

    @Override
    public void deleteJobContent(JobContent jobContent) {
        jobContentRepository.delete(jobContent);
    }

    @Override
    public boolean isValidData(JobContentSearchDTO search) {
        return jobContentRepository.findJobContent(search).isPresent();
    }
}
