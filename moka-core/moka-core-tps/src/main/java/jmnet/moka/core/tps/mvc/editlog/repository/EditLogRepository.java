package jmnet.moka.core.tps.mvc.editlog.repository;

import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EditLogRepository extends JpaRepository<EditLog, Long>, JpaSpecificationExecutor<EditLog> {

}
