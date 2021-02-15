package jmnet.moka.core.tps.mvc.reporter.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSimpleDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reporter.service.ReporterService;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@Api(tags = {"기자 API"})
public class ReporterRestController extends AbstractCommonController {

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
    public ResponseEntity<?> getReporterList(@Valid @SearchParam ReporterSearchDTO search) {

        // 조회(mybatis)
        List<ReporterVO> returnValue = reporterService.findAllReporter(search);

        // 리턴값 설정
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
     * @param request 요청
     * @param repSeq  기자일련번호 (필수)
     * @return 기자정보
     * @throws NoDataException 기자 정보가 없음
     */
    @ApiOperation(value = "기자관리 조회")
    @GetMapping("/{repSeq}")
    public ResponseEntity<?> getReportMgr(HttpServletRequest request, @ApiParam("기자 일련번호") @PathVariable("repSeq")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.reporter.error.pattern.repSeq}") String repSeq)
            throws NoDataException {
        // 조회(mybatis)
        ReporterVO returnValue = reporterService.findBySeq(repSeq);
        ResultDTO<ReporterVO> resultDTO = new ResultDTO<ReporterVO>(returnValue);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 수정
     *
     * @param request           요청
     * @param repSeq            기자일련번호
     * @param reporterSimpleDTO 수정할 기자정보
     * @return 수정된 기자정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "기자정보 수정")
    @PutMapping("/{repSeq}")
    public ResponseEntity<?> putReporter(HttpServletRequest request, @ApiParam("기자 일련번호") @PathVariable("repSeq")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.reporter.error.pattern.repSeq}") String repSeq, @Valid ReporterSimpleDTO reporterSimpleDTO)
            throws Exception {

        // GroupDTO -> Group 변환
        String infoMessage = messageByLocale.get("tps.reporter.error.no-data", request);
        String cd1Nm = reporterSimpleDTO.getR1CdNm();
        String cd2Nm = reporterSimpleDTO.getR2CdNm();
        String cd3Nm = reporterSimpleDTO.getR3CdNm();
        String cd4Nm = reporterSimpleDTO.getR4CdNm();

        Reporter newReporter = modelMapper.map(reporterSimpleDTO, Reporter.class);
        newReporter.setRepSeq(repSeq);

        reporterService
                .findReporterById(newReporter.getRepSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));


        try {
            // update
            Reporter returnValue = reporterService.updateReporter(newReporter);

            // 결과리턴
            ReporterSimpleDTO dto = modelMapper.map(returnValue, ReporterSimpleDTO.class);
            dto.setR1CdNm(cd1Nm);
            dto.setR2CdNm(cd2Nm);
            dto.setR3CdNm(cd3Nm);
            dto.setR4CdNm(cd4Nm);
            ResultDTO<ReporterSimpleDTO> resultDto = new ResultDTO<ReporterSimpleDTO>(dto, msg("tps.common.success.update"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE REPORTER] seq: {} {}", reporterSimpleDTO.getRepSeq(), e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE DATASET]", e, true);
            throw new Exception(messageByLocale.get("tps.reporter.error.save", request), e);
        }
    }
}
