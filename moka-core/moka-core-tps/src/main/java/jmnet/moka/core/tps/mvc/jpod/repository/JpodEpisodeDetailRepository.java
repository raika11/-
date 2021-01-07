package jmnet.moka.core.tps.mvc.jpod.repository;

import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpodEpisodeDetailRepository extends JpaRepository<JpodEpisodeDetail, Long>, JpaSpecificationExecutor<JpodEpisode> {

}
