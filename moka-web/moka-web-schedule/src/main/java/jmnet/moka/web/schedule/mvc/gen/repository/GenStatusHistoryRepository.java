package jmnet.moka.web.schedule.mvc.gen.repository;

import jmnet.moka.web.schedule.mvc.gen.entity.GenStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenStatusHistoryRepository extends JpaRepository<GenStatusHistory, Long> {
    GenStatusHistory findFirstByJobSeqAndDelYnOrderBySeqNoDesc(Long jobSeq, String delYn);

    Optional<GenStatusHistory> findBySeqNoAndDelYnAndStatus(Long seqNo, String DelYn, String status);

}
