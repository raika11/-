/**
 * msp-tps MediaRepository.java 2020. 1. 23. 오후 2:05:02 ssc
 */
package jmnet.moka.core.tps.mvc.media.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.media.entity.Media;

/**
 * <pre>
 * 매체 Repository
 * 2020. 1. 23. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 1. 23. 오후 2:05:02
 * @author ssc
 */
public interface MediaRepository extends JpaRepository<Media, String> {

    List<Media> findByMediaTypeOrderByMediaIdAsc(String mediaType);
}
