package jmnet.moka.core.tps.mvc.container.repository;

import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;
import jmnet.moka.core.tps.mvc.history.dto.HistSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 컨테이너 히스토리 Support
 *
 * @author ohtah
 */
public interface ContainerHistRepositorySupport {
    public Page<ContainerHist> findList(HistSearchDTO search, Pageable pageable);
}
