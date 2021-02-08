package jmnet.moka.core.tps.mvc.bulklog.controller;

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
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogSearchDTO;
import jmnet.moka.core.tps.mvc.bulklog.service.BulkLogService;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkLogVO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkTotalLogVO;
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
 * 벌크 모니터링 API Controller
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bulk.controller
 * ClassName : BulkLogRestController
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 09:54
 */

@RestController
@RequestMapping("/api/bulk")
@Slf4j
@Api(tags = {"벌크 모니터링 API"})
public class BulkLogRestController extends AbstractCommonController {

    private final BulkLogService bulkLogService;


    public BulkLogRestController(BulkLogService bulkLogService) {
        this.bulkLogService = bulkLogService;
    }

    /**
     * 벌크 모니터링 통계 조회
     *
     * @param search 검색조건
     * @return API목록
     */
    @ApiOperation(value = "벌크 모니터링 전체 건수")
    @GetMapping("/stat-total")
    public ResponseEntity<?> getBulkLogStatTotal(@Valid @SearchParam BulkLogSearchDTO search) {

        ResultListDTO<BulkTotalLogVO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<BulkTotalLogVO> returnValue = bulkLogService.findAllBulkLogStat(search);

        // 리턴값 설정
        resultListMessage.setTotalCnt(returnValue.getTotalPages());
        resultListMessage.setList(returnValue.getContent());


        ResultDTO<ResultListDTO<BulkTotalLogVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

}
