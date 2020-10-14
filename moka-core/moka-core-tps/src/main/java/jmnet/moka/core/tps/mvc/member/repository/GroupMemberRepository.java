package jmnet.moka.core.tps.mvc.member.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.member.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long>, JpaSpecificationExecutor<GroupMember> {

    public List<GroupMember> findAllByGroupCd(String groupCd);

    public Long countByGroupCd(String groupCd);

    public List<GroupMember> findAllByMemberId(String memberId);
}
