package jmnet.moka.core.tps.mvc.jpod.repository;

import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.repository
 * ClassName : JpodEpisodeRepositorySupport
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 17:15
 */
public interface JpodEpisodeRepositorySupport {

    Page<JpodEpisode> findAllJpodEpisode(JpodEpisodeSearchDTO search);
}
