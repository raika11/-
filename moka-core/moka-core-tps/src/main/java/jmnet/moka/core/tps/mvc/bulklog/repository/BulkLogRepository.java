package jmnet.moka.core.tps.mvc.bulklog.repository;

import jmnet.moka.core.tps.mvc.bulklog.entity.BulkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BulkLogRepository extends JpaRepository<BulkLog, Long>, JpaSpecificationExecutor<BulkLog> {

}
