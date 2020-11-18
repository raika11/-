package jmnet.moka.core.tps.mvc.member.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.member.entity.LoginLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface LoginLogRepository extends JpaRepository<LoginLog, Long>, JpaSpecificationExecutor<LoginLog> {
    public List<LoginLog> findAllByMemId(String memId);

    public Page<LoginLog> findAllByMemIdOrderBySeqNoDesc(String memId, Pageable pageable);
}
