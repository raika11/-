package jmnet.moka.core.tps.mvc.editform.repository;

import jmnet.moka.core.tps.mvc.editform.entity.EditFormHist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EditFormHistRepository extends JpaRepository<EditFormHist, Void>, JpaSpecificationExecutor<EditFormHist> {

}
