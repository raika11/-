/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaSearchDTO;
import jmnet.moka.core.tps.mvc.mic.service.MicAgendaService;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: 시민마이크 API
 *
 * @author ssc
 * @since 2021-01-25
 */
@RestController
@RequestMapping("/api/mics")
@Slf4j
@Api(tags = {"시민마이크 API"})
public class MicAgendaRestController extends AbstractCommonController {

    private final MicAgendaService micAgendaService;

    public MicAgendaRestController(MicAgendaService micAgendaService) {
        this.micAgendaService = micAgendaService;
    }

    @ApiOperation(value = "아젠다 목록조회")
    @GetMapping("/agendas")
    public ResponseEntity<?> getMicAgendaList(@ApiParam("검색조건") @Valid @SearchParam MicAgendaSearchDTO search) {

        // 조회(mybatis)
        List<MicAgendaVO> returnValue = micAgendaService.findAllMicAgenda(search);

        ResultListDTO<MicAgendaVO> resultList = new ResultListDTO<MicAgendaVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<MicAgendaVO>> resultDTO = new ResultDTO<ResultListDTO<MicAgendaVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "아젠다 상세조회")
    @GetMapping("/agendas/{agndSeq}")
    public ResponseEntity<?> getMicAgendaList(@ApiParam("아젠다순번(필수)") @PathVariable("agndSeq") Long agndSeq) {

        // 조회(mybatis)
        MicAgendaVO returnValue = micAgendaService.findMicAgendaById(agndSeq);

        ResultDTO<MicAgendaVO> resultDTO = new ResultDTO<MicAgendaVO>(returnValue);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "아젠다 등록")
    @PostMapping(value = "/agendas", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postMicAgenda(@ApiParam("아젠다 정보") @RequestBody MicAgendaVO micAgendaVO)
            throws Exception {

        try {
            micAgendaService.insertMicAgenda(micAgendaVO);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.insert"));
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT AGENDA]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT AGENDA]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }
}
