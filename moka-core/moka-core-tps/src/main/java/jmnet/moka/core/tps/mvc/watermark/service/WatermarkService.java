package jmnet.moka.core.tps.mvc.watermark.service;

import java.util.List;
import java.util.Optional;

import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.watermark.service
 * ClassName : WatermarkService
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 13:39
 */
public interface WatermarkService {

    /**
     * 사용중인 워터마크 목록 조회
     *
     * @return 워터마크
     */
    List<Watermark> findAllWatermark();


    /**
     * 워터마크 목록 조회
     *
     * @return 워터마크
     */
    Page<Watermark> findAllWatermark(WatermarkSearchDTO search);

    /**
     * 워터마크 조회
     *
     * @param seqNo 일련번호
     * @return 사이트정보조회
     */
    Optional<Watermark> findById(Long seqNo);

    /**
     * 아이디 존재 여부
     *
     * @param seqNo 일련번호
     * @return 존재 여부
     */
    boolean isDuplicatedId(Long seqNo);

    /**
     * 워터마크 등록
     *
     * @param watermark 워터마크정보
     * @return 등록된 워터마크정보
     */
    Watermark insertWatermark(Watermark watermark);

    /**
     * 워터마크 수정
     *
     * @param watermark 워터마크정보
     * @return 수정된 워터마크정보
     */
    Watermark updateWatermark(Watermark watermark);

    /**
     * 썸네일 이미지 저장
     *
     * @param watermark 템플릿
     * @param thumbnail  썸네일 이미지(Multipart)
     * @return 이미지 uri
     * @throws Exception 예외처리
     */
    String saveImage(Watermark watermark, MultipartFile thumbnail)
            throws Exception;

    /**
     * 그룹 삭제
     *
     * @param watermark 그룹 정보
     */
    void deleteWatermark(Watermark watermark);

    /**
     * 썸네일 이미지 삭제
     *
     * @param watermark 템플릿
     * @return 삭제 결과
     * @throws Exception 예외처리
     */
    boolean deleteImage(Watermark watermark)
            throws Exception;

}
