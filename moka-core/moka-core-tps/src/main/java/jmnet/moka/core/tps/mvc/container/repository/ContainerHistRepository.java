package jmnet.moka.core.tps.mvc.container.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;

public interface ContainerHistRepository
        extends JpaRepository<ContainerHist, Long>, ContainerHistRepositorySupport {

}
