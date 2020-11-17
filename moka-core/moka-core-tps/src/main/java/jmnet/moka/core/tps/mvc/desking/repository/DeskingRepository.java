/**
 * msp-tps ScreenRepository.java 2020. 5. 13. 오후 1:29:21 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import javax.transaction.Transactional;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

/**
 * <pre>
 *
 * 2020. 5. 13. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 5. 13. 오후 1:29:21
 */
public interface DeskingRepository extends JpaRepository<Desking, Long>, DeskingRepositorySupport {

    /**
     * <pre>
     * 데이타셋ID에 해당하는 편집기사의 개수 조회
     * </pre>
     *
     * @param datasetSeq 데이타셋순번
     * @return 편집기사수
     */
    public Long countByDatasetSeq(Long datasetSeq);

    /**
     * <pre>
     * 데이타셋에 해당하는 편집기사(+관련편집기사) 삭제
     * </pre>
     *
     * @param datasetSeq
     * @return
     */
    @Transactional
    @Modifying
    public void deleteByDatasetSeq(Long datasetSeq);

}
