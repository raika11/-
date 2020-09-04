package jmnet.moka.core.tps.mvc.container.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;

/**
 * 컨테이너 히스토리 Support
 * @author ohtah
 *
 */
public interface ContainerHistRepositorySupport {
    public Page<ContainerHist> findList(HistSearchDTO search, Pageable pageable);
}
