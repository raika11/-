/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaCateSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicBannerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.service.MicAgendaService;
import jmnet.moka.core.tps.mvc.mic.service.MicBannerService;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaCategoryVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicBannerVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    private final MicBannerService micBannerService;

    public MicAgendaRestController(MicAgendaService micAgendaService, MicBannerService micBannerService) {
        this.micAgendaService = micAgendaService;
        this.micBannerService = micBannerService;
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

    @ApiOperation(value = "아젠다 카테고리 목록조회")
    @GetMapping("/agendas/categorys")
    public ResponseEntity<?> getMicAgendaCategoryList(@ApiParam("사용여부") @Valid @SearchParam MicAgendaCateSearchDTO search) {

        // 조회(mybatis)
        List<MicAgendaCategoryVO> returnValue = micAgendaService.findAllMicAgendaCategory(search);

        ResultListDTO<MicAgendaCategoryVO> resultList = new ResultListDTO<MicAgendaCategoryVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<MicAgendaCategoryVO>> resultDTO = new ResultDTO<ResultListDTO<MicAgendaCategoryVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "아젠다 등록")
    @PostMapping(value = "/agendas", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    //    @PostMapping(value = "/agendas", produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
    //                                                                                                     MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postMicAgenda(@ApiParam("아젠다 정보") @RequestBody @Valid MicAgendaVO micAgendaVO,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {

        try {
            micAgendaVO.setRegId(principal.getName());
            micAgendaVO.setRegDt(McpDate.now());
            boolean uploaded = micAgendaService.saveMicAgenda(micAgendaVO);
            String msg = uploaded ? msg("tps.common.success.insert") : msg("tps.agenda.error.image-upload");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT AGENDA]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT AGENDA]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    @ApiOperation(value = "아젠다 수정")
    @PutMapping(value = "/agendas/{agndSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putMicAgenda(@ApiParam("아젠다순번(필수)") @PathVariable("agndSeq") Long agndSeq,
            @ApiParam("아젠다 정보") @RequestBody @Valid MicAgendaVO micAgendaVO, @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {

        try {
            micAgendaVO.setRegId(principal.getName());
            micAgendaVO.setRegDt(McpDate.now());
            boolean uploaded = micAgendaService.saveMicAgenda(micAgendaVO);
            String msg = uploaded ? msg("tps.common.success.update") : msg("tps.agenda.error.image-upload");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE AGENDA]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE AGENDA]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "배너 목록조회")
    @GetMapping("/banners")
    public ResponseEntity<?> getMicBannerList(@ApiParam("검색조건") @Valid @SearchParam MicBannerSearchDTO search) {

        // 조회(mybatis)
        List<MicBannerVO> returnValue = micBannerService.findAllMicBanner(search);

        ResultListDTO<MicBannerVO> resultList = new ResultListDTO<MicBannerVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<MicBannerVO>> resultDTO = new ResultDTO<ResultListDTO<MicBannerVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "배너 상세조회")
    @GetMapping("/banners/{bnnrSeq}")
    public ResponseEntity<?> getMicBanner(@ApiParam("배너순번(필수)") @PathVariable("bnnrSeq") Long bnnrSeq) {

        // 조회(mybatis)
        MicBannerVO returnValue = micBannerService.findMicBannerById(bnnrSeq);

        ResultDTO<MicBannerVO> resultDTO = new ResultDTO<MicBannerVO>(returnValue);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
}
