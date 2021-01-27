package jmnet.moka.core.tps.mvc.search.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.models.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.search.dto.SearchKwdLogSearchDTO;
import jmnet.moka.core.tps.mvc.search.service.SearchKwdLogService;
import jmnet.moka.core.tps.mvc.search.vo.SearchKwdLogVO;
import jmnet.moka.core.tps.mvc.search.vo.SearchKwdTotalLogVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * 내부 시스템 API Controller
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.internalinterface.controller
 * ClassName : InternalInterfaceRestController
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 09:54
 */

@RestController
@RequestMapping("/api/search-keywords")
@Slf4j
@Api(tags = {"검색 키워드 API"})
public class SearchKwdLogRestController extends AbstractCommonController {

    private final SearchKwdLogService searchKwdLogService;


    public SearchKwdLogRestController(SearchKwdLogService searchKwdLogService) {
        this.searchKwdLogService = searchKwdLogService;
    }

    /**
     * 키워드 통계 조회
     *
     * @param search 검색조건
     * @return API목록
     */
    @ApiOperation(value = "키워드 전체 건수")
    @GetMapping("/stat-total")
    public ResponseEntity<?> getSearchKwdLogStatTotal(@Valid @SearchParam SearchKwdLogSearchDTO search) {



        SearchKwdTotalLogVO resultMessage = searchKwdLogService.findSearchKwdLogTotalStat(search);

        ResultDTO<SearchKwdTotalLogVO> resultDto = new ResultDTO<>(resultMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 키워드 통계 조회
     *
     * @param search 검색조건
     * @return API목록
     */
    @ApiOperation(value = "키워드 통계 조회")
    @GetMapping("/stat")
    public ResponseEntity<?> getSearchKwdLogStatList(@Valid @SearchParam SearchKwdLogSearchDTO search) {

        ResultListDTO<SearchKwdLogVO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<SearchKwdLogVO> returnValue = searchKwdLogService.findAllSearchKwdLogStat(search);

        // 리턴값 설정
        resultListMessage.setTotalCnt(returnValue.getTotalPages());
        resultListMessage.setList(returnValue.getContent());


        ResultDTO<ResultListDTO<SearchKwdLogVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 키워드 통계 조회
     *
     * @param search 검색조건
     * @return API목록
     */
    @ApiOperation(value = "키워드 통계 상세 조회")
    @GetMapping("/stat-detail")
    public ResponseEntity<?> getSearchKwdLogDetailStatList(@Valid @SearchParam SearchKwdLogSearchDTO search) {

        ResultListDTO<SearchKwdLogVO> resultListMessage = new ResultListDTO<>();

        // 조회
        List<SearchKwdLogVO> returnValue = searchKwdLogService.findAllSearchKwdLogDetailStat(search);

        // 리턴값 설정
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(returnValue);


        ResultDTO<ResultListDTO<SearchKwdLogVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "투표 목록 엑셀 다운로드", response = Response.class)
    @GetMapping(value = "/excel", produces = {"application/vnd.ms-excel"})
    public SearchKwdLogExcelView getExcel(@Valid @SearchParam SearchKwdLogSearchDTO search, @ApiParam(hidden = true) ModelMap map) {

        SearchKwdLogExcelView excelView = new SearchKwdLogExcelView();
        // 최종 페이지
        int totalPages;
        int size = 200;
        // 현재 페이지
        AtomicInteger currentPage = new AtomicInteger(0);


        search.setPage(currentPage.getAndAdd(1));
        Page<SearchKwdLogVO> list = searchKwdLogService.findAllSearchKwdLogStat(search);

        totalPages = list.getTotalPages();

        List<SearchKwdLogVO> resultList = new ArrayList<>();
        if (totalPages > 0) {
            resultList.addAll(list.getContent());
            while (currentPage.get() < totalPages) {
                search.setPage(currentPage.getAndAdd(1));
                list = searchKwdLogService.findAllSearchKwdLogStat(search);
                resultList.addAll(list.getContent());
            }
        }
        String[] columns = new String[] {"순위", "검색어", "전체", "PC", "Mobile"};

        map.addAttribute("title", "검색어통계");
        map.addAttribute("columnList", CollectionUtils.arrayToList(columns));
        map.addAttribute("resultList", resultList);
        excelView.setAttributesMap(map);

        return excelView;
    }



}
