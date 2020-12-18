/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceSimpleDTO;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.articlesource.service.ArticleSourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
 * @since 2020-12-18
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/article-sources")
@Api(tags = {"기사매체 API"})
public class ArticleSourceRestConroller extends AbstractCommonController {

    @Autowired
    private ArticleSourceService articleSourceService;

    @Value("${desking.article.source}")
    private String[] deskingSourceList;

    @ApiOperation(value = "서비스 기사검색 매체 목록조회")
    @GetMapping
    public ResponseEntity<?> getArticleSourceList() {
        // 조회
        List<ArticleSource> returnValue = articleSourceService.findAllArticleSource(deskingSourceList);

        // 리턴값 설정
        ResultListDTO<ArticleSourceSimpleDTO> resultListMessage = new ResultListDTO<>();
        List<ArticleSourceSimpleDTO> dtoList = modelMapper.map(returnValue, ArticleSourceSimpleDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticleSourceSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    @ApiOperation(value = "벌크전송 매체목록 조회")
    @GetMapping("/bulk")
    public ResponseEntity<?> getBulkArticleSourceList()
            throws Exception {

        try {
            // 조회
            List<ArticleSource> returnValue = articleSourceService.findAllBulkArticleSource();

            // 리턴값 설정
            List<ArticleSourceSimpleDTO> dtoList = modelMapper.map(returnValue, ArticleSourceSimpleDTO.TYPE);
            ResultListDTO<ArticleSourceSimpleDTO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setTotalCnt(dtoList.size());
            resultListMessage.setList(dtoList);

            ResultDTO<ResultListDTO<ArticleSourceSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD BULK ARTICLE SOURCE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD BULK ARTICLE SOURCE", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

}
