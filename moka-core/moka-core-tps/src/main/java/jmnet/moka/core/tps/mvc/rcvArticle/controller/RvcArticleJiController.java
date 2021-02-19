/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleJiSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleJiXmlDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleJiXml;
import jmnet.moka.core.tps.mvc.rcvArticle.service.RcvArticleJiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-02-18
 */
@Controller
@Validated
@Slf4j
@RequestMapping("/jopan")
@Api(tags = {"조판"})
public class RvcArticleJiController extends AbstractCommonController {
    @Autowired
    private RcvArticleJiService rcvArticleJiService;

    @GetMapping
    public void getRcvArticleJi(@Valid RcvArticleJiSearchDTO search, @ApiParam(hidden = true) HttpServletResponse response)
            throws Exception {
        try {
            RcvArticleJiSearchDTO sch = RcvArticleJiSearchDTO
                    .builder()
                    .sourceCode("1")
                    .ho(17148)
                    .pressDate(McpDate.date("2020-09-04 00:00:00"))
                    .myun("01")
                    .section("D1001")
                    .revision("01")
                    .build();
            Page<RcvArticleJiXml> returnValue = rcvArticleJiService.findAllRcvArticleJi(sch);

            List<RcvArticleJiXmlDTO> dtoList = modelMapper.map(returnValue.getContent(), RcvArticleJiXmlDTO.TYPE);

            RcvArticleJiXmlDTO jopan = dtoList.get(0);
            

            // 작업...
            String xmlBody = jopan.getXmlBody();

            response.setHeader("X-XSS-Protection", "0");
            response.setContentType("text/html; charset=UTF-8");
            response
                    .getWriter()
                    .write(xmlBody);

        } catch (Exception e) {
            log.error("[FAIL TO LOAD RCV ARTICLE JI XML]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD RCV ARTICLE JI XML]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }

    }
}
