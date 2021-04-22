/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.my.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.validation.Valid;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.my.dto.MyEmailDTO;
import jmnet.moka.core.tps.mvc.my.service.MyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: 개인정보 수정API
 *
 * @author ssc
 * @since 2021-04-22
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/internal/my")
@Api(tags = {"내부 연동 시스템 개인정보 API"})
public class InternalMyRestController extends AbstractCommonController {

    private final MyService myService;

    public InternalMyRestController(MyService myService) {
        this.myService = myService;
    }

    @ApiOperation(value = "이메일변경")
    @PutMapping("/email")
    public ResponseEntity<?> putMyEmail(@ApiParam(value = "회원정보", required = true) @Valid MyEmailDTO myEmail)
            throws Exception {

        try {
            myService.updateEmail(myEmail);

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MEMBER EMAIL]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO UPDATE MEMBER EMAIL]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

}
