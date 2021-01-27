/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.service;

import java.io.IOException;
import java.util.List;
import jmnet.moka.core.tps.mvc.mic.dto.MicBannerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.vo.MicBannerVO;

/**
 * Description: 배너 서비스
 *
 * @author ssc
 * @since 2021-01-26
 */
public interface MicBannerService {
    /**
     * 배너목록 조회
     *
     * @param search 검색조건
     * @return 배너목록
     */
    List<MicBannerVO> findAllMicBanner(MicBannerSearchDTO search);

    /**
     * 배너 상세조회
     *
     * @param bnnrSeq 배너순번
     * @return 배너정보
     */
    MicBannerVO findMicBannerById(Long bnnrSeq);

    /**
     * 배너 등록/수정
     *
     * @param micBannerVO 배너정보
     * @return 이미지 업로드 성공여부.등록실패시 예외
     */
    boolean saveMicBanner(MicBannerVO micBannerVO)
            throws IOException;

    /**
     * 배너 사용여부 토글
     *
     * @param bnnrSeq 배너순번
     */
    void updateMicBannerToggle(Long bnnrSeq);
}
