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
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleBasic;
import jmnet.moka.core.tps.mvc.rcvArticle.service.RcvArticleService;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleBasicVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

        // 수신기사 분류조회
        List<String> codeList = rcvArticleService.findAllRcvArticleCode(rid, rcvArticleBasic
                .getArticleSource()
                .getSourceCode());
        dto.setCodeList(codeList);

        ResultDTO<RcvArticleBasicDTO> resultDto = new ResultDTO<>(dto);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
