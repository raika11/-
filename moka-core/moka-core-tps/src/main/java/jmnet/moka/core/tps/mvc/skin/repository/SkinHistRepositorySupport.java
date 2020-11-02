package jmnet.moka.core.tps.mvc.skin.repository;

import jmnet.moka.core.tps.mvc.history.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.skin.entity.SkinHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SkinHistRepositorySupport {
    public Page<SkinHist> findList(HistSearchDTO search, Pageable pageable);
}
