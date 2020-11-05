package jmnet.moka.core.tps.mvc.group.repository;

import jmnet.moka.core.tps.mvc.group.entity.GroupInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<GroupInfo, String>, JpaSpecificationExecutor<GroupInfo>, GroupRepositorySupport {


}
