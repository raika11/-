package jmnet.moka.web.schedule.mvc.gen.repository;

import java.util.Optional;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.support.StatusFlagType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenContentHistoryRepository extends JpaRepository<GenContentHistory, Long>, GenContentHistoryRepositorySupport {
    Optional<GenContentHistory> findFirstByJobSeqAndDelYnOrderBySeqNoDesc(Long jobSeq, String delYn);

    Optional<GenContentHistory> findBySeqNoAndDelYnAndStatus(Long seqNo, String DelYn, StatusFlagType status);

    Optional<GenContentHistory> findByJobTaskIdAndDelYnAndStatus(String jobTaskId, String DelYn, StatusFlagType status);
}
