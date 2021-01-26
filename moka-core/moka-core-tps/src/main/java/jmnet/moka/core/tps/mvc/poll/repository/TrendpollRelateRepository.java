package jmnet.moka.core.tps.mvc.poll.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollItem;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollRelate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TrendpollRelateRepository extends JpaRepository<TrendpollRelate, Long>, JpaSpecificationExecutor<TrendpollRelate> {

    List<TrendpollItem> findAllByPollSeq(Long pollSeq);
}
