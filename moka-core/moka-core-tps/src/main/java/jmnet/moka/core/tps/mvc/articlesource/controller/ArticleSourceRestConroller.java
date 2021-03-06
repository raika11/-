/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.code.ArticleSourceUseTypeCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceDTO;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceSearchDTO;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceSimpleDTO;
import jmnet.moka.core.tps.mvc.articlesource.dto.RcvCodeConvDTO;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.articlesource.entity.RcvCodeConv;
import jmnet.moka.core.tps.mvc.articlesource.service.ArticleSourceService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: ??????
 *
 * @author ssc
 * @since 2020-12-18
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/article-sources")
@Api(tags = {"???????????? API"})
public class ArticleSourceRestConroller extends AbstractCommonController {

    @Autowired
    private ArticleSourceService articleSourceService;

    @Value("${desking.article.source}")
    private String[] deskingSourceList;

    /**
     * ????????? ???????????? ?????? ????????????(??????????????????)
     *
     * @return ????????????
     */
    @ApiOperation(value = "????????? ???????????? ?????? ????????????")
    @GetMapping("/desking")
    public ResponseEntity<?> getDeskingArticleSourceList() {
        // ??????
        List<ArticleSource> returnValue = articleSourceService.findAllArticleSourceByDesking(deskingSourceList);

        // ????????? ??????
        ResultListDTO<ArticleSourceSimpleDTO> resultListMessage = new ResultListDTO<>();
        List<ArticleSourceSimpleDTO> dtoList = modelMapper.map(returnValue, ArticleSourceSimpleDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticleSourceSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ????????? ???????????? ??????
     *
     * @return ????????????
     * @throws Exception ??????
     */
    @ApiOperation(value = "????????? ???????????? ??????")
    @GetMapping("/types/{useTypeCode}")
    public ResponseEntity<?> getTypeArticleSourceList(@ApiParam("????????????(??????)") @PathVariable("useTypeCode")
    @NotNull(message = "{tps.article-source.error.notnull.useTypeCode}") String useTypeCode)
            throws Exception {

        try {
            // ??????
            List<ArticleSource> returnValue = articleSourceService.findAllUsedArticleSource(ArticleSourceUseTypeCode.get(useTypeCode));

            // ????????? ??????
            List<ArticleSourceSimpleDTO> dtoList = modelMapper.map(returnValue, ArticleSourceSimpleDTO.TYPE);
            ResultListDTO<ArticleSourceSimpleDTO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setTotalCnt(dtoList.size());
            resultListMessage.setList(dtoList);

            ResultDTO<ResultListDTO<ArticleSourceSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD TYPE ARTICLE SOURCE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD TYPE ARTICLE SOURCE", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    /**
     * ?????? ????????????
     *
     * @param search ????????????
     * @return ????????????
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping
    public ResponseEntity<?> getArticleSourceList(@Valid @SearchParam ArticleSourceSearchDTO search) {
        // ??????
        Page<ArticleSource> returnValue = articleSourceService.findAllArticleSource(search);

        // ????????? ??????
        ResultListDTO<ArticleSourceDTO> resultListMessage = new ResultListDTO<>();
        List<ArticleSourceDTO> dtoList = modelMapper.map(returnValue.getContent(), ArticleSourceDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticleSourceDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ????????????
     *
     * @param sourceCode ????????????(??????)
     * @return ????????????
     * @throws NoDataException ?????????????????????
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/{sourceCode}")
    public ResponseEntity<?> getArticleSource(@ApiParam("????????????(??????)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode)
            throws NoDataException {
        ArticleSource articleSource = articleSourceService
                .findAricleSourceById(sourceCode)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        ArticleSourceDTO dto = modelMapper.map(articleSource, ArticleSourceDTO.class);

        ResultDTO<ArticleSourceDTO> resultDTO = new ResultDTO<ArticleSourceDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ???????????? ?????? ??????
     *
     * @param sourceCode ????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "???????????? ?????? ??????")
    @GetMapping("/{sourceCode}/exists")
    public ResponseEntity<?> duplicateCheckId(@ApiParam("????????????(??????)") @PathVariable("sourceCode")
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
     * ?????? ??????
     *
     * @param articleSourceDTO ????????????
     * @return ????????? ????????????
     * @throws Exception ??????
     */
    @ApiOperation(value = "?????? ??????")
    @PostMapping
    public ResponseEntity<?> postArticleSource(@Valid ArticleSourceDTO articleSourceDTO)
            throws Exception {

        // ????????????????????????.
        validData(null, articleSourceDTO, ActionType.INSERT);

        ArticleSource articleSource = modelMapper.map(articleSourceDTO, ArticleSource.class);

        try {
            // ??????
            ArticleSource returnValue = articleSourceService.insertArticleSource(articleSource);

            // ????????????
            String message = msg("tps.common.success.insert");
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

    private void validData(String sourceCode, ArticleSourceDTO articleSourceDTO, ActionType actionType)
            throws InvalidDataException {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (articleSourceDTO != null) {
            // url id??? json??? id??? ???????????? ??????
            if (sourceCode != null && !sourceCode.equals(articleSourceDTO.getSourceCode())) {
                String message = msg("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // sourceCode????????????
            int count = articleSourceService.countArticleSourceBySourceCode(sourceCode);
            if ((sourceCode == null && count > 0) || sourceCode != null && count > 1) {
                String message = msg("tps.article-source.error.invalid.dupSourceCode");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("sourceCode", message));
            }

        }

        if (invalidList.size() > 0) {
            String validMessage = msg("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * ?????? ??????
     *
     * @param articleSourceDTO ????????????
     * @return ????????? ????????????
     * @throws Exception ??????
     */
    @ApiOperation(value = "?????? ??????")
    @PutMapping("/{sourceCode}")
    public ResponseEntity<?> putArticleSource(@ApiParam("????????????(??????)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode, @Valid ArticleSourceDTO articleSourceDTO)
            throws Exception {

        // ????????????????????????.
        validData(sourceCode, articleSourceDTO, ActionType.UPDATE);

        // ???????????? ??????
        articleSourceService
                .findAricleSourceById(sourceCode)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // articleSourceDTO -> ArticleSource ??????
        ArticleSource articleSource = modelMapper.map(articleSourceDTO, ArticleSource.class);

        try {
            // ??????
            ArticleSource returnValue = articleSourceService.updateArticleSource(articleSource);

            // ????????????
            String message = msg("tps.common.success.update");
            ArticleSourceDTO dto = modelMapper.map(returnValue, ArticleSourceDTO.class);
            ResultDTO<ArticleSourceDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE ARTICLE_SOURCE]", e);
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    /**
     * ???????????? ??????
     *
     * @param sourceCode ????????????
     * @param search     ????????????
     * @return ????????????
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/{sourceCode}/codes")
    public ResponseEntity<?> getRcvCodeConvList(@ApiParam("????????????(??????)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode, @Valid @SearchParam SearchDTO search) {
        // ??????
        Page<RcvCodeConv> returnValue = articleSourceService.findAllRcvCodeConv(sourceCode, search);

        // ????????? ??????
        ResultListDTO<RcvCodeConvDTO> resultListMessage = new ResultListDTO<>();
        List<RcvCodeConvDTO> dtoList = modelMapper.map(returnValue.getContent(), RcvCodeConvDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<RcvCodeConvDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ????????????
     *
     * @param sourceCode ????????????
     * @param seqNo      ??????????????????
     * @return ??????????????????
     * @throws NoDataException
     */
    @ApiOperation(value = "???????????? ????????????")
    @GetMapping("/{sourceCode}/codes/{seqNo}")
    public ResponseEntity<?> getRcvCodeConv(@ApiParam("????????????(??????)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode,
            @ApiParam("????????????(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.rcv-code-conv.error.min.seqNo}") Long seqNo)
            throws NoDataException {
        RcvCodeConv rcvCodeConv = articleSourceService
                .findRcvCodeConvById(seqNo)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        RcvCodeConvDTO dto = modelMapper.map(rcvCodeConv, RcvCodeConvDTO.class);

        ResultDTO<RcvCodeConvDTO> resultDTO = new ResultDTO<RcvCodeConvDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ???????????? ?????? ??????
     *
     * @param sourceCode ????????????
     * @param frCode     CP??????
     * @return ?????? ??????
     * @throws Exception
     */
    @ApiOperation(value = "???????????? ?????? ??????")
    @GetMapping("/{sourceCode}/codes/{frCode}/exists")
    public ResponseEntity<?> duplicateCheckFrCodeId(@ApiParam("????????????(??????)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode,
            @ApiParam("CP ??????(??????)") @PathVariable("frCode")
            @Length(min = 1, max = 32, message = "{tps.rcv-code-conv.error.length.frCode}") String frCode)
            throws Exception {
        try {
            Boolean duplicated = articleSourceService.isDuplicatedFrCodeId(sourceCode, frCode);

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
            log.error("[RCV_CODE_CONV EXISTENCE CHECK FAILED] sourceCode: {} {}", sourceCode, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[RCV_CODE_CONV EXISTENCE CHECK FAILED]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    /**
     * ????????????
     *
     * @param rcvCodeConvDTO ????????????
     * @return ????????? ????????????
     * @throws Exception
     */
    @ApiOperation(value = "?????? ??????")
    @PostMapping("/{sourceCode}/codes")
    public ResponseEntity<?> postRcvCodeConv(@ApiParam("????????????(??????)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode, @Valid RcvCodeConvDTO rcvCodeConvDTO)
            throws Exception {

        // ????????????????????????.
        validCodeData((long) 0, rcvCodeConvDTO, ActionType.INSERT);

        // rcvCodeConvDTO -> RcvCodeConv ??????
        RcvCodeConv rcvCodeConv = modelMapper.map(rcvCodeConvDTO, RcvCodeConv.class);

        try {
            // ??????
            RcvCodeConv returnValue = articleSourceService.insertRcvCodeConv(rcvCodeConv);

            // ????????????
            String message = msg("tps.common.success.insert");
            RcvCodeConvDTO dto = modelMapper.map(returnValue, RcvCodeConvDTO.class);
            ResultDTO<RcvCodeConvDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT RCV_CODE_CONV]", e);
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    private void validCodeData(Long seqNo, RcvCodeConvDTO rcvCodeConvDTO, ActionType actionType)
            throws InvalidDataException {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (rcvCodeConvDTO != null) {
            // url id??? json??? id??? ???????????? ??????
            if (seqNo > 0 && !seqNo.equals(rcvCodeConvDTO.getSeqNo())) {
                String message = msg("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // ???????????? ?????? ??????
            String sourceCode = rcvCodeConvDTO
                    .getArticleSource()
                    .getSourceCode();
            if (McpString.isEmpty(sourceCode)) {
                String message = msg("tps.article-source.error.notnull.sourceCode");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("sourceCode", message));
            }

            // ??????????????? ???????????? ??????
            if (McpString.isNotEmpty(sourceCode)) {
                Optional<ArticleSource> articleSource = articleSourceService.findAricleSourceById(sourceCode);
                if (!articleSource.isPresent()) {
                    String message = msg("tps..article-source.error.notnull.sourceCode");
                    tpsLogger.fail(actionType, message, true);
                    invalidList.add(new InvalidDataDTO("grpCd", message));
                }
            }

            // frCode????????????
            int count = articleSourceService.countRcvCodeConvByFrCode(sourceCode, rcvCodeConvDTO.getFrCode());
            if ((seqNo == 0 && count > 0) || seqNo > 0 && count > 1) {
                String message = msg("tps.rcv-code-conv.error.invalid.dupFrCode");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("frCode", message));
            }

        }

        if (invalidList.size() > 0) {
            String validMessage = msg("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * ???????????? ??????
     *
     * @param sourceCode     ????????????
     * @param seqNo          ???????????? ??????
     * @param rcvCodeConvDTO ???????????? ??????
     * @return ????????? ???????????? ??????
     * @throws Exception
     */
    @ApiOperation(value = "?????? ??????")
    @PutMapping("/{sourceCode}/codes/{seqNo}")
    public ResponseEntity<?> putRcvCodeConve(@ApiParam("????????????(??????)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode,
            @ApiParam("????????????(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.rcv-code-conv.error.min.seqNo}") Long seqNo,
            @Valid RcvCodeConvDTO rcvCodeConvDTO)
            throws Exception {

        // valid

        // ???????????? ??????
        articleSourceService
                .findRcvCodeConvById(seqNo)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // rcvCodeConvDTO -> RcvCodeConv ??????
        RcvCodeConv rcvCodeConv = modelMapper.map(rcvCodeConvDTO, RcvCodeConv.class);

        try {
            // ??????
            RcvCodeConv returnValue = articleSourceService.updateRcvCodeConv(rcvCodeConv);

            // ????????????
            String message = msg("tps.common.success.update");
            RcvCodeConvDTO dto = modelMapper.map(returnValue, RcvCodeConvDTO.class);
            ResultDTO<RcvCodeConvDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE RCV_CODE_CONV]", e);
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "???????????? ??????")
    @DeleteMapping("/{sourceCode}/codes/{seqNo}")
    public ResponseEntity<?> deleteReserved(@ApiParam("????????????(??????)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode,
            @ApiParam("????????????(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.rcv-code-conv.error.min.seqNo}") Long seqNo)
            throws NoDataException, Exception {

        // ????????? ??????
        RcvCodeConv rcvCodeConv = articleSourceService
                .findRcvCodeConvById(seqNo)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // ??????
            articleSourceService.deleteRcvCodeConv(seqNo);

            // 3. ????????????
            String message = msg("tps.common.success.delete");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE RCV_CODE_CONV] seqNo: {} {}", seqNo, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE RCV_CODE_CONV]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }
}
