/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.tour.dto.TourApplySearchDTO;
import jmnet.moka.core.tps.mvc.tour.dto.TourDenySearchDTO;
import jmnet.moka.core.tps.mvc.tour.vo.TourApplyVO;
import jmnet.moka.core.tps.mvc.tour.vo.TourDenyVO;
import jmnet.moka.core.tps.mvc.tour.vo.TourGuideVO;
import jmnet.moka.core.tps.mvc.tour.vo.TourPossibleDenyVO;
import jmnet.moka.core.tps.mvc.tour.vo.TourSetupVO;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-20
 */
public interface TourMapper extends BaseMapper<TourDenyVO, TourDenySearchDTO> {

    /**
     * 견학 메세지 목록 조회
     *
     * @return 견학메세지 목록
     */
    List<TourGuideVO> upuTbJoongangTourGuideListSel();

    /**
     * 견학 메세지 수정
     *
     * @param tourGuide 견학메세지
     * @return 성공여부
     */
    Integer upuTbJoongangTourGuideUpd(TourGuideVO tourGuide);

    /**
     * 휴일 목록 조회
     *
     * @param search 검색조건
     * @return 휴일목록
     */
    List<TourDenyVO> upuTbJoongangTourDenyListSel(TourDenySearchDTO search);

    /**
     * 휴일 등록
     *
     * @param tourDeny 휴일정보
     * @return 성공여부
     */
    Integer upuTbJoongangTourDenyIns(TourDenyVO tourDeny);

    /**
     * 휴일 수정
     *
     * @param tourDeny 휴일정보
     * @return 성공여부
     */
    Integer upuTbJoongangTourDenyUpd(TourDenyVO tourDeny);

    /**
     * 휴일 삭제
     *
     * @param denySeq 휴일Seq
     * @return 성공여부
     */
    Integer upuTbJoongangTourDenyDel(Long denySeq);

    /**
     * 견학기본설정 조회
     *
     * @return 견학기본설정
     */
    TourSetupVO upuTbJoongangTourSetupSel();

    /**
     * 견학기본설정 수정
     *
     * @param tourSetup 견학기본설정
     * @return 성공여부
     */
    Integer upuTbJoongangTourSetupUpd(TourSetupVO tourSetup);

    /**
     * 견학신청목록 조회
     *
     * @param search 검색조건
     * @return 견학신청목록
     */
    List<TourApplyVO> upuTbJoongangTourApplyListSel(TourApplySearchDTO search);

    /**
     * 견학신청 상세조회
     *
     * @param tourSeq 신청seq
     * @return 견학신청 상세
     */
    TourApplyVO upuTbJoongangTourApplyByseqSel(long tourSeq);

    /**
     * 견학신청 수정
     *
     * @param tourApplyVO 견학신청정보
     * @return 성공여부
     */
    Integer upuTbJoongangTourApplyUpd(TourApplyVO tourApplyVO);

    /**
     * 견학 가능일 목록조회
     *
     * @return 견학 가능일 목록
     */
    List<TourPossibleDenyVO> upuTbJoongangTourPossibleBysel();

    /**
     * 견학신청 삭제
     *
     * @param tourSeq 견학신청Seq
     * @return 성공여부
     */
    Integer upuTbJoongangTourApplyDel(Long tourSeq);

    /**
     * 월별 견학 휴일 목록 조회
     *
     * @param param startYear: 연도, startMonth: 월
     * @return 견학 휴일 목록
     */
    List<TourDenyVO> upuTbJoongangTourDenyBymonthSel(Map<String, Object> param);

    /**
     * 월별 견학 신청 목록 조회
     *
     * @param param startYear: 연도, startMonth: 월, adminYn: 관리자여부
     * @return 견학 신청 목록
     */
    List<TourApplyVO> upuTbJoongangTourApplyBymonthSel(Map<String, Object> param);

}
