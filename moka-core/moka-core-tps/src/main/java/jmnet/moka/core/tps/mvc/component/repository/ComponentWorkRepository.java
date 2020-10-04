package jmnet.moka.core.tps.mvc.component.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.component.entity.ComponentWork;
import org.springframework.stereotype.Repository;

/**
 * ComponentWork Repository
 * 
 * @author jeon0525
 *
 */
@Repository
public interface ComponentWorkRepository extends JpaRepository<ComponentWork, Long> {
}
