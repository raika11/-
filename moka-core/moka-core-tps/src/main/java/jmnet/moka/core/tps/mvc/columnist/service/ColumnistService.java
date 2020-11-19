/**
 * msp-tps DomainService.java 2020. 1. 8. 오후 2:06:54 ssc
 */
package jmnet.moka.core.tps.mvc.columnist.service;

import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistSearchDTO;
import jmnet.moka.core.tps.mvc.columnist.entity.Columnist;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * 도메인 서비스 2020. 1. 8. ssc 최초생성
 * 메소드 생성 규칙
 * 목록 조회 : find{Target}List
 * ID로 상세 조회 : find{Target}ById
 * 여러 속성으로 상세 조회 : find{Target}
 * 수정 : update{Target}
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:06:54
 */
public interface ColumnistService {

    /**
     * 링크목록 조회
     *
     * @param search 검색조건
     * @return 칼럼리스트 목록조회
     */
    Page<Columnist> findAllColumnist(ColumnistSearchDTO search);

    /**
     * 링크 조회
     *
     * @param seqNo 링크일련번호
     * @return 칼럼리스트 단건조회
     */
    Optional<Columnist> findById(Long seqNo);

    /**
     * 칼럼리스트 수정
     *
     * @param columnist 칼럼리스트정보
     * @return 수정된 칼럼리스트정보
     */
    Columnist updateColumnist(Columnist columnist);

    /**
     * 링크관리 등록
     *
     * @param columnist 컬럼리스트 컬럼리스트정보
     * @return 등록된 컬럼리스트
     */
    Columnist insertColumnist(Columnist columnist);

    /**
     * 아이디 존재 여부
     *
     * @param seqNo 일련번호
     * @return 존재 여부
     */
    boolean isDuplicatedId(Long seqNo);

    /**
     * 그룹에 속한 멤버 존재 여부 조회
     *
     * @param seqNo 일련번호
     * @return 존재 여부
     */
    boolean hasMembers(Long seqNo);

    /**
     * 그룹 삭제
     *
     * @param columnist 그룹 정보
     */
    void deleteColumnist(Columnist columnist);

    /**
     * 썸네일 이미지 저장
     * @param columnist 템플릿
     * @param thumbnail 썸네일 이미지(Multipart)
     * @return 이미지 uri
     * @throws Exception 예외처리
     */
    String saveImage(Columnist columnist, MultipartFile thumbnail) throws Exception;

    /**
     * 썸네일 이미지 삭제
     * @param columnist 템플릿
     * @return 삭제 결과
     * @throws Exception 예외처리
     */
    boolean deleteImage(Columnist columnist) throws Exception;


}
