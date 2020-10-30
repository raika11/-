package jmnet.moka.core.tps.mvc.editform.repository;

import jmnet.moka.core.tps.mvc.editform.entity.EditFormItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EditFormItemRepository extends JpaRepository<EditFormItem, Long>, EditFormItemRepositorySupport {

}
