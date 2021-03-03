/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.desking.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.desking.service.DeskingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-03-02
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/internal/desking")
@Api(tags = {"내부 연동 시스템 페이지편집 API"})
public class InternalDeskingRestController extends AbstractCommonController {

    private final DeskingService deskingService;

    public InternalDeskingRestController(DeskingService deskingService) {
        this.deskingService = deskingService;
    }

    @ApiOperation(value = "예약편집기사를 서비스에 등록")
    @PostMapping
    public ResponseEntity<?> getComponentWorkList(
            @ApiParam(value = "편집영역 일련번호", required = true) @RequestParam(value = "componentSeq", required = true) Long componentSeq,
            @ApiParam(value = "작업자", required = true) @RequestParam(value = "regId", required = true) String regId)
            throws Exception {
        try {
            deskingService.excuteReserve(componentSeq, regId);

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO SAVE RESERVE DESKING]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO SAVE RESERVE DESKING]", e, true);
            throw new Exception(msg("tps.desking.error.save"), e);
        }
    }

}
