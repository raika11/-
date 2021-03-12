package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 작업 Repository
 * 2021. 2. 1. 김정민
 *
 */
@Repository
public interface JobContentRepository extends JpaRepository<JobContent, Long>, JobContentRepositorySupport {
    Optional<JobContent> findByJobSeqAndDelYn(Long jobSeq, String delYn);
}
