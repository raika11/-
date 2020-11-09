package jmnet.moka.core.tps.mvc.jpod.repository;

import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpodEpisodeRepository extends JpaRepository<JpodEpisode, Long>, JpaSpecificationExecutor<JpodEpisode>, JpodEpisodeRepositorySupport {

}
