package jmnet.moka.core.tps.mvc.poll.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TrendpollItemRepository extends JpaRepository<TrendpollItem, Long>, JpaSpecificationExecutor<TrendpollItem> {

    List<TrendpollItem> findAllByPollSeq(Long pollSeq);
}
