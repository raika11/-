package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 작업예약 Repository 2021. 3. 30. 김정민
 */
@Repository
public interface JobContentHistoryRepository extends JpaRepository<JobContentHistory, Long>, JobContentHistoryRepositorySupport {
    JobContentHistory findFirstByJobSeqAndStatusAndDelYnOrderBySeqNoDesc(Long jobSeq, String status, String delYn);
}
