package jmnet.moka.core.tps.mvc.skin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.skin.entity.SkinHist;

public interface SkinHistRepositorySupport {
    public Page<SkinHist> findList(HistSearchDTO search, Pageable pageable);
}
