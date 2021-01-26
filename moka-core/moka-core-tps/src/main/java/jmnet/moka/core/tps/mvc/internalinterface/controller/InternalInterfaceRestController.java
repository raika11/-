package jmnet.moka.core.tps.mvc.internalinterface.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.internalinterface.dto.InternalInterfaceDTO;
import jmnet.moka.core.tps.mvc.internalinterface.dto.InternalInterfaceSearchDTO;
import jmnet.moka.core.tps.mvc.internalinterface.entity.InternalInterface;
import jmnet.moka.core.tps.mvc.internalinterface.service.InternalInterfaceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
@RequestMapping("/api/internal-apis")
@Slf4j
@Api(tags = {"API관리 API"})
public class InternalInterfaceRestController extends AbstractCommonController {

    private final InternalInterfaceService internalInterfaceService;

    private final CodeMgtService codeMgtService;

    public InternalInterfaceRestController(InternalInterfaceService internalInterfaceService, CodeMgtService codeMgtService) {
        this.internalInterfaceService = internalInterfaceService;
        this.codeMgtService = codeMgtService;
    }

    /**
     * API목록조회
     *
     * @param search 검색조건
     * @return API목록
     */
    @ApiOperation(value = "API 목록 조회")
    @GetMapping
    public ResponseEntity<?> getInternalInterfaceList(@SearchParam InternalInterfaceSearchDTO search) {

        ResultListDTO<InternalInterfaceDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<InternalInterface> returnValue = internalInterfaceService.findAllInternalInterface(search);

        // 리턴값 설정
        List<InternalInterfaceDTO> internalInterfaceList = modelMapper.map(returnValue.getContent(), InternalInterfaceDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(internalInterfaceList);


        ResultDTO<ResultListDTO<InternalInterfaceDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



    /**
     * API정보 조회
     *
     * @param request 요청
     * @param seqNo   API일련번호 (필수)
     * @return API정보
     * @throws NoDataException API 정보가 없음
     */
    @ApiOperation(value = "API 조회")
    @GetMapping("/{seqNo}")
    public ResponseEntity<?> getInternalInterface(HttpServletRequest request,
            @ApiParam("API 일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.internal-interface.error.min.seqNo}") Long seqNo)
            throws NoDataException {

        String message = msg("tps.common.error.no-data", request);
        InternalInterface internalInterface = internalInterfaceService
                .findInternalInterfaceBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(message));

        // apiType 코드명 얻기
        if (McpString.isNotEmpty(internalInterface.getApiType())) {
            List<CodeMgt> codes = codeMgtService.findByDtlCd(TpsConstants.API_TYPE_CODE, internalInterface.getApiType());

            if (codes != null && codes.size() > 0) {
                internalInterface.setApiTypeName(codes
                        .stream()
                        .findFirst()
                        .get()
                        .getCdNm());
            }
        }

        InternalInterfaceDTO dto = modelMapper.map(internalInterface, InternalInterfaceDTO.class);

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<InternalInterfaceDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * 등록
     *
     * @param request              요청
     * @param internalInterfaceDTO 등록할 API정보
     * @return 등록된 API정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "API 등록")
    @PostMapping
    public ResponseEntity<?> postInternalInterface(HttpServletRequest request, @Valid InternalInterfaceDTO internalInterfaceDTO)
            throws InvalidDataException, Exception {

        try {
            InternalInterface internalInterface = modelMapper.map(internalInterfaceDTO, InternalInterface.class);

            InternalInterface returnValue = internalInterfaceService.insertInternalInterface(internalInterface);

            // 결과리턴
            InternalInterfaceDTO dto = modelMapper.map(returnValue, InternalInterfaceDTO.class);

            ResultDTO<InternalInterfaceDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.insert"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT INTERNAL INTERFACE]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.internal-interface.error.save", request), e);
        }
    }


    /**
     * 수정
     *
     * @param seqNo                API일련번호
     * @param internalInterfaceDTO 수정할 API정보
     * @return 수정된 API정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "API 수정")
    @PutMapping(value = "/{seqNo}")
    public ResponseEntity<?> putInternalInterface(
            @ApiParam("API 일련번호") @PathVariable("seqNo") @Min(value = 1, message = "{tps.internal-interface.error.min.seqNo}") Long seqNo,
            @Valid InternalInterfaceDTO internalInterfaceDTO)
            throws Exception {

        // InternalInterfaceDTO -> InternalInterface 변환
        String infoMessage = msg("tps.common.error.no-data");

        // 오리진 데이터 조회
        internalInterfaceService
                .findInternalInterfaceBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(infoMessage));

        try {

            InternalInterface newInternalInterface = modelMapper.map(internalInterfaceDTO, InternalInterface.class);
            newInternalInterface.setSeqNo(seqNo);

            // update
            InternalInterface returnValue = internalInterfaceService.updateInternalInterface(newInternalInterface);

            // 결과리턴
            InternalInterfaceDTO dto = modelMapper.map(returnValue, InternalInterfaceDTO.class);

            ResultDTO<InternalInterfaceDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.update"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);


            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE INTERNAL INTERFACE]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.internal-interface.error.save"), e);
        }
    }


    /**
     * 삭제
     *
     * @param request 요청
     * @param seqNo   삭제 할 API일련번호 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 API 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "API 삭제")
    @DeleteMapping("/{seqNo}")
    public ResponseEntity<?> deleteInternalInterface(HttpServletRequest request,
            @ApiParam("API 일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.internal-interface.error.min.seqNo}") Long seqNo)
            throws InvalidDataException, NoDataException, Exception {


        // API 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data", request);
        InternalInterface internalInterface = internalInterfaceService
                .findInternalInterfaceBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // 삭제
            internalInterfaceService.deleteInternalInterface(internalInterface);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.common.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE INTERNAL INTERFACE] seqNo: {} {}", seqNo, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.internal-interface.error.delete", request), e);
        }
    }

}
