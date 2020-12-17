/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.naver.service.NaverService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-11
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/naver")
@Api(tags = {"네이버 API"})
public class NaverRestController extends AbstractCommonController {

    private final NaverService naverService;

    public NaverRestController(NaverService naverService) {
        this.naverService = naverService;
    }

    @ApiOperation("네이버 스탠드 전송")
    @GetMapping("/stand")
    public ResponseEntity<?> getPublishNaverStand(@ApiParam("편집영역 일련번호(필수)") Long areaSeq)
            throws Exception {
        try {
            String msg = naverService.publishNaverStand(areaSeq) ? msg("tps.naver.sucess.stand") : msg("tps.naver.error.stand");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, msg);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO PUBLISH NAVER STAND]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO PUBLISH NAVER STAND]", e, true);
            throw new Exception(msg("tps.naver.error.stand"), e);
        }
    }

    @ApiOperation("네이버 채널 전송")
    @GetMapping("/channel")
    public ResponseEntity<?> getPublishNaverChannel(@ApiParam("편집영역 일련번호(필수)") Long areaSeq)
            throws Exception {
        try {
            String msg = naverService.publishNaverChannel(areaSeq) ? msg("tps.naver.sucess.channel") : msg("tps.naver.error.channel");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, msg);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO PUBLISH NAVER CHANNEL]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO PUBLISH NAVER CHANNEL]", e, true);
            throw new Exception(msg("tps.naver.error.channel"), e);
        }
    }
}
