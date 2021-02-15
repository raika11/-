package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.MobPushItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MobPushItemRepository extends JpaRepository<MobPushItem, Integer>, JpaSpecificationExecutor<MobPushItem> {

}
