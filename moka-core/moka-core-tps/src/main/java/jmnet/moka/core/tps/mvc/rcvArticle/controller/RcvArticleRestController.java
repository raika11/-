/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.KeywordHelper;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleBasic;
import jmnet.moka.core.tps.mvc.rcvArticle.service.RcvArticleService;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleBasicVO;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: 수신기사 API
 *
 * @author ssc
 * @since 2020-12-22
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/rcv-articles")
@Api(tags = {"수신기사 API"})
public class RcvArticleRestController extends AbstractCommonController {

    private final RcvArticleService rcvArticleService;

    private final KeywordHelper keywordHelper;

    public RcvArticleRestController(RcvArticleService rcvArticleService, KeywordHelper keywordHelper) {
        this.rcvArticleService = rcvArticleService;
        this.keywordHelper = keywordHelper;
    }

    /**
     * 서비스 기사목록조회
     *
     * @param search 검색조건
     * @return 서비스 기사목록
     */
    @ApiOperation(value = "수신기사 목록조회")
    @GetMapping
    public ResponseEntity<?> getRcvArticleList(@Valid @SearchParam RcvArticleSearchDTO search)
            throws Exception {

        try {
            // 조회(mybatis)
            List<RcvArticleBasicVO> returnValue = rcvArticleService.findAllRcvArticleBasic(search);

            // 리턴값 설정
            ResultListDTO<RcvArticleBasicVO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setTotalCnt(search.getTotal());
            resultListMessage.setList(returnValue);

            ResultDTO<ResultListDTO<RcvArticleBasicVO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD RCV ARTICLE BASIC]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD RCV ARTICLE BASIC]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    /**
     * 수신기사 상세조회(분류코드포함)
     *
     * @param rid 수신기사키(필수)
     * @return 수신기사정보
     * @throws Exception
     */
    @ApiOperation(value = "수신기사 상세조회")
    @GetMapping("/{rid}")
    public ResponseEntity<?> getRcvArticle(@ApiParam("수신기사아이디(필수)") @PathVariable("rid") Long rid)
            throws Exception {

        // 수신기사 상세조회
        RcvArticleBasic rcvArticleBasic = rcvArticleService
                .findRcvArticleBasicById(rid)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });
        RcvArticleBasicDTO dto = modelMapper.map(rcvArticleBasic, RcvArticleBasicDTO.class);

        rcvArticleService.findRcvArticleInfo(dto);

        ResultDTO<RcvArticleBasicDTO> resultDto = new ResultDTO<>(dto);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 수신기사 추천태그 조회
     *
     * @param rid 수신기사키
     * @return 키워드목록
     * @throws Exception
     */
    @ApiOperation(value = "수신기사 추천태그 조회")
    @GetMapping("/{rid}/keywords")
    public ResponseEntity<?> getKeyword(@ApiParam("수신기사아이디(필수)") @PathVariable("rid") Long rid)
            throws Exception {

        // 수신기사 상세조회
        RcvArticleBasic rcvArticleBasic = rcvArticleService
                .findRcvArticleBasicById(rid)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        List<String> keywordList = keywordHelper.getKeywords(rcvArticleBasic.getTitle(), rcvArticleBasic.getSubTitle(), rcvArticleBasic.getContent());

        ResultDTO<List<String>> resultDto = new ResultDTO<>(keywordList);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 등록기사로 등록
     *
     * @param rid           수신기사키
     * @param pCodeList     분류목록(마스터코드)
     * @param pReporterList 기자목록
     * @param pKeywordList  태그목록
     * @return 수신기사정보
     * @throws Exception
     */
    @ApiOperation(value = "등록기사로 등록")
    @PostMapping(value = "/articles/{rid}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postArticle(@ApiParam("수신기사아이디(필수)") @PathVariable("rid") Long rid,
            @ApiParam("분류코드(마스터코드) 목록") @RequestBody @Valid ValidList<String> pCategoryList,
            @ApiParam("기자 목록") @RequestBody @Valid ValidList<RcvArticleReporterVO> pReporterList,
            @ApiParam("태그 목록") @RequestBody @Valid ValidList<String> pTagList)
            throws Exception {

        // 수신기사 상세조회
        RcvArticleBasic rcvArticleBasic = rcvArticleService
                .findRcvArticleBasicById(rid)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            List<String> categoryList = pCategoryList.getList();
            List<RcvArticleReporterVO> reporterList = pReporterList.getList();
            List<String> tagList = pTagList.getList();

            // 등록기사로 등록
            boolean insertOk = rcvArticleService.insertRcvArticleIud(rcvArticleBasic, reporterList, categoryList, tagList);

            String message = "";
            if (insertOk) {
                message = msg("tps.common.success.insert");
            } else {
                message = msg("tps.common.error.insert");
            }

            // 수신기사정보 조회
            RcvArticleBasicDTO dto = modelMapper.map(rcvArticleBasic, RcvArticleBasicDTO.class);
            rcvArticleService.findRcvArticleInfo(dto);

            ResultDTO<RcvArticleBasicDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO ARTICE_BASIC INSERT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO ARTICE_BASIC INSERT]", e, true);
            throw new Exception(msg("tps.rcv-articles.error.to-article.insert"), e);
        }
    }
}
