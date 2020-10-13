package jmnet.moka.core.tps.mvc.member.repository;

import jmnet.moka.core.tps.mvc.member.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Integer>,
    JpaSpecificationExecutor<GroupMember> {

}
