/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.controller;

import io.swagger.annotations.ApiOperation;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.naver.service.NaverService;
import lombok.extern.slf4j.Slf4j;
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

    private NaverService naverService;

    @ApiOperation("뉴스스탠드 전송")
    @GetMapping("/news-stand")
    public ResponseEntity<?> getNewsStand(String source, Long areaSeq) {
        naverService.publishNewsStand(source, areaSeq);
        return null;
    }
}
