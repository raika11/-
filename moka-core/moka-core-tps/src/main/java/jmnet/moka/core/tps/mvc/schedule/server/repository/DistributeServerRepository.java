package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 배포서버 Repository
 * 2021. 1. 26. 김정민
 *
 */
@Repository
public interface DistributeServerRepository extends JpaRepository<DistributeServer, Long>, DistributeServerRepositorySupport {
}
