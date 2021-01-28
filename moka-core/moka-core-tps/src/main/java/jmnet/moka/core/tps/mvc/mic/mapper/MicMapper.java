/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaCateSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicAnswerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicBannerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaCategoryVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaSimpleVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAnswerRelVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAnswerVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicBannerVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicNotifyVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicRelArticleVO;

/**
 * Description: 시민마이크 Mapper
 *
 * @author ssc
 * @since 2021-01-25
 */
public interface MicMapper extends BaseMapper<MicAgendaVO, MicAgendaSearchDTO> {

    /**
     * 아젠다목록
     *
     * @param search 검색조건
     * @return 아젠다목록
     */
    List<MicAgendaVO> findAllMicAgenda(MicAgendaSearchDTO search);

    /**
     * AGENDA, ANSWER 합계 조회
     *
     * @param param agndTotal:아젠다총갯수, answTotal:포스트 총갯수
     * @return 성공여부
     */
    Integer findMicReport(Map<String, Object> param);

    /**
     * 아젠다 상세조회
     *
     * @param agndSeq 아젠다순번
     * @return 아젠다 정보
     */
    MicAgendaVO findMicAgendaById(Long agndSeq);

    /**
     * 아젠다 카테고리 목록 조회
     *
     * @param agndSeq 아젠다순번
     * @return 카테고리 목록
     */
    List<MicAgendaCategoryVO> findMicAgendaCategoryById(Long agndSeq);

    /**
     * 아젠다 관련기사 목록 조회
     *
     * @param agndSeq 아젠다 순번
     * @return 관련기사 목록
     */
    List<MicRelArticleVO> findMicAgendaRelArticleById(Long agndSeq);

    /**
     * 아젠다 등록
     *
     * @param micAgendaVO 아젠다 정보
     * @return 성공여부
     */
    Integer insertMicAgenda(MicAgendaVO micAgendaVO);

    /**
     * 아젠다 관련기사 모두삭제
     *
     * @param agndSeq 아젠다 순번
     * @return 성공여부
     */
    Integer deleteAllMicAgendaRelArticle(long agndSeq);

    /**
     * 아젠다 관련기사 등록
     *
     * @param micRelArticleVO 아젠다 관련기사 정보
     * @return 성공여부
     */
    Integer insertMicAgendaRelArticle(MicRelArticleVO micRelArticleVO);

    /**
     * 아젠다 카테고리 등록(삭제포함됨)
     *
     * @param param agndSeq: 아젠다순번, xml:카테고리 정보
     * @return 성공여부
     */
    Integer updateMicAgendaCategory(Map<String, Object> param);

    /**
     * 배너목록조회
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
     * @return 성공여부
     */
    Integer saveMicBanner(MicBannerVO micBannerVO);

    /**
     * 사용여부 토글 수정
     *
     * @param bnnrSeq 배너순번
     * @return 성공여부
     */
    Integer updateMicBannerToggle(Long bnnrSeq);

    /**
     * 아젠다 카테고리 조회
     *
     * @return 카테고리 목록
     */
    List<MicAgendaCategoryVO> findAllUsedAgendaCategory(MicAgendaCateSearchDTO search);

    /**
     * 아젠다 카테고리 등록
     *
     * @param param catNm: 카테고리명, retCode: 성공여부(0:중복된명칭있음,1:성공)
     * @return 성공여부
     */
    Integer insertMicAgendaCategory(Map<String, Object> param);

    /**
     * 아젠다 카테고리 일괄수정
     *
     * @param xml 카테고리 정보 xml
     * @return 성공여부
     */
    Integer updateAllMicAgendaCategory(String xml);

    /**
     * 아젠다 순서 변경
     *
     * @param micAgendaSimpleVO 아젠다정보
     * @return 성공여부
     */
    Integer updateMicAgendaOrder(MicAgendaSimpleVO micAgendaSimpleVO);

    /**
     * 답변목록조회
     *
     * @param search 검색조건
     * @return 답변목록
     */
    List<MicAnswerVO> findAllMicAnswer(MicAnswerSearchDTO search);

    /**
     * 답변상세
     *
     * @param answSeq 답변순번
     * @return 답변정보, 관련답변정보
     */
    List<List<Object>> findMicAnswerById(Long answSeq);

    /**
     * 답변 부가정보 삭제(답변에 해당하는 모든 부가정보 삭제)
     *
     * @param answSeq 답변순번
     * @return 성공여부
     */
    Integer deleteAllMicAnswerRel(Long answSeq);

    /**
     * 답변 부가정보 등록
     *
     * @param micAnswerRelVO 답변 부가정보
     * @return 성공여부
     */
    Integer insertMicAnswerRel(MicAnswerRelVO micAnswerRelVO);

    /**
     * 답변 사용여부 수정(답변 삭제기능을 처리함)
     *
     * @param param answSeq:답변순번,usedYn:사용여부
     * @return 성공여부
     */
    Integer updateMicAnswerUsed(Map<String, Object> param);

    /**
     * 답변 상태 수정
     *
     * @param param answSeq:답변순번,answDiv:상태
     * @return 성공여부
     */
    Integer updateMicAnswerDiv(Map<String, Object> param);

    /**
     * 사용자 알림 메세지 등록
     *
     * @param micNotifyVO 알림메세지정보
     * @return 성공여부
     */
    Integer insertMicNotify(MicNotifyVO micNotifyVO);

}
