package jmnet.moka.core.tps.mvc.group.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long>, JpaSpecificationExecutor<GroupMember> {

    List<GroupMember> findAllByGroupCd(String groupCd);

    Long countByGroupCdAndUsedYn(String groupCd, String useYn);

    List<GroupMember> findAllByMemberId(String memberId);
}
