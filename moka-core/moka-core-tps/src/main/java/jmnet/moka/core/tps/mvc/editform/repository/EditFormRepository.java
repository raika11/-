package jmnet.moka.core.tps.mvc.editform.repository;

import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EditFormRepository extends JpaRepository<EditForm, Integer>, EditFormRepositorySupport {

}
