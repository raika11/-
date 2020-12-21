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
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceDTO;
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

        // 데이타유효성검사.
        validData(null, articleSourceDTO, ActionType.INSERT);

        ArticleSource articleSource = modelMapper.map(articleSourceDTO, ArticleSource.class);

        try {
            // 등록
            ArticleSource returnValue = articleSourceService.insertArticleSource(articleSource);

            // 결과리턴
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
            // url id와 json의 id가 동일한지 검사
            if (sourceCode != null && !sourceCode.equals(articleSourceDTO.getSourceCode())) {
                String message = msg("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // sourceCode중복검사
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
     * 매체 수정
     *
     * @param articleSourceDTO 매체정보
     * @return 등록된 매체정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "매체 수정")
    @PutMapping("/{sourceCode}")
    public ResponseEntity<?> putArticleSource(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode, @Valid ArticleSourceDTO articleSourceDTO)
            throws Exception {

        // 데이타유효성검사.
        validData(sourceCode, articleSourceDTO, ActionType.UPDATE);

        // 존재여부 확인
        articleSourceService
                .findAricleSourceById(sourceCode)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // articleSourceDTO -> ArticleSource 변환
        ArticleSource articleSource = modelMapper.map(articleSourceDTO, ArticleSource.class);

        try {
            // 수정
            ArticleSource returnValue = articleSourceService.updateArticleSource(articleSource);

            // 결과리턴
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
     * 매핑목록 조회
     *
     * @param sourceCode 매체코드
     * @param search     검색조건
     * @return 매핑목록
     */
    @ApiOperation(value = "매핑 목록조회")
    @GetMapping("/{sourceCode}/codes")
    public ResponseEntity<?> getRcvCodeConvList(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode, @Valid @SearchParam SearchDTO search) {
        // 조회
        Page<RcvCodeConv> returnValue = articleSourceService.findAllRcvCodeConv(sourceCode, search);

        // 리턴값 설정
        ResultListDTO<RcvCodeConvDTO> resultListMessage = new ResultListDTO<>();
        List<RcvCodeConvDTO> dtoList = modelMapper.map(returnValue.getContent(), RcvCodeConvDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<RcvCodeConvDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 매핑코드 상세조회
     *
     * @param sourceCode 매체코드
     * @param seqNo      매핑코드순번
     * @return 매핑코드정보
     * @throws NoDataException
     */
    @ApiOperation(value = "매핑코드 상세조회")
    @GetMapping("/{sourceCode}/codes/{seqNo}")
    public ResponseEntity<?> getRcvCodeConv(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode,
            @ApiParam("매핑순번(필수)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.rcv-code-conv.error.min.seqNo}") Long seqNo)
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
     * 매핑코드 중복 체크
     *
     * @param sourceCode 매체코드
     * @param frCode     CP코드
     * @return 중복 여부
     * @throws Exception
     */
    @ApiOperation(value = "매핑코드 중복 체크")
    @GetMapping("/{sourceCode}/codes/{frCode}/exists")
    public ResponseEntity<?> duplicateCheckFrCodeId(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode,
            @ApiParam("CP 코드(필수)") @PathVariable("frCode")
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
     * 매핑등록
     *
     * @param rcvCodeConvDTO 매핑정보
     * @return 등록된 매핑정보
     * @throws Exception
     */
    @ApiOperation(value = "매핑 등록")
    @PostMapping("/{sourceCode}/codes")
    public ResponseEntity<?> postRcvCodeConv(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode, @Valid RcvCodeConvDTO rcvCodeConvDTO)
            throws Exception {

        // 데이타유효성검사.
        validCodeData((long) 0, rcvCodeConvDTO, ActionType.INSERT);

        // rcvCodeConvDTO -> RcvCodeConv 변환
        RcvCodeConv rcvCodeConv = modelMapper.map(rcvCodeConvDTO, RcvCodeConv.class);

        try {
            // 등록
            RcvCodeConv returnValue = articleSourceService.insertRcvCodeConv(rcvCodeConv);

            // 결과리턴
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
            // url id와 json의 id가 동일한지 검사
            if (seqNo > 0 && !seqNo.equals(rcvCodeConvDTO.getSeqNo())) {
                String message = msg("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // 매체코드 정보 검사
            String sourceCode = rcvCodeConvDTO
                    .getArticleSource()
                    .getSourceCode();
            if (McpString.isEmpty(sourceCode)) {
                String message = messageByLocale.get("tps.article-source.error.notnull.sourceCode");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("sourceCode", message));
            }

            // 매체정보가 올바른지 검사
            if (McpString.isNotEmpty(sourceCode)) {
                Optional<ArticleSource> articleSource = articleSourceService.findAricleSourceById(sourceCode);
                if (!articleSource.isPresent()) {
                    String message = messageByLocale.get("tps..article-source.error.notnull.sourceCode");
                    tpsLogger.fail(actionType, message, true);
                    invalidList.add(new InvalidDataDTO("grpCd", message));
                }
            }

            // frCode중복검사
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
     * 매핑코드 수정
     *
     * @param sourceCode     매체코드
     * @param seqNo          매핑코드 순번
     * @param rcvCodeConvDTO 매핑코드 정보
     * @return 수정된 매핑코드 정보
     * @throws Exception
     */
    @ApiOperation(value = "매핑 수정")
    @PutMapping("/{sourceCode}/codes/{seqNo}")
    public ResponseEntity<?> putRcvCodeConve(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode,
            @ApiParam("매핑순번(필수)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.rcv-code-conv.error.min.seqNo}") Long seqNo,
            @Valid RcvCodeConvDTO rcvCodeConvDTO)
            throws Exception {

        // valid

        // 존재여부 확인
        articleSourceService
                .findRcvCodeConvById(seqNo)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // rcvCodeConvDTO -> RcvCodeConv 변환
        RcvCodeConv rcvCodeConv = modelMapper.map(rcvCodeConvDTO, RcvCodeConv.class);

        try {
            // 수정
            RcvCodeConv returnValue = articleSourceService.updateRcvCodeConv(rcvCodeConv);

            // 결과리턴
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

    @ApiOperation(value = "매핑코드 삭제")
    @DeleteMapping("/{sourceCode}/codes/{seqNo}")
    public ResponseEntity<?> deleteReserved(@ApiParam("매체코드(필수)") @PathVariable("sourceCode")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}") String sourceCode,
            @ApiParam("매핑순번(필수)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.rcv-code-conv.error.min.seqNo}") Long seqNo)
            throws NoDataException, Exception {

        // 데이타 확인
        RcvCodeConv rcvCodeConv = articleSourceService
                .findRcvCodeConvById(seqNo)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // 삭제
            articleSourceService.deleteRcvCodeConv(seqNo);

            // 3. 결과리턴
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
