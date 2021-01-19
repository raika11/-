package jmnet.moka.core.tps.mvc.editform.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EditFormRepository extends JpaRepository<EditForm, Long>, EditFormRepositorySupport {

    public Optional<EditForm> findByFormId(String formId);

    public int countByFormId(String formId);
}
