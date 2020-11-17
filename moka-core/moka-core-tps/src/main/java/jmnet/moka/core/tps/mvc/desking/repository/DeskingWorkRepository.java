/**
 * msp-tps ScreenRepository.java 2020. 5. 13. 오후 1:29:21 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;
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
public interface DeskingWorkRepository extends JpaRepository<DeskingWork, Long>, DeskingWorkRepositorySupport {

    Long countByDatasetSeq(Long datasetSeq);

    List<DeskingWork> findByDatasetSeqAndRegId(Long datasetSeq, String regId);
}
