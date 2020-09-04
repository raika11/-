/**
 * msp-tps ScreenRepository.java 2020. 5. 13. 오후 1:29:21 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;

/**
 * <pre>
 * 
 * 2020. 5. 13. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 13. 오후 1:29:21
 * @author ssc
 */
public interface DeskingHistRepository extends JpaRepository<DeskingHist, Long> {
    public Long countByDataset_DatasetSeq(Long datasetSeq);

    /**
     * 데이터셋 아이디로 데스킹히스토리 목록 조회
     * 
     * @param datasetSeq 데이터셋아이디
     * @param pageable Pageable
     * @return 데스킹히스토리 목록
     */
    public Page<DeskingHist> findByDataset_DatasetSeq(Long datasetSeq, Pageable pageable);
}
