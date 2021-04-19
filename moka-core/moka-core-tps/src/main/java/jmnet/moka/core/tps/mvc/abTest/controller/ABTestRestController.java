package jmnet.moka.core.tps.mvc.abTest.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.abTest.dto.ABTestCaseSaveDTO;
import jmnet.moka.core.tps.mvc.abTest.dto.ABTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abTest.service.ABTestCaseService;
import jmnet.moka.core.tps.mvc.abTest.vo.ABTestCaseVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * ABTest API Controller
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abTest.controller
 * ClassName : ABTestRestController
 * Created : 2021-04-15
 * </pre>
 *
 * @author ince
 * @since 2021-04-15 09:54
 */

@RestController
@RequestMapping("/api/ABTest")
@Slf4j
@Api(tags = {"ABTest API"})
public class ABTestRestController extends AbstractCommonController {

    private final ABTestCaseService abTestCaseService;

    public ABTestRestController(ABTestCaseService abTestCaseService) {
        this.abTestCaseService = abTestCaseService;
    }

    /**
     * ABTest 목록 조회
     *
     * @param search 검색조건
     * @return API목록
     */
    @ApiOperation(value = "ABTest 목록 조회")
    @GetMapping
    public ResponseEntity<?> getBulkLogStatList(@Valid @SearchParam ABTestCaseSearchDTO search) {

        ResultListDTO<ABTestCaseVO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<ABTestCaseVO> returnValue = abTestCaseService.findAllList(search);

        // 리턴값 설정
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(returnValue.getContent());


        ResultDTO<ResultListDTO<ABTestCaseVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ABTest 상세 정보 조회
     *
     * @param abTestSeq ABTest일련번호 (필수)
     * @return ABTest정보
     * @throws NoDataException ABTest 정보가 없음
     */
    @ApiOperation(value = "ABTest 상세 조회")
    @GetMapping("/{abTestSeq}")
    public ResponseEntity<?> getABTest(@ApiParam("ABTest일련번호(필수)") @PathVariable("abTestSeq")
    @Size(min = 1, max = 4, message = "{tps.abTest.error.notnull.abTestSeq}") Long abTestSeq)
            throws NoDataException {

        ResultListDTO<ABTestCaseVO> resultListMessage = new ResultListDTO<>();

        // 조회
        List<ABTestCaseVO> returnValue = abTestCaseService.findABTestById(abTestSeq);
        resultListMessage.setList(returnValue);

        ResultDTO<ResultListDTO<ABTestCaseVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ABTest 등록
     *
     * @param request           요청
     * @param abTestCaseSaveDTO 등록할 ABTest 정보
     * @return 등록된 게시판정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "ABTest 등록")
    @PostMapping
    public ResponseEntity<?> postABTest(HttpServletRequest request, @Valid ABTestCaseSaveDTO abTestCaseSaveDTO)
            throws InvalidDataException, Exception {
        ABTestCaseVO abTestCaseVO = modelMapper.map(abTestCaseSaveDTO, ABTestCaseVO.class);

        try {

            // insert
            ABTestCaseVO returnValue = abTestCaseService.insertABTestCase(abTestCaseVO);

            // 결과리턴
            ABTestCaseSaveDTO dto = modelMapper.map(returnValue, ABTestCaseSaveDTO.class);
            ResultDTO<ABTestCaseSaveDTO> resultDto = new ResultDTO<>(dto, msg("tps.abTest.success.insert"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT ABTest]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.abTest.error.insert"), e);
        }
    }
}
