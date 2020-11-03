package jmnet.moka.core.tps.mvc.container.repository;

import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContainerHistRepository extends JpaRepository<ContainerHist, Long> {

}
