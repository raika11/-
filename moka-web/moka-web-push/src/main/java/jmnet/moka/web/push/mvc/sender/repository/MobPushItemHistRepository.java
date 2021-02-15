package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.MobPushItemHist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MobPushItemHistRepository extends JpaRepository<MobPushItemHist, Integer>, JpaSpecificationExecutor<MobPushItemHist> {

}
