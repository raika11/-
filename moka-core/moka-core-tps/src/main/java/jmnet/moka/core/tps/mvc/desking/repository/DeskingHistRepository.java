/**
 * msp-tps ScreenRepository.java 2020. 5. 13. 오후 1:29:21 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * <pre>
 *
 * 2020. 5. 13. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 5. 13. 오후 1:29:21
 */
public interface DeskingHistRepository extends JpaRepository<DeskingHist, Long>, DeskingHistRepositorySupport {

    Long countByDatasetSeq(Long datasetSeq);
}
