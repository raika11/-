package jmnet.moka.core.mail.mvc.repository;

import jmnet.moka.core.mail.mvc.entity.AutomailInterface;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AutomailInterfaceRepository extends JpaRepository<AutomailInterface, Long>, JpaSpecificationExecutor<AutomailInterface> {

}
