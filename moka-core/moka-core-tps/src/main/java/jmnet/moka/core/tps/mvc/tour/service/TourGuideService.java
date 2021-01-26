/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.tour.vo.TourGuideVO;

/**
 * Description: 견학 서비스
 *
 * @author ssc
 * @since 2021-01-20
 */
public interface TourGuideService {
    /**
     * 견학 메세지 목록 조회
     *
     * @return
     */
    List<TourGuideVO> findAllTourGuide();

    /**
     * 견학 메세지 등록 또는 수정
     *
     * @param guideVOList 견학 메세지 목록
     * @return 등록된 견학 메세지 성공여부
     */
    boolean saveTourGuide(List<TourGuideVO> guideVOList);
}
