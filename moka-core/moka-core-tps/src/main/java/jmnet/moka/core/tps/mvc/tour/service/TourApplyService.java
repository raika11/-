/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.tour.dto.TourApplySearchDTO;
import jmnet.moka.core.tps.mvc.tour.vo.TourApplyVO;

/**
 * Description: 견학 신청 service
 *
 * @author ssc
 * @since 2021-01-21
 */
public interface TourApplyService {

    /**
     * 신청목록 조회
     *
     * @param search 검색조건
     * @return 신청목록
     */
    List<TourApplyVO> findAllTourApply(TourApplySearchDTO search);

    /**
     * 신청상세 조회
     *
     * @param tourSeq 신청Seq
     * @return 신청상세정보
     */
    TourApplyVO findTourApply(Long tourSeq);
}
