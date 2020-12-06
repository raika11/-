/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.special.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtDTO;
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtSearchDTO;
import jmnet.moka.core.tps.mvc.special.entity.SpecialPageMgt;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 12. 6.
 */
public interface SpecialPageMgtService {
    /**
     * 디지털스페셜 목록조회
     *
     * @param search    검색조건
     * @return          디지털스페셜 목록
     */
    Page<SpecialPageMgt> findAllSpecialPageMgt(SpecialPageMgtSearchDTO search);

    /**
     * 디지털스페셜 상세조회
     *
     * @param seqNo     검색조건
     * @return          디지털스페셜 정보
     */
    Optional<SpecialPageMgt> findSpecialPageMgtBySeq(Long seqNo);

    /**
     * 디지털스페셜 등록
     *
     * @param specialPageMgt    디지털스페셜 정보
     * @return                  디지털스페셜 정보
     */
    SpecialPageMgt insertSpecialPageMgt(SpecialPageMgt specialPageMgt);

    /**
     * 디지털스페셜 수정
     *
     * @param specialPageMgt    수정할 디지털스페셜 정보
     * @return                  수정된 디지털스페셜 정보
     */
    SpecialPageMgt updateSpecialPageMgt(SpecialPageMgt specialPageMgt);

    /**
     * 이미지 저장
     * @param specialPageMgt    디지털스페셜 정보
     * @param thumbnail         이미지파일
     * @return                  이미지경로(전체경로)
     */
    String saveImage(SpecialPageMgt specialPageMgt, MultipartFile thumbnail);

    /**
     * 디지털스페셜 삭제
     * @param specialPageMgt    삭제할 디지털스페셜
     */
    void deleteSpecialPageMgt(SpecialPageMgt specialPageMgt);
}
