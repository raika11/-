/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaSearchDTO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaVO;

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
     * 아젠다 등록
     *
     * @param micAgendaVO 아젠다 정보
     * @return 성공여부
     */
    Integer insertMicAgenda(MicAgendaVO micAgendaVO);
}
