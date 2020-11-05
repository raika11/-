package jmnet.moka.core.tps.mvc.editform.repository;

import jmnet.moka.core.tps.mvc.editform.entity.EditFormPart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EditFormPartRepository extends JpaRepository<EditFormPart, Long>, EditFormPartRepositorySupport {

}
