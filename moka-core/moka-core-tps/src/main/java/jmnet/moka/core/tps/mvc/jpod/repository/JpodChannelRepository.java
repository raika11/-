package jmnet.moka.core.tps.mvc.jpod.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpodChannelRepository extends JpaRepository<JpodChannel, Long>, JpaSpecificationExecutor<JpodChannel>, JpodChannelRepositorySupport {

    Optional<JpodChannel> findFirstByPodtyChnlSrl(Integer podtyChnlSrl);
}
