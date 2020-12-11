/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.controller;

import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.naver.service.NaverService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
public class NaverRestController extends AbstractCommonController {

    @Autowired
    private NaverService naverService;

    @ApiOperation("네이버 스탠드 전송")
    @GetMapping("/news-stand")
    public ResponseEntity<?> getPublishNaverStand(HttpServletRequest request, String source, Long areaSeq)
            throws Exception {
        try {
            naverService.publishNaverStand(source, areaSeq);

            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, msg("tps.desking.sucess.naver-stand"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO PUBLISH NAVER STAND]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO PUBLISH NAVER STAND]", e, true);
            throw new Exception(msg("tps.desking.error.naver-stand"), e);
        }
    }
}
