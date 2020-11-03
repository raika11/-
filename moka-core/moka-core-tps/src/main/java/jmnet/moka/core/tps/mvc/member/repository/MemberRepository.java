package jmnet.moka.core.tps.mvc.member.repository;

import jmnet.moka.core.tps.mvc.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, String>, JpaSpecificationExecutor<Member>, MemberRepositorySupport {

    
}
