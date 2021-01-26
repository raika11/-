/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicBannerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaCategoryVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicBannerVO;
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
     * 사용중인 아젠다 카테고리 조회
     *
     * @return 카테고리 목록
     */
    List<MicAgendaCategoryVO> findAllUsedAgendaCategory();

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
}
