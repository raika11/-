package jmnet.moka.core.tps.mvc.codemgt.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDtlDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtGrpDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtGrpSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgtGrp;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
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
 * 공통코드
 * 2020. 1. 8. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:09:06
 */
@RestController
@Slf4j
@RequestMapping("/api/codemgt-grps")
@Api(tags = {"기타코드 API"})
public class CodeMgtRestController extends AbstractCommonController {

    private final CodeMgtService codeMgtService;

    public CodeMgtRestController(CodeMgtService codeMgtService) {
        this.codeMgtService = codeMgtService;
    }

    /**
     * 그룹 목록조회
     *
     * @param search 검색조건
     * @return 공통코드그룹 목록sercret
     */
    @ApiOperation(value = "그룹 목록조회")
    @GetMapping
    public ResponseEntity<?> getCodeMgtGrpList(@Valid @SearchParam CodeMgtGrpSearchDTO search) {
        // 조회
        Page<CodeMgtGrp> returnValue = codeMgtService.findAllCodeMgtGrp(search);

        // 리턴값 설정
        ResultListDTO<CodeMgtGrpDTO> resultListMessage = new ResultListDTO<CodeMgtGrpDTO>();
        List<CodeMgtGrpDTO> dtoList = modelMapper.map(returnValue.getContent(), CodeMgtGrpDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<CodeMgtGrpDTO>> resultDto = new ResultDTO<ResultListDTO<CodeMgtGrpDTO>>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드 목록조회. 페이징있음.
     *
     * @param grpCd  rmfnq코드
     * @param search 검색조건
     * @return 코드 목록
     * @throws Exception
     * @throws InvalidDataException
     */
    @ApiOperation(value = "코드 목록조회")
    @GetMapping("/{grpCd}/codemgts")
    public ResponseEntity<?> getCodeMgtList(@ApiParam("그룹코드(필수)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd,
            @Valid @SearchParam CodeMgtSearchDTO search)
            throws InvalidDataException, Exception {
        // 데이타유효성검사.
        validSearchData(grpCd, search, ActionType.SELECT);

        // 조회
        Page<CodeMgt> returnValue = codeMgtService.findAllCodeMgt(search, search.getPageable());

        // 리턴값 설정
        ResultListDTO<CodeMgtDTO> resultListMessage = new ResultListDTO<CodeMgtDTO>();
        List<CodeMgtDTO> codeDtoList = modelMapper.map(returnValue.getContent(), CodeMgtDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<CodeMgtDTO>> resultDto = new ResultDTO<ResultListDTO<CodeMgtDTO>>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 사용중인 코드 목록조회. 페이징없음.
     *
     * @param grpCd 그룹코드
     * @return 코드 목록
     * @throws Exception
     * @throws InvalidDataException
     */
    @ApiOperation(value = "사용중인 코드 목록조회")
    @GetMapping("/{grpCd}/use-codemgts")
    public ResponseEntity<?> getUseCodeMgtList(@ApiParam("그룹코드(필수)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd) {

        // 조회
        List<CodeMgt> returnValue = codeMgtService.findUseList(grpCd);

        // 리턴값 설정
        ResultListDTO<CodeMgtDTO> resultListMessage = new ResultListDTO<CodeMgtDTO>();
        List<CodeMgtDTO> codeDtoList = modelMapper.map(returnValue, CodeMgtDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<CodeMgtDTO>> resultDto = new ResultDTO<ResultListDTO<CodeMgtDTO>>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹 상세조회
     *
     * @param grpCd 그룹코드 (필수)
     * @return 공통코드그룹정보
     * @throws NoDataException 공통코드그룹 정보가 없음
     * @throws Exception       기타예외
     */
    @ApiOperation(value = "그룹 상세조회")
    @GetMapping("/{grpCd}")
    public ResponseEntity<?> getCodeMgtGrp(
            @ApiParam("그룹코드(필수)") @PathVariable("grpCd") @NotNull(message = "{tps.codeMgt.error.notnul.grpCd}") String grpCd)
            throws NoDataException, Exception {

        // 데이타유효성검사.
        //        validGrpData(request, seqNo, null, principal, processStartTime, ActionType.SELECT);


        CodeMgtGrp codeMgtGrp = codeMgtService
                .findByGrpCd(grpCd)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        // 하위코드갯수 조회
        Long count = codeMgtService.countCodeMgtByGrpCd(codeMgtGrp.getGrpCd());

        CodeMgtGrpDTO dto = modelMapper.map(codeMgtGrp, CodeMgtGrpDTO.class);
        dto.setCountCodeMgt(count);

        ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹정보 유효성 검사
     *
     * @param seqNo         공통코드그룹아이디. 0이면 등록일때 유효성 검사
     * @param codeMgtGrpDTO 공통코드그룹정보
     * @param actionType    작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception            기타예외
     */
    private void validGrpData(Long seqNo, CodeMgtGrpDTO codeMgtGrpDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtGrpDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (seqNo > 0 && !seqNo.equals(codeMgtGrpDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // grpCd중복검사
            int countGrpCd = codeMgtService.countCodeMgtGrpByGrpCd(codeMgtGrpDTO.getGrpCd());
            if ((seqNo == 0 && countGrpCd > 0) || seqNo > 0 && countGrpCd > 1) {
                String message = messageByLocale.get("tps.codeMgtGrp.error.invalid.dupGrpCd");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 검색정보 유효성 검사
     *
     * @param grpCd            공통코드그룹아이디
     * @param codeMgtSearchDTO 검색정보
     * @param actionType       작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception            기타예외
     */
    private void validSearchData(String grpCd, CodeMgtSearchDTO codeMgtSearchDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtSearchDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (!grpCd.equals(codeMgtSearchDTO.getGrpCd())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 그룹등록
     *
     * @param codeMgtGrpDTO 등록할 코드그룹정보
     * @return 등록된 예약어정보
     * @throws Exception
     */
    @ApiOperation(value = "그룹등록")
    @PostMapping
    public ResponseEntity<?> postCodeMgtGrp(@Valid CodeMgtGrpDTO codeMgtGrpDTO)
            throws Exception {

        // 데이타유효성검사.
        validGrpData((long) 0, codeMgtGrpDTO, ActionType.INSERT);

        CodeMgtGrp codeMgtGrp = modelMapper.map(codeMgtGrpDTO, CodeMgtGrp.class);

        try {
            // 등록
            CodeMgtGrp returnValue = codeMgtService.insertCodeMgtGrp(codeMgtGrp);

            // 결과리턴
            CodeMgtGrpDTO dto = modelMapper.map(returnValue, CodeMgtGrpDTO.class);

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT CODE_MGT_GRP]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT CODE_MGT_GRP]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.insert"), e);
        }
    }

    /**
     * 그룹수정
     *
     * @param seqNo         그룹순번
     * @param codeMgtGrpDTO 수정할 그룹정보
     * @return 수정된 그룹정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "그룹 수정")
    @PutMapping("/{seqNo}")
    public ResponseEntity<?> putCodeMgtGrp(
            @ApiParam("그룹코드 일련번호(필수)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgtGrp.error.min.seqNo}") Long seqNo,
            @Valid CodeMgtGrpDTO codeMgtGrpDTO)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validGrpData(seqNo, codeMgtGrpDTO, ActionType.UPDATE);

        CodeMgtGrp newCodeMgtGrp = modelMapper.map(codeMgtGrpDTO, CodeMgtGrp.class);
        CodeMgtGrp orgCodeMgtGrp = codeMgtService
                .findByGrpSeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        try {
            // 수정
            CodeMgtGrp returnValue = codeMgtService.updateCodeMgtGrp(newCodeMgtGrp);

            // 결과리턴
            CodeMgtGrpDTO dto = modelMapper.map(returnValue, CodeMgtGrpDTO.class);

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CODE_MGT_GRP]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE CODE_MGT_GRP]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.update"), e);
        }
    }

    /**
     * 그룹삭제
     *
     * @param seqNo 삭제 할 그룹순번 (필수)
     * @return 삭제성공여부
     * @throws NoDataException 예약어정보 없음 오류
     * @throws Exception       기타예외
     */
    @ApiOperation(value = "그룹 삭제")
    @DeleteMapping("/{seqNo}")
    public ResponseEntity<?> deleteCodeMgtGrp(
            @ApiParam("그룹코드 일련번호(필수)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgtGrp.error.min.seqNo}") Long seqNo)
            throws NoDataException, Exception {
        // 1. 데이타 존재여부 검사
        CodeMgtGrp codeMgtGrp = codeMgtService
                .findByGrpSeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        // 2. 삭제
        try {
            codeMgtService.deleteCodeMgtGrp(codeMgtGrp);

            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE CODE_MGT_GRP] seqNo: {} {}", seqNo, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE CODE_MGT_GRP]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.delete"), e);
        }
    }

    /**
     * 코드정보 조회
     *
     * @param seqNo 코드순번 (필수)
     * @return 코드정보
     * @throws NoDataException      코드 정보가 없음
     * @throws InvalidDataException 코드 아이디 형식오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "코드 상세조회")
    @GetMapping("/codemgts/{seqNo}")
    public ResponseEntity<?> getCodeMgt(
            @ApiParam("그룹코드 일련번호(필수)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}") Long seqNo)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(seqNo, null, ActionType.SELECT);

        CodeMgt codeMgt = codeMgtService
                .findBySeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        CodeMgtDTO dto = modelMapper.map(codeMgt, CodeMgtDTO.class);
        ResultDTO<CodeMgtDTO> resultDto = new ResultDTO<CodeMgtDTO>(dto);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드정보 유효성 검사
     *
     * @param seqNo      코드 순번. 0이면 등록일때 유효성 검사
     * @param codeMgtDTO 코드정보
     * @param actionType 작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception            기타예외
     */
    private void validData(Long seqNo, CodeMgtDTO codeMgtDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (seqNo > 0 && !seqNo.equals(codeMgtDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // 그룹의 grpSeqNo정보 검사
            Long grpSeqNo = codeMgtDTO
                    .getCodeMgtGrp()
                    .getSeqNo();
            if (grpSeqNo == null || grpSeqNo < 0) {
                String message = messageByLocale.get("tps.codeMgtGrp.error.min.seqNo");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

            // 그룹아이디 정보 검사
            String grpCd = codeMgtDTO
                    .getCodeMgtGrp()
                    .getGrpCd();
            if (McpString.isEmpty(grpCd)) {
                String message = messageByLocale.get("tps.codeMgtGrp.error.notnull.grpCd");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

            // 그룹정보가 올바른지 검사
            if (McpString.isNotEmpty(grpCd) && grpSeqNo > 0) {
                Optional<CodeMgtGrp> codeMgtGrp = codeMgtService.findByGrpSeqNo(grpSeqNo);
                if (!codeMgtGrp.isPresent()) {
                    String message = messageByLocale.get("tps.codeMgtGrp.error.notnull.grpCd");
                    tpsLogger.fail(actionType, message, true);
                    invalidList.add(new InvalidDataDTO("grpCd", message));
                } else {
                    if (!codeMgtGrp
                            .get()
                            .getGrpCd()
                            .equals(grpCd)) {
                        String message = messageByLocale.get("tps.codeMgt.error.invalid.matchGrpCd");
                        tpsLogger.fail(actionType, message, true);
                        invalidList.add(new InvalidDataDTO("grpCd", message));
                    }
                }
            }

            // dtlCd중복검사
            int countDtls = codeMgtService.countCodeMgtByDtlCd(grpCd, codeMgtDTO.getDtlCd());
            if ((seqNo == 0 && countDtls > 0) || seqNo > 0 && countDtls > 1) {
                String message = messageByLocale.get("tps.codeMgt.error.invalid.dupDtlCd");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("dtlCd", message));
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 코드등록
     *
     * @param codeMgtDTO 등록할 코드정보
     * @return 등록된 코드정보
     * @throws Exception
     */
    @ApiOperation(value = "코드등록")
    @PostMapping("/codemgts")
    public ResponseEntity<?> postCodeMgt(@Valid CodeMgtDTO codeMgtDTO)
            throws Exception {

        // 데이타유효성검사.
        validData((long) 0, codeMgtDTO, ActionType.INSERT);

        // 등록
        CodeMgt codeMgt = modelMapper.map(codeMgtDTO, CodeMgt.class);
        try {
            CodeMgt returnValue = codeMgtService.insertCodeMgt(codeMgt);

            // 결과리턴
            CodeMgtDTO dto = modelMapper.map(returnValue, CodeMgtDTO.class);

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<CodeMgtDTO> resultDTO = new ResultDTO<CodeMgtDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT CODE_MGT]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT CODE_MGT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.insert"), e);
        }
    }

    /**
     * 코드수정
     *
     * @param seqNo      코드순
     * @param codeMgtDTO 수정할 코드정보
     * @return 수정된 코드정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "코드수정")
    @PutMapping("/codemgts/{seqNo}")
    public ResponseEntity<?> putCodeMgt(
            @ApiParam("상세코드 일련번호(필수)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}") Long seqNo,
            @Valid CodeMgtDTO codeMgtDTO)
            throws InvalidDataException, NoDataException, Exception {
        // 데이타유효성검사.
        validData(seqNo, codeMgtDTO, ActionType.UPDATE);

        // 수정
        CodeMgt newCodeMgt = modelMapper.map(codeMgtDTO, CodeMgt.class);
        CodeMgt orgCodeMgt = codeMgtService
                .findBySeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });

        try {
            CodeMgt returnValue = codeMgtService.updateCodeMgt(newCodeMgt);

            // 결과리턴
            CodeMgtDTO dto = modelMapper.map(returnValue, CodeMgtDTO.class);

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<CodeMgtDTO> resultDTO = new ResultDTO<CodeMgtDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CODE_MGT] seqNo: {} {}", seqNo, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE CODE_MGT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.update"), e);
        }

    }


    /**
     * 코드삭제
     *
     * @param seqNo 삭제 할 코드순번 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      코드정보 없음 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "코드삭제")
    @DeleteMapping("/codemgts/{seqNo}")
    public ResponseEntity<?> deleteCodeMgt(
            @ApiParam("상세코드 일련번호(필수)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}") Long seqNo)
            throws InvalidDataException, NoDataException, Exception {
        // 1. 데이타 존재여부 검사
        CodeMgt codeMgt = codeMgtService
                .findBySeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {
            // 2. 삭제
            codeMgtService.deleteCodeMgt(codeMgt);

            // 3. 결과리턴
            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DELETE CODE_MGT] seqNo: {} {}", seqNo, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE CODE_MGT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.delete"), e);
        }
    }

    /**
     * 코드상세조회
     *
     * @param grpCd 코드순번 (필수)
     * @param dtlCd 상세코드 (필수)
     * @return 코드정보
     * @throws NoDataException      코드 정보가 없음
     * @throws InvalidDataException 코드 아이디 형식오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "코드 목록조회")
    @GetMapping("/{grpCd}/special-char/{dtlCd}")
    public ResponseEntity<?> getSpecialChar(@ApiParam("그룹코드(필수)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd,
            @ApiParam("상세코드(필수)") @PathVariable("dtlCd")
            @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.dtlCd}") String dtlCd)
            throws InvalidDataException, Exception {
        // specialChar
        // 조회
        List<CodeMgt> returnValue = codeMgtService.findByDtlCd(grpCd, dtlCd);
        CodeMgtDtlDTO codeMgtDtlDTO = null;

        for (CodeMgt cc : returnValue) {
            codeMgtDtlDTO = CodeMgtDtlDTO
                    .builder()
                    .grpCd(cc
                            .getCodeMgtGrp()
                            .getGrpCd())
                    .dtlCd(cc.getDtlCd())
                    .cdNm(cc.getCdNm())
                    .build();
            break;
        }
        ResultDTO<CodeMgtDtlDTO> resultDto = new ResultDTO<>(codeMgtDtlDTO);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드상세수정
     *
     * @param grpCd         코드순
     * @param codeMgtDtlDTO 수정할 코드정보
     * @return 수정된 코드정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "코드수정")
    @PutMapping("/{grpCd}/special-char")
    public ResponseEntity<?> putCodeMgtDtl(
            @ApiParam("그룹코드(필수)") @PathVariable("grpCd") @NotNull(message = "{tps.codeMgt.error.notnul.grpCd}") String grpCd,
            @Valid CodeMgtDtlDTO codeMgtDtlDTO)
            throws InvalidDataException, NoDataException, Exception {


        // 수정
        List<CodeMgt> result = codeMgtService.findByDtlCd(grpCd, codeMgtDtlDTO.getDtlCd());

        if (result.size() == 0) {
            String message = messageByLocale.get("tps.common.error.no-data");
            tpsLogger.fail(ActionType.UPDATE, message, true);
            throw new NoDataException(message);
        }

        try {

            // 일련번호 추출
            //CodeMgt result = codeMgtService.findByDtlCd(grpCd, codeMgtDtlDTO.getDtlCd()).get(0);
            codeMgtDtlDTO.setSeqNo(result
                    .get(0)
                    .getSeqNo());
            CodeMgtDtlDTO returnValue = codeMgtService.updateCodeMgtDtl(codeMgtDtlDTO);

            // 결과리턴
            CodeMgtDtlDTO dto = modelMapper.map(returnValue, CodeMgtDtlDTO.class);

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<CodeMgtDtlDTO> resultDTO = new ResultDTO<CodeMgtDtlDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CODE_MGT] seqNo: {} {}", grpCd, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE CODE_MGT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.update"), e);
        }

    }

    /**
     * 동일 그룹아이디 존재 여부
     *
     * @param grpCd 그룹ID
     * @return 중복여부
     */
    @ApiOperation(value = "동일 그룹아이디 존재 여부")
    @GetMapping("/{grpCd}/exists")
    public ResponseEntity<?> duplicateCheckGrpCd(@ApiParam("그룹코드(필수)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd)
            throws Exception {

        try {
            boolean duplicated = codeMgtService.isDuplicatedGrpCd(grpCd);
            String message = "";
            if (duplicated) {
                message = messageByLocale.get("tps.codeMgtGrp.error.duplicate.grpCd");
            }

            ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DUPLICATE GRPCD] : reservedId {} {}", grpCd, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DUPLICATE GRPCD]", e, true);
            throw new Exception(messageByLocale.get("tps.codeMgt.error.duplicate.dtlCd"));
        }
    }

    /**
     * 동일 아이디 존재 여부
     *
     * @param dtlCd 코드ID
     * @return 중복여부
     */
    @ApiOperation(value = "동일 아이디 존재 여부")
    @GetMapping("/{grpCd}/{dtlCd}/exists")
    public ResponseEntity<?> duplicateCheckDtlCd(@ApiParam("그룹코드(필수)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd,
            @ApiParam("상세코드(필수)") @PathVariable("dtlCd")
            @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgt.error.pattern.dtlCd}") String dtlCd)
            throws Exception {

        try {
            boolean duplicated = codeMgtService.isDuplicatedDtlCd(grpCd, dtlCd);
            String message = "";
            if (duplicated) {
                message = messageByLocale.get("tps.codeMgt.error.duplicate.dtlCd");
            }

            ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DUPLICATE DTLCD] : dtlCd {} {}", dtlCd, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DUPLICATE DTLCD]", e, true);
            throw new Exception(messageByLocale.get("tps.codeMgt.error.duplicate.dtlCd"));
        }
    }
}

