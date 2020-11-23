package jmnet.moka.core.tps.mvc.editform.repository;

import jmnet.moka.core.tps.mvc.editform.entity.EditFormPartHist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EditFormPartHistRepository
        extends JpaRepository<EditFormPartHist, Long>, JpaSpecificationExecutor<EditFormPartHist>, EditFormPartHistRepositorySupport {

}
