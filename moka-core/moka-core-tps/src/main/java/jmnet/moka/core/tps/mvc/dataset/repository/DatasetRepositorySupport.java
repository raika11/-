package jmnet.moka.core.tps.mvc.dataset.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetSearchDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;

public interface DatasetRepositorySupport {
    public Page<Dataset> findList(DatasetSearchDTO search, Pageable pageable);
}
