package jmnet.moka.core.tps.mvc.jpod.repository;

import jmnet.moka.core.tps.mvc.jpod.entity.JpodMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpodMemberRepository extends JpaRepository<JpodMember, Long>, JpaSpecificationExecutor<JpodMember> {

}
