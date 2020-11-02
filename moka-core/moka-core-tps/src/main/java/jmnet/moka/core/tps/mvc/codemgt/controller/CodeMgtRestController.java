package jmnet.moka.core.tps.mvc.codemgt.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtGrpDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgtGrp;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
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
public class CodeMgtRestController {

    @Autowired
    private CodeMgtService codeMgtService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private ActionLogger actionLogger;

    /**
     * 그룹 목록조회
     *
     * @param request          요청
     * @param search           검색조건
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 공통코드그룹 목록
     */
    @ApiOperation(value = "그룹 목록조회")
    @GetMapping
    public ResponseEntity<?> getCodeMgtGrpList(HttpServletRequest request, @Valid @SearchParam SearchDTO search, @NotNull Principal principal,
            @RequestAttribute Long processStartTime) {
        // 조회
        Page<CodeMgtGrp> returnValue = codeMgtService.findGrpList(search.getPageable());

        // 리턴값 설정
        ResultListDTO<CodeMgtGrpDTO> resultListMessage = new ResultListDTO<CodeMgtGrpDTO>();
        List<CodeMgtGrpDTO> dtoList = modelMapper.map(returnValue.getContent(), CodeMgtGrpDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<CodeMgtGrpDTO>> resultDto = new ResultDTO<ResultListDTO<CodeMgtGrpDTO>>(resultListMessage);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드 목록조회. 페이징있음.
     *
     * @param request          요청
     * @param grpCd            rmfnq코드
     * @param search           검색조건
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 코드 목록
     * @throws Exception
     * @throws InvalidDataException
     */
    @ApiOperation(value = "코드 목록조회")
    @GetMapping("/{grpCd}/codemgts")
    public ResponseEntity<?> getCodeMgtList(HttpServletRequest request,
            @PathVariable("grpCd") @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.invalid.grpCd2}") String grpCd,
            @Valid @SearchParam CodeMgtSearchDTO search, @NotNull Principal principal, @RequestAttribute Long processStartTime)
            throws InvalidDataException, Exception {
        // 데이타유효성검사.
        validSearchData(request, grpCd, search, principal, processStartTime, ActionType.SELECT);

        // 조회
        Page<CodeMgt> returnValue = codeMgtService.findList(search, search.getPageable());

        // 리턴값 설정
        ResultListDTO<CodeMgtDTO> resultListMessage = new ResultListDTO<CodeMgtDTO>();
        List<CodeMgtDTO> codeDtoList = modelMapper.map(returnValue.getContent(), CodeMgtDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<CodeMgtDTO>> resultDto = new ResultDTO<ResultListDTO<CodeMgtDTO>>(resultListMessage);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 사용중인 코드 목록조회. 페이징없음.
     *
     * @param request          요청
     * @param grpCd            그룹코드
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 코드 목록
     * @throws Exception
     * @throws InvalidDataException
     */
    @ApiOperation(value = "사용중인 코드 목록조회")
    @GetMapping("/{grpCd}/use-codemgts")
    public ResponseEntity<?> getUseCodeMgtList(HttpServletRequest request,
            @PathVariable("grpCd") @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.invalid.grpCd2}") String grpCd,
            @NotNull Principal principal, @RequestAttribute Long processStartTime)
            throws InvalidDataException, Exception {

        // 조회
        List<CodeMgt> returnValue = codeMgtService.findUseList(grpCd);

        // 리턴값 설정
        ResultListDTO<CodeMgtDTO> resultListMessage = new ResultListDTO<CodeMgtDTO>();
        List<CodeMgtDTO> codeDtoList = modelMapper.map(returnValue, CodeMgtDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<CodeMgtDTO>> resultDto = new ResultDTO<ResultListDTO<CodeMgtDTO>>(resultListMessage);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    //    /**
    //     * 그룹 상세조회
    //     *
    //     * @param request          요청
    //     * @param seqNo            그룹SEQ (필수)
    //     * @param principal        로그인사용자 세션
    //     * @param processStartTime 작업시간
    //     * @return 공통코드그룹정보
    //     * @throws NoDataException      공통코드그룹 정보가 없음
    //     * @throws InvalidDataException 공통코드그룹 아이디 형식오류
    //     * @throws Exception            기타예외
    //     */
    //    @ApiOperation(value = "그룹 상세조회")
    //    @GetMapping("/{seqNo}")
    //    public ResponseEntity<?> getCodeMgtGrp(HttpServletRequest request,
    //            @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgtGrp.error.invalid.seqNo}") Long seqNo, @NotNull Principal principal,
    //            @RequestAttribute Long processStartTime)
    //            throws NoDataException, InvalidDataException, Exception {
    //
    //        // 데이타유효성검사.
    //        validGrpData(request, seqNo, null, principal, processStartTime, ActionType.SELECT);
    //
    //        String message = messageByLocale.get("tps.codeMgtGrp.error.noContent", request);
    //        CodeMgtGrp codeMgtGrp = codeMgtService.findByGrpSeqNo(seqNo)
    //                                              .orElseThrow(() -> new NoDataException(message));
    //
    //        // 하위코드갯수 조회
    //        Long count = codeMgtService.countCodeMgtByGrpCd(codeMgtGrp.getGrpCd());
    //
    //        CodeMgtGrpDTO dto = modelMapper.map(codeMgtGrp, CodeMgtGrpDTO.class);
    //        dto.setCountCodeMgt(count);
    //
    //        ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto);
    //        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
    //        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    //    }

    /**
     * 그룹 상세조회
     *
     * @param request          요청
     * @param grpCd            그룹코드 (필수)
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 공통코드그룹정보
     * @throws NoDataException      공통코드그룹 정보가 없음
     * @throws InvalidDataException 공통코드그룹 아이디 형식오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "그룹 상세조회")
    @GetMapping("/{grpCd}")
    public ResponseEntity<?> getCodeMgtGrp(HttpServletRequest request,
            @PathVariable("grpCd") @NotNull(message = "{tps.codeMgt.error.invalid.grpCd}") String grpCd, @NotNull Principal principal,
            @RequestAttribute Long processStartTime)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        //        validGrpData(request, seqNo, null, principal, processStartTime, ActionType.SELECT);

        String message = messageByLocale.get("tps.codeMgtGrp.error.noContent", request);
        CodeMgtGrp codeMgtGrp = codeMgtService.findByGrpCd(grpCd)
                                              .orElseThrow(() -> new NoDataException(message));

        // 하위코드갯수 조회
        Long count = codeMgtService.countCodeMgtByGrpCd(codeMgtGrp.getGrpCd());

        CodeMgtGrpDTO dto = modelMapper.map(codeMgtGrp, CodeMgtGrpDTO.class);
        dto.setCountCodeMgt(count);

        ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹정보 유효성 검사
     *
     * @param request          요청
     * @param seqNo            공통코드그룹아이디. 0이면 등록일때 유효성 검사
     * @param codeMgtGrpDTO    공통코드그룹정보
     * @param principal        작업자
     * @param processStartTime 작업시간
     * @param actionType       작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception            기타예외
     */
    private void validGrpData(HttpServletRequest request, Long seqNo, CodeMgtGrpDTO codeMgtGrpDTO, Principal principal, Long processStartTime,
            ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtGrpDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (seqNo > 0 && !seqNo.equals(codeMgtGrpDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.no-data", request);
                actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // grpCd중복검사
            Long countGrpCd = codeMgtService.countCodeMgtGrpByGrpCd(codeMgtGrpDTO.getGrpCd());
            if ((seqNo == 0 && countGrpCd > 0) || seqNo > 0 && countGrpCd > 1) {
                String message = messageByLocale.get("tps.codeMgtGrp.error.invalid.dupGrpCd", request);
                actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.codeMgtGrp.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 검색정보 유효성 검사
     *
     * @param request          요청
     * @param grpCd            공통코드그룹아이디
     * @param codeMgtSearchDTO 검색정보
     * @param principal        작업자
     * @param processStartTime 작업시간
     * @param actionType       작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception            기타예외
     */
    private void validSearchData(HttpServletRequest request, String grpCd, CodeMgtSearchDTO codeMgtSearchDTO, Principal principal,
            Long processStartTime, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtSearchDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (!grpCd.equals(codeMgtSearchDTO.getGrpCd())) {
                String message = messageByLocale.get("tps.common.error.no-data", request);
                actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.codeMgtGrp.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 그룹등록
     *
     * @param request          요청
     * @param codeMgtGrpDTO    등록할 코드그룹정보
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 등록된 예약어정보
     * @throws Exception
     */
    @ApiOperation(value = "그룹등록")
    @PostMapping
    public ResponseEntity<?> postCodeMgtGrp(HttpServletRequest request, @Valid CodeMgtGrpDTO codeMgtGrpDTO, @NotNull Principal principal,
            @RequestAttribute Long processStartTime)
            throws Exception {

        // 데이타유효성검사.
        validGrpData(request, (long) 0, codeMgtGrpDTO, principal, processStartTime, ActionType.INSERT);

        CodeMgtGrp codeMgtGrp = modelMapper.map(codeMgtGrpDTO, CodeMgtGrp.class);

        try {
            // 등록
            CodeMgtGrp returnValue = codeMgtService.insertCodeMgtGrp(codeMgtGrp);

            // 결과리턴
            CodeMgtGrpDTO dto = modelMapper.map(returnValue, CodeMgtGrpDTO.class);
            ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto);

            actionLogger.success(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT CODE_MGT_GRP]", e);
            actionLogger.error(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.codeMgtGrp.error.save", request), e);
        }
    }

    /**
     * 그룹수정
     *
     * @param request          요청
     * @param seqNo            그룹순번
     * @param codeMgtGrpDTO    수정할 그룹정보
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 수정된 그룹정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "그룹 수정")
    @PutMapping("/{seqNo}")
    public ResponseEntity<?> putCodeMgtGrp(HttpServletRequest request,
            @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgtGrp.error.invalid.seqNo}") Long seqNo, @Valid CodeMgtGrpDTO codeMgtGrpDTO,
            @NotNull Principal principal, @RequestAttribute Long processStartTime)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validGrpData(request, seqNo, codeMgtGrpDTO, principal, processStartTime, ActionType.UPDATE);

        String infoMessage = messageByLocale.get("tps.codeMgtGrp.error.noContent", request);
        CodeMgtGrp newCodeMgtGrp = modelMapper.map(codeMgtGrpDTO, CodeMgtGrp.class);
        CodeMgtGrp orgCodeMgtGrp = codeMgtService.findByGrpSeqNo(seqNo)
                                                 .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            // 수정
            CodeMgtGrp returnValue = codeMgtService.updateCodeMgtGrp(newCodeMgtGrp);

            // 결과리턴
            CodeMgtGrpDTO dto = modelMapper.map(returnValue, CodeMgtGrpDTO.class);
            ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto);

            actionLogger.success(principal.getName(), ActionType.UPDATE, System.currentTimeMillis() - processStartTime);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CODE_MGT_GRP]", e);
            actionLogger.error(principal.getName(), ActionType.UPDATE, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.codeMgtGrp.error.save", request), e);
        }
    }

    /**
     * 그룹삭제
     *
     * @param request          요청
     * @param seqNo            삭제 할 그룹순번 (필수)
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 삭제성공여부
     * @throws NoDataException 예약어정보 없음 오류
     * @throws Exception       기타예외
     */
    @ApiOperation(value = "그룹 삭제")
    @DeleteMapping("/{seqNo}")
    public ResponseEntity<?> deleteCodeMgtGrp(HttpServletRequest request,
            @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgtGrp.error.invalid.seqNo}") Long seqNo, @NotNull Principal principal,
            @RequestAttribute Long processStartTime)
            throws NoDataException, Exception {
        // 1. 데이타 존재여부 검사
        String noContentMessage = messageByLocale.get("tps.codeMgtGrp.error.noContent", request);
        CodeMgtGrp codeMgtGrp = codeMgtService.findByGrpSeqNo(seqNo)
                                              .orElseThrow(() -> new NoDataException(noContentMessage));

        // 2. 삭제
        try {
            codeMgtService.deleteCodeMgtGrp(codeMgtGrp, principal.getName());

            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
            actionLogger.success(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE CODE_MGT_GRP]", e);
            actionLogger.error(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.codeMgtGrp.error.delete=", request), e);
        }
    }

    /**
     * 코드정보 조회
     *
     * @param request          요청
     * @param seqNo            코드순번 (필수)
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 코드정보
     * @throws NoDataException      코드 정보가 없음
     * @throws InvalidDataException 코드 아이디 형식오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "코드 상세조회")
    @GetMapping("/codemgts/{seqNo}")
    public ResponseEntity<?> getCodeMgt(HttpServletRequest request,
            @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgt.error.invalid.seqNo}") Long seqNo, @NotNull Principal principal,
            @RequestAttribute Long processStartTime)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, seqNo, null, principal, processStartTime, ActionType.SELECT);

        String message = messageByLocale.get("tps.codeMgt.error.noContent", request);
        CodeMgt codeMgt = codeMgtService.findBySeqNo(seqNo)
                                        .orElseThrow(() -> new NoDataException(message));

        CodeMgtDTO dto = modelMapper.map(codeMgt, CodeMgtDTO.class);
        ResultDTO<CodeMgtDTO> resultDto = new ResultDTO<CodeMgtDTO>(dto);

        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드정보 유효성 검사
     *
     * @param request          요청
     * @param seqNo            코드 순번. 0이면 등록일때 유효성 검사
     * @param codeMgtDTO       코드정보
     * @param principal        작업자
     * @param processStartTime 작업시간
     * @param actionType       작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception            기타예외
     */
    private void validData(HttpServletRequest request, Long seqNo, CodeMgtDTO codeMgtDTO, Principal principal, Long processStartTime,
            ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (seqNo > 0 && !seqNo.equals(codeMgtDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.no-data", request);
                actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // 그룹의 grpSeqNo정보 검사
            Long grpSeqNo = codeMgtDTO.getCodeMgtGrp()
                                      .getSeqNo();
            if (grpSeqNo == null || grpSeqNo < 0) {
                String message = messageByLocale.get("tps.codeMgt.error.invalid.grpCd", request);
                actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

            // 그룹아이디 정보 검사
            String grpCd = codeMgtDTO.getCodeMgtGrp()
                                     .getGrpCd();
            if (McpString.isEmpty(grpCd)) {
                String message = messageByLocale.get("tps.codeMgt.error.invalid.grpCd", request);
                actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

            // 그룹정보가 올바른지 검사
            if (McpString.isNotEmpty(grpCd) && grpSeqNo > 0) {
                Optional<CodeMgtGrp> codeMgtGrp = codeMgtService.findByGrpSeqNo(grpSeqNo);
                if (!codeMgtGrp.isPresent()) {
                    String message = messageByLocale.get("tps.codeMgt.error.invalid.grpCd", request);
                    actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                    invalidList.add(new InvalidDataDTO("grpCd", message));
                } else {
                    if (!codeMgtGrp.get()
                                   .getGrpCd()
                                   .equals(grpCd)) {
                        String message = messageByLocale.get("tps.codeMgt.error.invalid.matchGrpCd", request);
                        actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                        invalidList.add(new InvalidDataDTO("grpCd", message));
                    }
                }
            }

            // dtlCd중복검사
            Long countDtls = codeMgtService.countCodeMgtByDtlCd(grpCd, codeMgtDTO.getDtlCd());
            if ((seqNo == 0 && countDtls > 0) || seqNo > 0 && countDtls > 1) {
                String message = messageByLocale.get("tps.codeMgt.error.invalid.dupDtlCd", request);
                actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                invalidList.add(new InvalidDataDTO("dtlCd", message));
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.codeMgt.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 코드등록
     *
     * @param request          요청
     * @param codeMgtDTO       등록할 코드정보
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 등록된 코드정보
     * @throws Exception
     */
    @ApiOperation(value = "코드등록")
    @PostMapping("/codemgts")
    public ResponseEntity<?> postCodeMgt(HttpServletRequest request, @Valid CodeMgtDTO codeMgtDTO, @NotNull Principal principal,
            @RequestAttribute Long processStartTime)
            throws Exception {

        // 데이타유효성검사.
        validData(request, (long) 0, codeMgtDTO, principal, processStartTime, ActionType.INSERT);

        // 등록
        CodeMgt codeMgt = modelMapper.map(codeMgtDTO, CodeMgt.class);
        try {
            CodeMgt returnValue = codeMgtService.insertCodeMgt(codeMgt);

            // 결과리턴
            CodeMgtDTO dto = modelMapper.map(returnValue, CodeMgtDTO.class);
            ResultDTO<CodeMgtDTO> resultDto = new ResultDTO<CodeMgtDTO>(dto);

            actionLogger.success(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT CODE_MGT]", e);
            actionLogger.error(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.codeMgt.error.save", request), e);
        }
    }

    /**
     * 코드수정
     *
     * @param request          요청
     * @param seqNo            코드순
     * @param codeMgtDTO       수정할 코드정보
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 수정된 코드정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "코드수정")
    @PutMapping("/codemgts/{seqNo}")
    public ResponseEntity<?> putCodeMgt(HttpServletRequest request,
            @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgt.error.invalid.seqNo}") Long seqNo, @Valid CodeMgtDTO codeMgtDTO,
            @NotNull Principal principal, @RequestAttribute Long processStartTime)
            throws InvalidDataException, NoDataException, Exception {
        // 데이타유효성검사.
        validData(request, seqNo, codeMgtDTO, principal, processStartTime, ActionType.UPDATE);

        // 수정
        String infoMessage = messageByLocale.get("tps.codeMgt.error.noContent", request);
        CodeMgt newCodeMgt = modelMapper.map(codeMgtDTO, CodeMgt.class);
        CodeMgt orgCodeMgt = codeMgtService.findBySeqNo(seqNo)
                                           .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            CodeMgt returnValue = codeMgtService.updateCodeMgt(newCodeMgt);

            // 결과리턴
            CodeMgtDTO dto = modelMapper.map(returnValue, CodeMgtDTO.class);

            ResultDTO<CodeMgtDTO> resultDto = new ResultDTO<CodeMgtDTO>(dto);
            actionLogger.success(principal.getName(), ActionType.UPDATE, System.currentTimeMillis() - processStartTime);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CODE_MGT]", e);
            actionLogger.error(principal.getName(), ActionType.UPDATE, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.codeMgt.error.save", request), e);
        }

    }


    /**
     * 코드삭제
     *
     * @param request          요청
     * @param seqNo            삭제 할 코드순번 (필수)
     * @param principal        로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      코드정보 없음 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "코드삭제")
    @DeleteMapping("/codemgts/{seqNo}")
    public ResponseEntity<?> deleteCodeMgt(HttpServletRequest request,
            @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgt.error.invalid.seqNo}") Long seqNo, @NotNull Principal principal,
            @RequestAttribute Long processStartTime)
            throws InvalidDataException, NoDataException, Exception {
        // 1. 데이타 존재여부 검사
        String noContentMessage = messageByLocale.get("tps.codeMgt.error.noContent", request);
        CodeMgt codeMgt = codeMgtService.findBySeqNo(seqNo)
                                        .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // 2. 삭제
            codeMgtService.deleteCodeMgt(codeMgt, principal.getName());

            // 3. 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
            actionLogger.success(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DELETE CODE_MGT]", e);
            actionLogger.error(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.codeMgt.error.delete", request), e);
        }
    }

}

