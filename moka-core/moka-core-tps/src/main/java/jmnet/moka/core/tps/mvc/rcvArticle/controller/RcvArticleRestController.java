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
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleBasic;
import jmnet.moka.core.tps.mvc.rcvArticle.service.RcvArticleService;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleBasicVO;
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

    public RcvArticleRestController(RcvArticleService rcvArticleService) {
        this.rcvArticleService = rcvArticleService;
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

        try {
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
        } catch (Exception e) {
            log.error("[FAIL TO LOAD RCV_ARTICE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD RCV_ARTICE]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    /**
     * 등록기사로 등록
     *
     * @param rid       수신기사키
     * @param updateDto 수정할 정보(기자목록,분류코드목록,태그목록)
     * @return 수신기사정보
     * @throws Exception
     */
    @ApiOperation(value = "등록기사로 등록")
    @PostMapping(value = "/articles/{rid}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postArticle(@ApiParam(value = "수신기사아이디(필수)", required = true) @PathVariable("rid") Long rid,
            @ApiParam("수정할 정보(기자목록,분류코드목록,태그목록)") @RequestBody @Valid RcvArticleBasicUpdateDTO updateDto)
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
            // 등록기사로 등록
            boolean insertOk = rcvArticleService.insertRcvArticleIud(rcvArticleBasic, updateDto);

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
            log.error("[FAIL TO RCV_ARTICE_IUD INSERT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO RCV_ARTICE_IUD INSERT]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * 등록기사로 등록(부가정보 수정없음)
     *
     * @param rid 수신기사키
     * @return 수신기사정보
     * @throws Exception
     */
    @ApiOperation(value = "등록기사로 등록(부가정보 수정없음)")
    @PostMapping("/articles/{rid}/with-rid")
    public ResponseEntity<?> postArticleWithRid(@ApiParam("수신기사아이디(필수)") @PathVariable("rid") Long rid)
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
            // 등록기사로 등록
            boolean insertOk = rcvArticleService.insertRcvArticleIud(rcvArticleBasic);

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
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }
}
