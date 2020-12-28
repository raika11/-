package jmnet.moka.core.tps.mvc.desking.repository;

import jmnet.moka.core.tps.mvc.desking.entity.ComponentWork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * ComponentWork Repository
 *
 * @author jeon0525
 */
@Repository
public interface ComponentWorkRepository extends JpaRepository<ComponentWork, Long> {
}
