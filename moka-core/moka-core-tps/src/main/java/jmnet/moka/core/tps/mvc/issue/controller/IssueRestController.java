/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.service.PackageService;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 이슈 API
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/issue")
@Api(tags = {"이슈 API"})
public class IssueRestController extends AbstractCommonController {

    private final PackageService packageService;

    public IssueRestController(PackageService packageService) {
        this.packageService = packageService;
    }

    @ApiOperation(value = "패키지목록조회")
    @GetMapping
    public ResponseEntity<?> getPackageList(@Valid @SearchParam PackageSearchDTO search)
            throws Exception {

        try {
            List<PackageVO> returnValue = packageService.findAllPackage(search);

            // 리턴값 설정
            ResultListDTO<PackageVO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setTotalCnt(search.getTotal());
            resultListMessage.setList(returnValue);

            ResultDTO<ResultListDTO<PackageVO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD PACKAGE LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD PACKAGE LIST]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }
}
