/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.service.IssueDeskingService;
import jmnet.moka.core.tps.mvc.issue.service.PackageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: 내부 연동 시스템 이슈편집 API
 *
 * @author ssc
 * @since 2021-03-02
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/internal/issue")
@Api(tags = {"내부 연동 시스템 이슈편집 API"})
public class InternalIssueRestController extends AbstractCommonController {

    private final IssueDeskingService issueDeskingService;

    private final PackageService packageService;

    public InternalIssueRestController(IssueDeskingService issueDeskingService, PackageService packageService) {
        this.issueDeskingService = issueDeskingService;
        this.packageService = packageService;
    }

    @ApiOperation(value = "예약편집기사를 서비스에 등록")
    @PostMapping
    public ResponseEntity<?> getComponentWorkList(
            @ApiParam(value = "패키지순번", required = true) @RequestParam(value = "pkgSeq", required = true) Long pkgSeq,
            @ApiParam(value = "컴포넌트번호", required = true) @RequestParam(value = "compNo", required = true) Integer compNo)
            throws Exception {
        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
        try {
            issueDeskingService.excuteReserve(packageMaster, compNo);

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO SAVE RESERVE ISSUE DESK]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO SAVE RESERVE ISSUE DESK]", e, true);
            throw new Exception(msg("tps.issue.error.reserve-excute"), e);
        }
    }

}
