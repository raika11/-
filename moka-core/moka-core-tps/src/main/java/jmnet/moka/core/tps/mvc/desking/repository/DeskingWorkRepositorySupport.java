/**
 * msp-tps DeskingRepositorySupport.java 2020. 8. 11. 오전 10:42:56 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;

/**
 * <pre>
 *
 * 2020. 8. 11. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 8. 11. 오전 10:42:56
 */
public interface DeskingWorkRepositorySupport {
    void deleteByDatasetSeq(Long datasetSeq, String regId);

    List<DeskingWork> findAllDeskingWork(DeskingWorkSearchDTO search);
}
