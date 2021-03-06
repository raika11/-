/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.cdnarticle.dto.CdnArticleDTO;
import jmnet.moka.core.tps.mvc.cdnarticle.dto.CdnArticleSearchDTO;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import jmnet.moka.core.tps.mvc.cdnarticle.service.CdnArticleService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: CND기사 API
 *
 * @author ssc
 * @since 2021-01-19
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/cdn-articles")
@Api(tags = {"트래픽분산 API"})
public class CdnArticleRestController extends AbstractCommonController {

    private final CdnArticleService cdnArticleService;
    private final ModelMapper modelMapper;
    private final PurgeHelper purgeHelper;

    public CdnArticleRestController(CdnArticleService cdnArticleService, ModelMapper modelMapper, PurgeHelper purgeHelper) {
        this.cdnArticleService = cdnArticleService;
        this.modelMapper = modelMapper;
        this.purgeHelper = purgeHelper;
    }

    /**
     * CDN기사 목록조회
     *
     * @param search 검색조건
     * @return CDN기사목록
     */
    @ApiOperation(value = "CDN기사 목록조회")
    @GetMapping
    public ResponseEntity<?> getCdnArticleList(@Valid @SearchParam CdnArticleSearchDTO search) {

        // 조회
        Page<CdnArticle> returnValue = cdnArticleService.findAllCdnArticle(search);

        List<CdnArticleDTO> dtoList = modelMapper.map(returnValue.getContent(), CdnArticleDTO.TYPE);

        ResultListDTO<CdnArticleDTO> resultList = new ResultListDTO<CdnArticleDTO>();
        resultList.setList(dtoList);
        resultList.setTotalCnt(returnValue.getTotalElements());

        ResultDTO<ResultListDTO<CdnArticleDTO>> resultDTO = new ResultDTO<ResultListDTO<CdnArticleDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * CDN기사 상세조회
     *
     * @param totalId 기사키
     * @return 기사정보
     * @throws NoDataException 기사없음
     */
    @ApiOperation(value = "CDN기사 상세조회")
    @GetMapping("/{totalId}")
    public ResponseEntity<?> getArticle(@ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") Long totalId)
            throws NoDataException {

        CdnArticle article = cdnArticleService
                .findCdnArticleById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        CdnArticleDTO dto = modelMapper.map(article, CdnArticleDTO.class);

        ResultDTO<CdnArticleDTO> resultDto = new ResultDTO<>(dto);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * CDN기사등록
     *
     * @param articleDto 등록할 기사정보
     * @return 등록된  CDN기사 정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "CDN기사 등록")
    @PostMapping(headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postCdnArticle(@ApiParam("CDN기사 정보") @RequestBody @Valid CdnArticleDTO articleDto)
            throws Exception {

        // 중복검사
        Optional<CdnArticle> existArticle = cdnArticleService.findCdnArticleById(articleDto.getTotalId());
        if (existArticle.isPresent()) {
            List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();
            String message = msg("tps.cdn-article.error.duplicate.totalId");
            invalidList.add(new InvalidDataDTO("totalId", message));
            tpsLogger.fail(ActionType.INSERT, message, true);
            String validMessage = msg("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }

        try {
            CdnArticle article = modelMapper.map(articleDto, CdnArticle.class);
            CdnArticle returnValue = cdnArticleService.saveCdnArticle(article);
            CdnArticleDTO dto = modelMapper.map(returnValue, CdnArticleDTO.class);

            // 퍼지!!!
            purge();

            String message = msg("tps.common.success.insert");
            ResultDTO<CdnArticleDTO> resultDto = new ResultDTO<CdnArticleDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT CDN ARTICLE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT CDN ARTICLE]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * CDN기사 수정
     *
     * @param totalId    기사키
     * @param articleDto 수정할 기사정보
     * @return 수정된 CDN기사정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "CDN기사 수정")
    @PutMapping(value = "/{totalId}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putCdnArticle(
            @ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") @Min(value = 0, message = "{tps.cdn-article.error.min.totalId}") Long totalId,
            @ApiParam("CDN기사정보") @RequestBody @Valid CdnArticleDTO articleDto)
            throws Exception {
        CdnArticle orgArticle = cdnArticleService
                .findCdnArticleById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });
        try {
            CdnArticle article = modelMapper.map(articleDto, CdnArticle.class);
            article.setRegDt(orgArticle.getRegDt());
            article.setRegId(orgArticle.getRegId());

            CdnArticle returnValue = cdnArticleService.saveCdnArticle(article);

            // 퍼지!!!
            purge();

            CdnArticleDTO dto = modelMapper.map(returnValue, CdnArticleDTO.class);

            String message = msg("tps.common.success.update");
            ResultDTO<CdnArticleDTO> resultDto = new ResultDTO<CdnArticleDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CDN ARTICLE]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE CDN ARTICLE]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    /**
     * 캐쉬삭제
     *
     * @param totalId 기사키
     * @return 성공여부
     * @throws Exception 예외
     */
    @ApiOperation(value = "캐쉬삭제")
    @PutMapping("/{totalId}/clear-cache")
    public ResponseEntity<?> putClearCacheCdnArticle(
            @ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") @Min(value = 0, message = "{tps.cdn-article.error.min.totalId}") Long totalId)
            throws Exception {

        cdnArticleService
                .findCdnArticleById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            cdnArticleService.clearCacheCdnArticle(totalId);

            ResultDTO<Boolean> resultDTO = new ResultDTO<>(true, msg("tps.cdn-article.success.cache"));
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DUPLICATE CDN TOTALID] : reservedId {} {}", totalId, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DUPLICATE CDN TOTALID]", e, true);
            throw new Exception(msg("tps.cdn-article.error.cache"));
        }
    }

    /**
     * CDN기사 존재여부
     *
     * @param totalId 기사키
     * @return 존재여부
     * @throws NoDataException 기사없음
     */
    @ApiOperation(value = "CDN기사 존재여부")
    @GetMapping("/{totalId}/exists")
    public ResponseEntity<?> getArticleExists(@ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") Long totalId)
            throws NoDataException {

        Optional<CdnArticle> article = cdnArticleService.findCdnArticleById(totalId);
        boolean exists = article.isPresent() ? true : false;

        String message = "";
        if (exists) {
            message = msg("tps.cdn-article.error.duplicated.totalId");
        }
        ResultDTO<Boolean> resultDto = new ResultDTO<>(exists, message);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    private String purge() {
        List<CdnArticle> useArticleList = cdnArticleService.findUseCdnArticle(MokaConstants.YES);
        String ret = purgeHelper.tmsCdnUpdate(useArticleList);
        return ret;
    }
}
