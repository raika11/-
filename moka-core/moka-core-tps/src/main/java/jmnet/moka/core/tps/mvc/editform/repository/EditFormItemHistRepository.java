package jmnet.moka.core.tps.mvc.editform.repository;

import jmnet.moka.core.tps.mvc.editform.entity.EditFormItemHist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EditFormItemHistRepository extends JpaRepository<EditFormItemHist, Long>, JpaSpecificationExecutor<EditFormItemHist> {

}
