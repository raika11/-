/**
 * msp-tps DeskingRepositorySupport.java 2020. 8. 11. 오전 10:42:56 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;

/**
 * <pre>
 *
 * 2020. 8. 11. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 8. 11. 오전 10:42:56
 */
public interface DeskingRepositorySupport {
    /**
     * 주어진 시간이후에 생성한 작업자 조회
     *
     * @param datasetSeq 데이타셋 순번
     * @param regDt      최소시간
     * @param regId      제외 작업자
     * @return 작업된 편집목록
     */
    public List<Desking> findByOtherCreator(Long datasetSeq, Date regDt, String regId);


    /**
     * 데이타셋 별로 기사목록조회(관련기사제외)
     *
     * @param datasetSeq 데이타셋SEQ
     * @return 기사목록
     */
    List<Desking> findByDatasetSeq(Long datasetSeq);
}
