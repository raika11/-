/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaSearchDTO;
import jmnet.moka.core.tps.mvc.mic.mapper.MicMapper;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-25
 */
@Service
@Slf4j
public class MicAgendaServiceImpl implements MicAgendaService {

    @Autowired
    private MicMapper micMapper;

    @Override
    public List<MicAgendaVO> findAllMicAgenda(MicAgendaSearchDTO search) {
        return micMapper.findAllMicAgenda(search);
    }

    @Override
    public void insertMicAgenda(MicAgendaVO micAgendaVO) {
        micMapper.insertMicAgenda(micAgendaVO);
    }

    @Override
    public MicAgendaVO findMicAgendaById(Long agndSeq) {
        return micMapper.findMicAgendaById(agndSeq);
    }
}
