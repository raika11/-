package jmnet.moka.core.tps.mvc.jpod.repository;

import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeRelArt;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeRelArtPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpodEpisodeRelArtRepository
        extends JpaRepository<JpodEpisodeRelArt, JpodEpisodeRelArtPK>, JpaSpecificationExecutor<JpodEpisodeRelArt> {

}
