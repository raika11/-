/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaCateSearchDTO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaCategoryVO;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-27
 */
public interface MicAgendaCategoryService {

    /**
     * 카테고리 목록 조회
     *
     * @param search 검색조건
     * @return 카테고리 목록
     */
    List<MicAgendaCategoryVO> findAllMicAgendaCategory(MicAgendaCateSearchDTO search);

    /**
     * 카테고리 등록
     *
     * @param micAgendaCategoryVO 카테고리 정보
     * @return 성공여부(0 : 중복된명칭있음, 1 : 성공)
     */
    boolean insertMicAgendaCategory(MicAgendaCategoryVO micAgendaCategoryVO);

    /**
     * 카테고리 일괄수정
     *
     * @param micAgendaCategoryVOList 카테고리 목록
     */
    void updateMicAgendaCategory(List<MicAgendaCategoryVO> micAgendaCategoryVOList);
}
