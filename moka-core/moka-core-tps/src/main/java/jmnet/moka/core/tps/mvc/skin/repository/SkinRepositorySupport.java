package jmnet.moka.core.tps.mvc.skin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.mvc.skin.dto.SkinSearchDTO;
import jmnet.moka.core.tps.mvc.skin.entity.Skin;

public interface SkinRepositorySupport {
    
	// 목록. 페이징O
    public Page<Skin> findList(SkinSearchDTO search, Pageable pageable);

}
