package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.MobPushWordProc;
import jmnet.moka.web.push.mvc.sender.entity.MobPushWordProcPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MobPushWordProcRepository extends JpaRepository<MobPushWordProc, MobPushWordProcPK>, JpaSpecificationExecutor<MobPushWordProc> {

}
