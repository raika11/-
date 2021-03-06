package jmnet.moka.core.tps.mvc.bulklog.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogSearchDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalIdDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalDTO;
import jmnet.moka.core.tps.mvc.bulklog.service.BulkLogService;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkLogVO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkTotalLogVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/bulkLogs")
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
    public ResponseEntity<?> getBulkLogStatTotal(@Valid @SearchParam BulkLogTotalDTO search) throws Exception {

        ResultListDTO<BulkTotalLogVO> resultListMessage = new ResultListDTO<>();

        try {
            // 조회
            List<BulkTotalLogVO> returnValue = bulkLogService.findAllBulkLogStat(search);

            // 리턴값 설정
            //ResultListDTO<BulkTotalLogVO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setList(returnValue);

            ResultDTO<ResultListDTO<BulkTotalLogVO>> resultDto = new ResultDTO<>(resultListMessage);

            tpsLogger.success(ActionType.SELECT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD BULK LOG]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD BULK LOG]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    /**
     * 벌크 전송 목록 조회
     *
     * @param search 검색조건
     * @return API목록
     */
    @ApiOperation(value = "벌크 전송 목록 조회")
    @GetMapping("/stat-list")
    public ResponseEntity<?> getBulkLogStatList(@Valid @SearchParam BulkLogSearchDTO search) {

        ResultListDTO<BulkLogVO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<BulkLogVO> returnValue = bulkLogService.findAllBulkLogStatList(search);

        // 리턴값 설정
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(returnValue.getContent());


        ResultDTO<ResultListDTO<BulkLogVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 벌크 전송 상세정보 조회
     *
     * @param search 검색조건
     * @return API목록
     */
    @ApiOperation(value = "벌크 전송 상세정보/메세지 조회")
    @GetMapping("/stat-list-info")
    public ResponseEntity<?> getBulkLogStatListByInfo(@Valid @SearchParam BulkLogTotalIdDTO search) {

        ResultListDTO<BulkLogVO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<BulkLogVO> returnValue = bulkLogService.findAllBulkLogStatListByInfo(search);

        // 리턴값 설정
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(returnValue.getContent());


        ResultDTO<ResultListDTO<BulkLogVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
    /**
     * 벌크 전송 상세정보 조회
     *
     * @param search 검색조건
     * @return API목록
     */
    @ApiOperation(value = "벌크 전송 목록/메세지 조회")
    @GetMapping("/stat-list-info-msg")
    public ResponseEntity<?> getBulkLogStatListByInfoMsg(@Valid @SearchParam BulkLogTotalIdDTO search) {

        ResultListDTO<BulkLogVO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<BulkLogVO> returnValue = bulkLogService.findAllBulkLogStatListByInfoMsg(search);

        // 리턴값 설정
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(returnValue.getContent());


        ResultDTO<ResultListDTO<BulkLogVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
