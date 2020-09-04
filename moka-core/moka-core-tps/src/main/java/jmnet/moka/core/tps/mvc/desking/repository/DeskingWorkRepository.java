/**
 * msp-tps ScreenRepository.java 2020. 5. 13. 오후 1:29:21 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;

/**
 * <pre>
 * 
 * 2020. 5. 13. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 13. 오후 1:29:21
 * @author ssc
 */
public interface DeskingWorkRepository extends JpaRepository<DeskingWork, Long>, DeskingWorkRepositorySupport {

    public Long countByDatasetSeq(Long datasetSeq);
}
