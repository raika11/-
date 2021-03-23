package jmnet.moka.core.tps.mvc.push.repository;

import jmnet.moka.core.tps.mvc.push.entity.PushApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PushAppRepository extends JpaRepository<PushApp, Integer>, JpaSpecificationExecutor<PushApp>, PushAppRepositorySupport {

}
