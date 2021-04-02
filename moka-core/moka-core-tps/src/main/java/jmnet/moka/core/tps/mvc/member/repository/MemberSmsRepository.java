package jmnet.moka.core.tps.mvc.member.repository;

import jmnet.moka.core.tps.mvc.member.entity.MemberSms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberSmsRepository extends JpaRepository<MemberSms, String>, JpaSpecificationExecutor<MemberSms>, MemberSmsRepositorySupport {


}
