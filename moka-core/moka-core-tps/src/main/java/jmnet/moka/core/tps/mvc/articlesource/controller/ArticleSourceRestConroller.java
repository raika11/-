/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceDTO;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceSimpleDTO;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.articlesource.service.ArticleSourceService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    /**
     * 서비스 기사검색 매체 목록조회(페이지편집용)
     *
     * @return 매체목록
     */
    @ApiOperation(value = "서비스 기사검색 매체 목록조회")
    @GetMapping("/desking")
    public ResponseEntity<?> getDeskingArticleSourceList() {
        // 조회
        List<ArticleSource> returnValue = articleSourceService.findAllArticleSourceByDesking(deskingSourceList);

        // 리턴값 설정
        ResultListDTO<ArticleSourceSimpleDTO> resultListMessage = new ResultListDTO<>();
        List<ArticleSourceSimpleDTO> dtoList = modelMapper.map(returnValue, ArticleSourceSimpleDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticleSourceSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 벌크전송 매체목록 조회(네이버채널용)
     *
     * @return 매체목록
     * @throws Exception 예외
     */
    @ApiOperation(value = "벌크전송 매체목록 조회")
    @GetMapping("/bulk")
    public ResponseEntity<?> getBulkArticleSourceList()
            throws Exception {

        try {
            // 조회
            List<ArticleSource> returnValue = articleSourceService.findAllArticleSourceByBulk();

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

    /**
     * 매체 목록조회
     *
     * @param search 검색조건
     * @return 매체목록
     */
    @ApiOperation(value = "매체 목록조회")
    @GetMapping
    public ResponseEntity<?> getArticleSourceList(@Valid @SearchParam SearchDTO search) {
        // 조회
        Page<ArticleSource> returnValue = articleSourceService.findAllArticleSource(search);

        // 리턴값 설정
        ResultListDTO<ArticleSourceDTO> resultListMessage = new ResultListDTO<>();
        List<ArticleSourceDTO> dtoList = modelMapper.map(returnValue.getContent(), ArticleSourceDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticleSourceDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 매체 상세조회
     *
     * @param sourceCode 매체코드(필수)
     * @return 매체정보
     * @throws NoDataException 데이타없음예외
     */
    @ApiOperation(value = "매체 상세조회")
    @GetMapping("/{sourceCode}")
    public ResponseEntity<?> getArticleSource(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode)
            throws NoDataException {
        ArticleSource articleSource = articleSourceService
                .findAricleSourceById(sourceCode)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        ArticleSourceDTO dto = modelMapper.map(articleSource, ArticleSourceDTO.class);

        ResultDTO<ArticleSourceDTO> resultDTO = new ResultDTO<ArticleSourceDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 매체코드 중복 체크
     *
     * @param sourceCode 매체코드
     * @return 중복 여부
     */
    @ApiOperation(value = "매체코드 중복 체크")
    @GetMapping("/{sourceCode}/exists")
    public ResponseEntity<?> duplicateCheckId(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode)
            throws Exception {

        try {
            Boolean duplicated = articleSourceService.isDuplicatedId(sourceCode);

            String message = "";
            if (duplicated) {
                message = msg("tps.common.error.duplicated.id");
            } else {
                message = msg("tps.common.success.duplicated.id");
            }
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(duplicated, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[ARTICLE_SOURCE EXISTENCE CHECK FAILED] sourceCode: {} {}", sourceCode, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[ARTICLE_SOURCE EXISTENCE CHECK FAILED]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    /**
     * 매체 등록
     *
     * @param articleSourceDTO 매체정보
     * @return 등록된 매체정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "매체 등록")
    @PostMapping
    public ResponseEntity<?> postArticleSource(@Valid ArticleSourceDTO articleSourceDTO)
            throws Exception {

        // articleSourceDTO -> ArticleSource 변환
        ArticleSource articleSource = modelMapper.map(articleSourceDTO, ArticleSource.class);

        try {
            // 등록
            ArticleSource returnValue = articleSourceService.insertArticleSource(articleSource);

            // 결과리턴
            String message = messageByLocale.get("tps.common.success.insert");
            ArticleSourceDTO dto = modelMapper.map(returnValue, ArticleSourceDTO.class);
            ResultDTO<ArticleSourceDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT ARTICLE_SOURCE]", e);
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * 매체 수정
     *
     * @param articleSourceDTO 매체정보
     * @return 등록된 매체정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "매체 수정")
    @PostMapping("/{sourceCode}")
    public ResponseEntity<?> putArticleSource(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode, @Valid ArticleSourceDTO articleSourceDTO)
            throws Exception {

        // 존재여부 확인
        articleSourceService
                .findAricleSourceById(sourceCode)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // articleSourceDTO -> ArticleSource 변환
        ArticleSource articleSource = modelMapper.map(articleSourceDTO, ArticleSource.class);

        try {
            // 수정
            ArticleSource returnValue = articleSourceService.updateArticleSource(articleSource);

            // 결과리턴
            String message = messageByLocale.get("tps.common.success.update");
            ArticleSourceDTO dto = modelMapper.map(returnValue, ArticleSourceDTO.class);
            ResultDTO<ArticleSourceDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT ARTICLE_SOURCE]", e);
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

}
