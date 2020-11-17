/**
 * msp-tps ScreenRepository.java 2020. 5. 13. 오후 1:29:21 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
public interface DeskingHistRepository extends JpaRepository<DeskingHist, Long> {
    public Long countByDatasetSeq(Long datasetSeq);

    /**
     * 데이터셋 아이디로 데스킹히스토리 목록 조회
     *
     * @param datasetSeq 데이터셋아이디
     * @param pageable   Pageable
     * @return 데스킹히스토리 목록
     */
    public Page<DeskingHist> findByDatasetSeq(Long datasetSeq, Pageable pageable);
}
