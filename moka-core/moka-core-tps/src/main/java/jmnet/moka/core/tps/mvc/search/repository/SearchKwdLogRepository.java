package jmnet.moka.core.tps.mvc.search.repository;

import jmnet.moka.core.tps.mvc.search.entity.SearchKwdLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SearchKwdLogRepository extends JpaRepository<SearchKwdLog, Long>, JpaSpecificationExecutor<SearchKwdLog> {

}
