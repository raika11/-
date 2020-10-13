package jmnet.moka.core.tps.mvc.member.repository;

import jmnet.moka.core.tps.mvc.member.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface GroupRepository extends JpaRepository<Group, String>,
    JpaSpecificationExecutor<Group> {

}
