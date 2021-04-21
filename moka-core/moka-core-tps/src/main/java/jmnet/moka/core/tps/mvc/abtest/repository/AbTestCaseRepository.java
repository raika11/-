package jmnet.moka.core.tps.mvc.abtest.repository;

import jmnet.moka.core.tps.mvc.abtest.entity.AbTestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AbTestCaseRepository extends JpaRepository<AbTestCase, Long>, JpaSpecificationExecutor<AbTestCase>, AbTestCaseRepositorySupport {

}
