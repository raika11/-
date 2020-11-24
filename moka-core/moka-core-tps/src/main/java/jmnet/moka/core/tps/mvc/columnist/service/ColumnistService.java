/**
 * msp-tps ColumnistService.java 2020. 1. 8. 오후 2:06:54 ssc
 */
package jmnet.moka.core.tps.mvc.columnist.service;

import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistSearchDTO;
import jmnet.moka.core.tps.mvc.columnist.entity.Columnist;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * 칼럼리스트 서비스 2020. 1. 8. ssc 최초생성
 * 메소드 생성 규칙
 * 목록 조회 : findAllColumnist{Target}List
 * ID로 상세 조회 : find{Target}ById
 * 여러 속성으로 상세 조회 : find{Target}
 * 등록 : insert{Target}
 * 수정 : update{Target}
 * 중복조회 : isDuplicatedId{Target}
 * 이미지저장 : saveImage{Target}
 * 이미지삭제 : deleteImage{Target}
 * @author ssc
 * @since 2020. 1. 8. 오후 2:06:54
 */
public interface ColumnistService {

    /**
     * 칼럼리스트목록 조회
     *
     * @param search 검색조건
     * @return 칼럼리스트 목록조회
     */
    Page<Columnist> findAllColumnist(ColumnistSearchDTO search);

    /**
     * 칼럼리스트 조회
     *
     * @param seqNo 일련번호
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
     * 칼럼리스트 등록
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
