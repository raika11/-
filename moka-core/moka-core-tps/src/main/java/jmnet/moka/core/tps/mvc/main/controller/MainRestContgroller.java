/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.main.controller;

import io.swagger.annotations.ApiOperation;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Description: 서버변수 관리
 *
 * @author ssc
 * @since 2020-10-20
 */
@Controller
@Validated
@Slf4j
@RequestMapping("/api/main")
public class MainRestContgroller {

    @Value("${tps.upload.path.url}")
    private String uploadPathUrl;

    @Autowired
    private TpsLogger tpsLogger;

    @ApiOperation(value = "서버변수 목록조회")
    @GetMapping
    public ResponseEntity<?> getMainList(HttpServletRequest request) {
        // 파일 서비스 prefix
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("UPLOAD_PATH_URL", uploadPathUrl);

        ResultMapDTO resultDTO = new ResultMapDTO(result);

        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
}
