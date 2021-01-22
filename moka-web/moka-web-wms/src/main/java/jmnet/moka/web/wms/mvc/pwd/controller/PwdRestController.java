/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.wms.mvc.pwd.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-22
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/pwd")
@Api(tags = {"비밀번호 API"})
public class PwdRestController extends AbstractCommonController {

    private final PasswordEncoder passwordEncoder;

    public PwdRestController(MessageByLocale messageByLocale, TpsLogger tpsLogger, PasswordEncoder passwordEncoder) {
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
        this.passwordEncoder = passwordEncoder;
    }

    @ApiOperation(value = "견학 신청 비밀번호 초기화")
    @PostMapping("/tour/resest")
    public ResponseEntity<?> postResetPwd(@ApiParam("전화번호 뒷 4자리") @RequestParam("phone") String phone)
            throws Exception {
        try {
            String pwd = passwordEncoder.encode(phone);

            ResultDTO<String> resultDTO = new ResultDTO<String>(pwd, msg("tps.tour-apply.success.reset-pwd"));
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO RESET PASSWORD TOUR APPLY] phone: {} {}", phone, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO RESET PASSWORD TOUR APPLY]", e, true);
            throw new Exception(msg("tps.tour-apply.error.reset-pwd"), e);
        }
    }
}
