/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.service;

import java.io.IOException;
import java.util.List;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaCateSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaSearchDTO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaCategoryVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaVO;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-25
 */
public interface MicAgendaService {
    /**
     * 아젠다 목록 조회
     *
     * @param search 검색조건
     * @return 아젠다 목록
     */
    List<MicAgendaVO> findAllMicAgenda(MicAgendaSearchDTO search);

    /**
     * 아젠다 저장
     *
     * @param micAgendaVO 아젠다 정보
     * @return 이미지 업로드 성공여부. 실패시 exception
     */
    boolean saveMicAgenda(MicAgendaVO micAgendaVO)
            throws IOException;

    /**
     * 아젠다 상세조회
     *
     * @param agndSeq 아젠다순번
     * @return 아젠다정보
     */
    MicAgendaVO findMicAgendaById(Long agndSeq);

    /**
     * 카테고리 목록 조회
     *
     * @param search 검색조건
     * @return 카테고리 목록
     */
    List<MicAgendaCategoryVO> findAllMicAgendaCategory(MicAgendaCateSearchDTO search);
}
