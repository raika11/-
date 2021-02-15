package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.MobPushToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MobPushTokenRepository extends JpaRepository<MobPushToken, Integer>, JpaSpecificationExecutor<MobPushToken> {

}
