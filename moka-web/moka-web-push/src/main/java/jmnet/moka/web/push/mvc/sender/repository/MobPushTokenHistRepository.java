package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.MobPushTokenHist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MobPushTokenHistRepository extends JpaRepository<MobPushTokenHist, Integer>, JpaSpecificationExecutor<MobPushTokenHist> {

}
