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

    /**
     * 신청 수정
     *
     * @param tourApplyVO 신청정보
     * @return 수정된 신청정보
     */
    TourApplyVO updateTourApply(TourApplyVO tourApplyVO);

    /**
     * 신청삭제(delYn='Y'로 업데이트)
     *
     * @param tourSeq 신청순번
     */
    void deleteTourApply(Long tourSeq);

    //    /**
    //     * DES 암호화
    //     *
    //     * @param phone 전화번호 뒷 4자리
    //     * @return 암호화된 문자열
    //     */
    //    String DESEncrypt(String phone)
    //            throws Exception;

    /**
     * 월별 견학 신청 목록 조회
     *
     * @param startYear  년도
     * @param startMonth 월
     * @return 견학 신청 목록
     */
    List<TourApplyVO> findAllTourApplyMonth(String startYear, String startMonth);
}
