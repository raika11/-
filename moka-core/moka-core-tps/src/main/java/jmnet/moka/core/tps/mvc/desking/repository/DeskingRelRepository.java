/**
 * msp-tps DeskingRelRepository.java 2020. 8. 20. 오후 3:50:31 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingRel;

/**
 * <pre>
 * 
 * 2020. 8. 20. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 8. 20. 오후 3:50:31
 * @author ssc
 */
public interface DeskingRelRepository extends JpaRepository<DeskingRel, Long> {

    /**
     * 관련아이템 삭제
     * 
     * @param pageSeq 페이지순번
     */
    @Transactional
    @Modifying
    @Query(value = "DELETE r FROM WMS_DESKING_REL r , WMS_DESKING d WHERE r.DESKING_SEQ = d.DESKING_SEQ AND d.DATASET_SEQ=:datasetSeq",
            nativeQuery = true)
    int deleteByDatasetSeq(@Param("datasetSeq") Long datasetSeq);
}
