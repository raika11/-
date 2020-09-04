/**
 * msp-tps ScreenRepository.java 2020. 5. 13. 오후 1:29:21 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingRelWork;
import javax.transaction.Transactional;

/**
 * <pre>
 * 
 * 2020. 5. 13. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 13. 오후 1:29:21
 * @author ssc
 */
public interface DeskingRelWorkRepository
        extends JpaRepository<DeskingRelWork, Long>, DeskingRelWorkRepositorySupport {

    /**
     * deskingSeq와 creator로 릴레이션워크 목록 조회
     * 
     * @param deskingSeq 데스킹아이디
     * @param creator 생성자
     * @return 릴레이션 워크 목록
     */
    public List<DeskingRelWork> findByDeskingSeqAndCreatorOrderByRelOrderAsc(Long deskingSeq,
            String creator);

    /**
     * deskingSeq와 creator로 릴레이션워크 제거
     * 
     * @param deskingSeq 데스킹아이디
     * @param creator 생성자
     */
    public void deleteByDeskingSeqAndCreator(Long deskingSeq, String creator);

    /**
     * 관련아이템 삭제
     * @param datasetSeq
     * @param creator
     */
    @Transactional
    @Modifying
    @Query(value = "DELETE r FROM WMS_DESKING_REL r , WMS_DESKING d WHERE r.DESKING_SEQ = d.DESKING_SEQ AND d.DATASET_SEQ=:datasetSeq AND r.CREATOR = :creator",
            nativeQuery = true)
    public void deleteByDatasetSeq(@Param("datasetSeq") Long datasetSeq, @Param("creator") String creator);

}
