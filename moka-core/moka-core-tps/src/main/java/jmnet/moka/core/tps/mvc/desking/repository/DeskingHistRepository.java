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

    /**
     * 데이타셋에 해당하는 편집기사목록갯수. 데이타셋에 해당하는 편집기사가 있는지 조사하기 위해 사용
     *
     * @param datasetSeq 데이타셋 Seq
     * @return 편집기사갯수
     */
    Long countByDatasetSeq(Long datasetSeq);

}
