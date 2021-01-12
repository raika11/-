package jmnet.moka.core.tps.mvc.jpod.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpodMemberRepository extends JpaRepository<JpodMember, Long>, JpaSpecificationExecutor<JpodMember> {

    List<JpodMember> findAllByChnlSeqAndEpsdSeqOrderBySeqNoAsc(Long chnlSeq, Long epsdSeq);
}
