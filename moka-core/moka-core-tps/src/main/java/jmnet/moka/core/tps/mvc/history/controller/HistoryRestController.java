/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.controller;

/**
 * Description: 히스토리
 *
 * @author ssc
 * @since 2020-11-02
 */
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.history.dto.HistDTO;
import jmnet.moka.core.tps.mvc.history.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.history.mapper.HistoryMapper;
import jmnet.moka.core.tps.mvc.history.service.HistoryService;
import jmnet.moka.core.tps.mvc.history.vo.HistSimpleVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Validated
@Slf4j
@RequestMapping("/api/histories")
@Api(tags = {"히스토리 API"})
public class HistoryRestController extends AbstractCommonController {

    private final HistoryService historyService;

    final HistoryMapper historyMapper;

    public HistoryRestController(HistoryService historyService, HistoryMapper historyMapper) {
        this.historyService = historyService;
        this.historyMapper = historyMapper;
    }

    /**
     * 히스토리 목록조회
     *
     * @param search 검색조건
     * @return 히스토리 목록
     */
    @ApiOperation(value = "히스토리 목록조회")
    @GetMapping
    public ResponseEntity<?> getHistoryList(@Valid @SearchParam HistSearchDTO search)
            throws Exception {

        String itemType = search.getSeqType();
        ResultListDTO<HistSimpleVO> resultList = new ResultListDTO<HistSimpleVO>();

        try {
            List<HistSimpleVO> histList = historyMapper.findAll(search);
            resultList.setTotalCnt(search.getTotal());
            resultList.setList(histList);

            ResultDTO<ResultListDTO<HistSimpleVO>> resultDTO = new ResultDTO<ResultListDTO<HistSimpleVO>>(resultList);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO LOAD HISTORY LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD HISTORY LIST]", e, true);
            throw new Exception(messageByLocale.get("tps.history.error.select"), e);
        }
    }

    /**
     * 히스토리 상세조회
     *
     * @param histSeq 순번
     * @return 페이지 히스토리
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "히스토리 상세조회")
    @GetMapping("/{histSeq}")
    public ResponseEntity<?> getHistory(@ApiParam("히스토리 일련번호(필수)") @PathVariable("histSeq") @Min(value = 0, message = "{tps.history.error.min.histseq}") Long histSeq,
            @Valid @SearchParam HistSearchDTO search)
            throws Exception {

        String itemType = search.getSeqType();

        try {
            HistDTO hist = null;

            if (itemType.equals(MokaConstants.ITEM_PAGE)) {
                // 페이지 히스토리 조회
                hist = historyService.findPageHist(histSeq);

            } else if (itemType.equals(MokaConstants.ITEM_ARTICLE_PAGE)) {
                // 스킨 히스토리 조회
                hist = historyService.findArticlePageHist(histSeq);

            } else if (itemType.equals(MokaConstants.ITEM_CONTAINER)) {
                // 컨테이너 히스토리 조회
                hist = historyService.findContainerHist(histSeq);

            } else if (itemType.equals(MokaConstants.ITEM_TEMPLATE)) {
                // 템플릿 히스토리 조회
                hist = historyService.findTemplateHist(histSeq);
            }

            ResultDTO<HistDTO> resultDTO = new ResultDTO<HistDTO>(hist);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (NoDataException e) {
            String message = messageByLocale.get("tps.common.error.no-data");
            tpsLogger.fail(ActionType.SELECT, message, true);
            throw new NoDataException(message);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD HISTORY]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD HISTORY]", e, true);
            throw new Exception(messageByLocale.get("tps.history.error.histseq.select"), e);
        }
    }
}
