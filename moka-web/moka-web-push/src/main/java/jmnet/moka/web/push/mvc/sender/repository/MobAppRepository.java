package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.MobApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MobAppRepository extends JpaRepository<MobApp, Integer>, JpaSpecificationExecutor<MobApp> {

}
