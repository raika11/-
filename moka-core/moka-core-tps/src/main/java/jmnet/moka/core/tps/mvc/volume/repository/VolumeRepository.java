package jmnet.moka.core.tps.mvc.volume.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.volume.entity.Volume;

/**
 * <pre>
 * 볼륨 Repository
 * 2020. 1. 16. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 1. 16. 오후 2:04:49
 * @author ssc
 */
public interface VolumeRepository
        extends JpaRepository<Volume, String>, VolumeRepositorySupport {

    public Page<Volume> findAll(Pageable pageable);

}
