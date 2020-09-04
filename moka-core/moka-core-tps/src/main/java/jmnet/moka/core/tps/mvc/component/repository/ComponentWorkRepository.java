package jmnet.moka.core.tps.mvc.component.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.component.entity.ComponentWork;

/**
 * ComponentWork Repository
 * 
 * @author jeon0525
 *
 */
public interface ComponentWorkRepository extends JpaRepository<ComponentWork, Long> {
}
