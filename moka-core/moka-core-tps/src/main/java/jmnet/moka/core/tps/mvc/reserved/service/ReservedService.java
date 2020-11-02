/**
 * msp-tps ReservedService.java 2020. 6. 17. 오전 11:47:18 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.service;

import java.util.Optional;
import javax.validation.Valid;
import jmnet.moka.core.tps.mvc.reserved.dto.ReservedSearchDTO;
import jmnet.moka.core.tps.mvc.reserved.entity.Reserved;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 17. 오전 11:47:18
 */
public interface ReservedService {

    /**
     * <pre>
     * 예약어 목록 조회
     * </pre>
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 예약어 목록
     */
    public Page<Reserved> findAllReserved(@Valid ReservedSearchDTO search, Pageable pageable);

    /**
     * <pre>
     * 예약어 정보 조회
     * </pre>
     *
     * @param reservedSeq 예약어 순번
     * @return 예약어 정보
     */
    public Optional<Reserved> findReservedBySeq(Long reservedSeq);

    /**
     * <pre>
     * 예약어 정보 등록
     * </pre>
     *
     * @param reserved 예약어 정보
     * @return 등록된 예약어 정보
     */
    public Reserved insertReserved(Reserved reserved);

    /**
     * <pre>
     * 예약어 정보 수정
     * </pre>
     *
     * @param reserved 예약어 정보
     * @return 수정된 예약어 정보
     */
    public Reserved updateReserved(Reserved reserved);

    /**
     * <pre>
     * 예약어 정보 삭제
     * </pre>
     *
     * @param reserved 삭제할 예약어정보
     */
    public void deleteReserved(Reserved reserved);

    /**
     * 도메인아이디와 관련된 예약어수
     *
     * @param domainId 도메인아이디
     * @return 예약어수
     */
    public int countReservedByDomainId(String domainId);

    /**
     * 예약어 중복검사
     *
     * @param reservedId 예약어ID
     * @param domainId   도메인
     * @return 중복여부
     */
    boolean isDuplicatedId(String reservedId, String domainId);
}
