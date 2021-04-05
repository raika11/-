package jmnet.moka.core.tps.mvc.member.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<MemberInfo, String>, JpaSpecificationExecutor<MemberInfo>, MemberRepositorySupport {


    public Optional<MemberInfo> findById(String memberId);

}
