package jmnet.moka.core.tps.mvc.poll.repository;

import jmnet.moka.core.tps.mvc.poll.entity.TrendpollVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TrendpollVoteRepository extends JpaRepository<TrendpollVote, Long>, JpaSpecificationExecutor<TrendpollVote> {

}
