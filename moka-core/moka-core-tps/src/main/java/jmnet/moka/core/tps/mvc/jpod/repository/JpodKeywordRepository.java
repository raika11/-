package jmnet.moka.core.tps.mvc.jpod.repository;

import jmnet.moka.core.tps.mvc.jpod.entity.JpodKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpodKeywordRepository extends JpaRepository<JpodKeyword, JpodKeywordPK>, JpaSpecificationExecutor<JpodKeyword> {

}
