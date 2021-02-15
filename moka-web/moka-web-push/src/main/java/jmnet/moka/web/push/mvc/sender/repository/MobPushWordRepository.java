package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.MobPushWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MobPushWordRepository extends JpaRepository<MobPushWord, Integer>, JpaSpecificationExecutor<MobPushWord> {

}
