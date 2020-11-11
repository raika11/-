package jmnet.moka.core.tps.mvc.reporter.controller;

import io.swagger.annotations.ApiOperation;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSimpleDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reporter.service.ReporterService;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import java.util.List;

/**
 * <pre>
 * 기자관리
 * 2020. 11. 09. ssc 최초생성
 * RequestMapping 생성 규칙
 * RESTful 방식에 소문자만 허용하고 단어 사이 구분이 필요한 경우 '-' 사용
 * 메소드 생성 규칙
 * 목록 조회 : get{Target}List, HttpMethod = GET
 * 조회 : get{Target}, HttpMethod = GET
 * 수정  : put{Target}, HttpMethod = PUT
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/reporters")
public class ReporterRestController {

    private final ReporterService reporterService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final TpsLogger tpsLogger;

    public ReporterRestController(ReporterService reporterService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger) {
        this.reporterService = reporterService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * 기자관리목록조회
     *
     * @param search 검색조건 : 기자이름
     * @return 기자목록
     */
    @ApiOperation(value = "기자관리 목록 조회")
    @GetMapping
    public ResponseEntity<?> getReporterMgrList(@Valid @SearchParam ReporterSearchDTO search) {

        // 조회(mybatis)
        List<ReporterVO> returnValue = reporterService.findAllReporterMgr(search);

        ResultListDTO<ReporterVO> resultList = new ResultListDTO<ReporterVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<ReporterVO>> resultDTO = new ResultDTO<ResultListDTO<ReporterVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 기자관리 조회
     *
     * @param request  요청
     * @param repSeq 기자일련번호 (필수)
     * @return 기자정보
     * @throws NoDataException 기자 정보가 없음
     */
    @ApiOperation(value = "기자관리 조회")
    @GetMapping("/{repSeq}")
    public ResponseEntity<?> getReportMgr(HttpServletRequest request,
            @PathVariable("repSeq") @Pattern(regexp = "[0-9]{4}$", message = "{reporter.error.pattern.repSeq}") String repSeq)
            throws NoDataException {

        String message = messageByLocale.get("tps.reporter.error.no-data", request);
        Reporter reporter = reporterService.findReporterMgrById(repSeq).orElseThrow(() -> new NoDataException(message));
        ReporterSimpleDTO dto = modelMapper.map(reporter, ReporterSimpleDTO.class);
        tpsLogger.success(ActionType.SELECT, true);
        ResultDTO<ReporterSimpleDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 수정
     *
     * @param request   요청
     * @param repSeq  기자일련번호
     * @param reporterDTO 수정할 기자정보
     * @return 수정된 기자정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "기자정보 수정")
    @PutMapping("/{repSeq}")
    public ResponseEntity<?> putDomain(HttpServletRequest request,
                                       @PathVariable("repSeq")
                                       @Pattern(regexp = "[0-9]{4}$", message = "{tps.reporter.error.pattern.repSeq}") String repSeq,
                                       @Valid ReporterSimpleDTO reporterDTO)
            throws Exception {

        Reporter newReporter = modelMapper.map(reporterDTO, Reporter.class);
        Reporter orgDataset = reporterService.findReporterMgrById(newReporter.getRepSeq())
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.reporter.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });

        try {
            // update
            Reporter returnValue = reporterService.updateReporterMgr(newReporter);

            // 결과리턴
            ReporterSimpleDTO dto = modelMapper.map(returnValue, ReporterSimpleDTO.class);

            // 액션 로그에 성공 로그 출력
            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<ReporterSimpleDTO> resultDto = new ResultDTO<ReporterSimpleDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE REPORTER] seq: {} {}", reporterDTO.getRepSeq(),  e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE DATASET]", e, true);
            throw new Exception(messageByLocale.get("tps.reporter.error.save", request), e);
        }
    }
}
