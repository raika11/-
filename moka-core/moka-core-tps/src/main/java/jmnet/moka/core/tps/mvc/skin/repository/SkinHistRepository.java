package jmnet.moka.core.tps.mvc.skin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.skin.entity.SkinHist;

public interface SkinHistRepository
        extends JpaRepository<SkinHist, Long>, SkinHistRepositorySupport {

}
