package jmnet.moka.core.tps.mvc.member.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MemberRepository extends JpaRepository<Member, String>,
    JpaSpecificationExecutor<Member> {

    public Optional<Member> findByMemberId(String memberId);
}
