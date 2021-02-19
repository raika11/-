package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobContentHistoryRepository extends JpaRepository<JobContentHistory, Long> {
    JobContentHistory findFirstByJobSeqAndStatusAndDelYnOrderBySeqNoDesc(Long jobSeq, String status, String delYn);
}
