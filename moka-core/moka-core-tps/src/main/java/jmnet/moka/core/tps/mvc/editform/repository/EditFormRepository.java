package jmnet.moka.core.tps.mvc.editform.repository;

import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EditFormRepository extends JpaRepository<EditForm, Integer>, JpaSpecificationExecutor<EditForm> {

}
