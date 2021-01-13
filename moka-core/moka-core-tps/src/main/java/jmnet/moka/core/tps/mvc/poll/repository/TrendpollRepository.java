package jmnet.moka.core.tps.mvc.poll.repository;

import jmnet.moka.core.tps.mvc.poll.entity.Trendpoll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TrendpollRepository extends JpaRepository<Trendpoll, Long>, JpaSpecificationExecutor<Trendpoll>, TrendpollRepositorySupport {

}
