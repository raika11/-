/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.main.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
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

    @Value("${template.image.prefix}")
    private String templateImagePrefix;

    @Autowired
    private ActionLogger actionLogger;

    @ApiOperation(value = "서버변수 목록조회")
    @GetMapping
    public ResponseEntity<?> getMainList(
            HttpServletRequest request,
            @NotNull Principal principal,
            @RequestAttribute Long processStartTime
    ) {
        // 템플릿 image prefix
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("TEMPLATE_IMAGE_PREFIX", templateImagePrefix);

        ResultMapDTO resultDTO = new ResultMapDTO(result);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
}
