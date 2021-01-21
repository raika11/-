/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.tour.dto.TourDenySearchDTO;
import jmnet.moka.core.tps.mvc.tour.vo.TourDenyVO;

/**
 * Description: 견학 휴일 서비스
 *
 * @author ssc
 * @since 2021-01-21
 */
public interface TourDenyService {

    /**
     * 견학휴일목록 조회
     *
     * @param search 검색조건
     * @return 견학휴일목록
     */
    List<TourDenyVO> findAllTourDeny(TourDenySearchDTO search);

    /**
     * 휴일등록
     *
     * @param tourDenyVo 휴일정보
     */
    void insertTourDeny(TourDenyVO tourDenyVo);

    /**
     * 휴일수정
     *
     * @param tourDenyVo 휴일수정
     */
    void updateTourDeny(TourDenyVO tourDenyVo);

    /**
     * 휴일삭제
     *
     * @param denySeq 휴일순번
     */
    void deleteTourDeny(Long denySeq);
}
