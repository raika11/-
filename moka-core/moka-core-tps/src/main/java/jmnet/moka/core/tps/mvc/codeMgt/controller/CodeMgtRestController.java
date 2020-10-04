package jmnet.moka.core.tps.mvc.codeMgt.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;

import jmnet.moka.core.tps.mvc.codeMgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codeMgt.entity.CodeMgtGrp;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.codeMgt.dto.CodeMgtDTO;
import jmnet.moka.core.tps.mvc.codeMgt.dto.CodeMgtSearchDTO;
import jmnet.moka.core.tps.mvc.codeMgt.dto.CodeMgtGrpDTO;
import jmnet.moka.core.tps.mvc.codeMgt.service.CodeMgtService;

/**
 * <pre>
 * 공통코드
 * 2020. 1. 8. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 1. 8. 오후 2:09:06
 * @author ssc
 */
@RestController
@Slf4j
@RequestMapping("/api/codeMgtGrps")
public class CodeMgtRestController {

    @Autowired
    private CodeMgtService codeMgtService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    /**
     * <pre>
     * 그룹 목록조회
     * </pre>
     * 
     * @param request 요청
     * @param search 검색조건
     * @return 공통코드그룹 목록
     */
    @GetMapping
    public ResponseEntity<?> getCodeMgtGrpList(
            HttpServletRequest request,
            @Valid @SearchParam SearchDTO search)
    {
        // 조회
        Page<CodeMgtGrp> returnValue = codeMgtService.findGrpList(search.getPageable());

        // 리턴값 설정
        ResultListDTO<CodeMgtGrpDTO> resultListMessage = new ResultListDTO<CodeMgtGrpDTO>();
        List<CodeMgtGrpDTO> dtoList =
                modelMapper.map(returnValue.getContent(), CodeMgtGrpDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<CodeMgtGrpDTO>> resultDto =
                new ResultDTO<ResultListDTO<CodeMgtGrpDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * <pre>
     * 코드 목록조회. 페이징있음.
     * </pre>
     * 
     * @param request 요청
     * @param grpCd : 부모 공통코드
     * @param search 검색조건
     * @return 공통코드 목록
     * @throws Exception
     * @throws InvalidDataException
     */
    @GetMapping("/{grpCd}/codeMgts")
    public ResponseEntity<?> getCodeMgtList(
            HttpServletRequest request,
            @PathVariable("grpCd") @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$",
                    message = "{tps.codeMgtGrp.error.invalid.grpCd2}") String grpCd,
            @Valid @SearchParam CodeMgtSearchDTO search) throws InvalidDataException, Exception
    {
        // 데이타유효성검사.
        validSearchData(request, grpCd, search);

        // 조회
        Page<CodeMgt> returnValue = codeMgtService.findList(search, search.getPageable());

        // 리턴값 설정
        ResultListDTO<CodeMgtDTO> resultListMessage = new ResultListDTO<CodeMgtDTO>();
        List<CodeMgtDTO> codeDtoList = modelMapper.map(returnValue.getContent(), CodeMgtDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<CodeMgtDTO>> resultDto =
                new ResultDTO<ResultListDTO<CodeMgtDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * <pre>
     * 사용중인 코드 목록조회. 페이징없음.
     * </pre>
     * 
     * @param request 요청
     * @param grpCd 부모 공통코드
     * @return 공통코드 목록
     * @throws Exception
     * @throws InvalidDataException
     */
    @GetMapping("/{grpCd}/useCodeMgts")
    public ResponseEntity<?> getUseCodeMgtList(
            HttpServletRequest request,
            @PathVariable("grpCd") @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$",
                    message = "{tps.codeMgtGrp.error.invalid.grpCd2}") String grpCd
    ) throws InvalidDataException, Exception
    {

        // 조회
        List<CodeMgt> returnValue = codeMgtService.findUseList(grpCd);

        // 리턴값 설정
        ResultListDTO<CodeMgtDTO> resultListMessage = new ResultListDTO<CodeMgtDTO>();
        List<CodeMgtDTO> codeDtoList = modelMapper.map(returnValue, CodeMgtDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<CodeMgtDTO>> resultDto =
                new ResultDTO<ResultListDTO<CodeMgtDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹정보 조회
     * 
     * @param request 요청
     * @param seqNo 공통코드그룹순번 (필수)
     * @return 공통코드그룹정보
     * @throws NoDataException 공통코드그룹 정보가 없음
     * @throws InvalidDataException 공통코드그룹 아이디 형식오류
     * @throws Exception 기타예외
     */
    @GetMapping("/{seqNo}")
    public ResponseEntity<?> getCodeMgtGrp(
            HttpServletRequest request,
            @PathVariable("seqNo") @Min(value = 0,
                    message = "{tps.codeMgtGrp.error.invalid.seqNo}") Long seqNo
    ) throws NoDataException, InvalidDataException, Exception
    {

        // 데이타유효성검사.
        validGrpData(request, seqNo, null);

        String message = messageByLocale.get("tps.codeMgtGrp.error.noContent", request);
        CodeMgtGrp codeMgtGrp = codeMgtService.findByGrpSeqNo(seqNo)
                .orElseThrow(() -> new NoDataException(message));

        // 하위코드갯수 조회
        Long count = codeMgtService.countCodeMgtByGrpCd(codeMgtGrp.getGrpCd());

        CodeMgtGrpDTO dto = modelMapper.map(codeMgtGrp, CodeMgtGrpDTO.class);
        dto.setCountCodeMgt(count);

        ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹정보 유효성 검사
     * 
     * @param request 요청
     * @param seqNo 공통코드그룹아이디. 0이면 등록일때 유효성 검사
     * @param codeMgtGrpDTO 공통코드그룹정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception 기타예외
     */
    private void validGrpData(HttpServletRequest request, Long seqNo,
            CodeMgtGrpDTO codeMgtGrpDTO) throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtGrpDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (seqNo > 0 && !seqNo.equals(codeMgtGrpDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // grpCd중복검사
            Long countGrpCd = codeMgtService.countCodeMgtGrpByGrpCd(codeMgtGrpDTO.getGrpCd());
            if ((seqNo == 0 && countGrpCd > 0)
                    || seqNo > 0 && countGrpCd > 1) {
                String message =
                        messageByLocale.get("tps.codeMgtGrp.error.invalid.dupGrpCd", request);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

        }

        if (invalidList.size() > 0) {
            String validMessage =
                    messageByLocale.get("tps.codeMgtGrp.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 검색정보 유효성 검사
     * 
     * @param request 요청
     * @param grpCd 공통코드그룹아이디
     * @param codeMgtSearchDTO 검색정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception 기타예외
     */
    private void validSearchData(HttpServletRequest request, String grpCd,
            CodeMgtSearchDTO codeMgtSearchDTO) throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtSearchDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (!grpCd.equals(codeMgtSearchDTO.getGrpCd())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }
        }

        if (invalidList.size() > 0) {
            String validMessage =
                    messageByLocale.get("tps.codeMgtGrp.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 그룹등록
     * 
     * @param request 요청
     * @param codeMgtGrpDTO 등록할 코드그룹정보
     * @param principal 로그인사용자 세션
     * @return 등록된 예약어정보
     * @throws Exception
     */
    @PostMapping
    public ResponseEntity<?> postCodeMgtGrp(HttpServletRequest request,
        @Valid CodeMgtGrpDTO codeMgtGrpDTO, Principal principal) throws Exception {

        // 데이타유효성검사.
        validGrpData(request, (long) 0, codeMgtGrpDTO);

        // 등록
        CodeMgtGrp codeMgtGrp = modelMapper.map(codeMgtGrpDTO, CodeMgtGrp.class);
//        codeMgtGrp.setRegId(principal.getName()); //?
        codeMgtGrp.setRegId("test");
        CodeMgtGrp returnValue = codeMgtService.insertCodeMgtGrp(codeMgtGrp);

        // 결과리턴
        CodeMgtGrpDTO dto = modelMapper.map(returnValue, CodeMgtGrpDTO.class);
        ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹수정
     * 
     * @param request 요청
     * @param seqNo 그룹순번
     * @param codeMgtGrpDTO 수정할 그룹정보
     * @param principal 로그인 사용자 세션
     * @return 수정된 그룹정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException 데이타 없음
     * @throws Exception 기타예외
     */
    @PutMapping("/{seqNo}")
    public ResponseEntity<?> putCodeMgtGrp(
            HttpServletRequest request,
            @PathVariable("seqNo") @Min(value = 0,
                message = "{tps.codeMgtGrp.error.invalid.seqNo}") Long seqNo,
            @Valid CodeMgtGrpDTO codeMgtGrpDTO,
            Principal principal
    ) throws InvalidDataException, NoDataException, Exception
    {

        // 데이타유효성검사.
        validGrpData(request, seqNo, codeMgtGrpDTO);

        // 수정
        String infoMessage = messageByLocale.get("tps.codeMgtGrp.error.noContent", request);
        CodeMgtGrp newCodeMgtGrp = modelMapper.map(codeMgtGrpDTO, CodeMgtGrp.class);
        CodeMgtGrp orgCodeMgtGrp = codeMgtService.findByGrpSeqNo(seqNo)
                .orElseThrow(() -> new NoDataException(infoMessage));

        newCodeMgtGrp.setRegDt(orgCodeMgtGrp.getRegDt());
        newCodeMgtGrp.setRegId(orgCodeMgtGrp.getRegId());
        newCodeMgtGrp.setModDt(McpDate.now());
//        newCodeMgtGrp.setModId(principal.getName()); //?
        newCodeMgtGrp.setModId("test");
        CodeMgtGrp returnValue = codeMgtService.updateCodeMgtGrp(newCodeMgtGrp);

        // 결과리턴
        CodeMgtGrpDTO dto = modelMapper.map(returnValue, CodeMgtGrpDTO.class);

        ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹삭제
     * 
     * @param request 요청
     * @param seqNo 삭제 할 그룹순번 (필수)
     * @param principal 로그인 사용자 세션
     * @return 삭제성공여부
     * @throws NoDataException 예약어정보 없음 오류
     * @throws Exception 기타예외
     */
    @DeleteMapping("/{seqNo}")
    public ResponseEntity<?> deleteCodeMgtGrp(
            HttpServletRequest request,
            @PathVariable("seqNo") @Min(value = 0,
                message = "{tps.codeMgtGrp.error.invalid.seqNo}") Long seqNo,
            Principal principal
    ) throws NoDataException, Exception
    {
        // 1. 데이타 존재여부 검사
        String noContentMessage = messageByLocale.get("tps.codeMgtGrp.error.noContent", request);
        CodeMgtGrp codeMgtGrp = codeMgtService.findByGrpSeqNo(seqNo)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // 2. 삭제
//        codeMgtService.deleteCodeMgtGrp(codeMgtGrp, principal.getName()); //?
        codeMgtService.deleteCodeMgtGrp(codeMgtGrp, "test");

        // 3. 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드정보 조회
     * 
     * @param request 요청
     * @param seqNo 코드순번 (필수)
     * @return 코드정보
     * @throws NoDataException 코드 정보가 없음
     * @throws InvalidDataException 코드 아이디 형식오류
     * @throws Exception 기타예외
     */
    @GetMapping("/codeMgts/{seqNo}")
    public ResponseEntity<?> getCodeMgt(HttpServletRequest request,
            @PathVariable("seqNo") @Min(value = 0,
                    message = "{tps.codeMgt.error.invalid.seqNo}") Long seqNo)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, seqNo, null);

        String message = messageByLocale.get("tps.codeMgt.error.noContent", request);
        CodeMgt codeMgt =
                codeMgtService.findBySeqNo(seqNo).orElseThrow(() -> new NoDataException(message));

        CodeMgtDTO dto = modelMapper.map(codeMgt, CodeMgtDTO.class);
        ResultDTO<CodeMgtDTO> resultDto = new ResultDTO<CodeMgtDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드정보 유효성 검사
     * 
     * @param request 요청
     * @param seqNo 코드 순번. 0이면 등록일때 유효성 검사
     * @param codeMgtDTO 코드정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception 기타예외
     */
    private void validData(HttpServletRequest request, Long seqNo, CodeMgtDTO codeMgtDTO)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (seqNo > 0 && !seqNo.equals(codeMgtDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // 그룹의 grpSeqNo정보 검사
            Long grpSeqNo = codeMgtDTO.getCodeMgtGrp().getSeqNo();
            if (grpSeqNo == null || grpSeqNo < 0) {
                String message =
                        messageByLocale.get("tps.codeMgt.error.invalid.grpCd", request);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

            // 그룹아이디 정보 검사
            String grpCd = codeMgtDTO.getCodeMgtGrp().getGrpCd();
            if (McpString.isEmpty(grpCd)) {
                String message =
                        messageByLocale.get("tps.codeMgt.error.invalid.grpCd", request);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

            // 그룹정보가 올바른지 검사
            if (McpString.isNotEmpty(grpCd) && grpSeqNo > 0) {
                Optional<CodeMgtGrp> codeMgtGrp = codeMgtService.findByGrpSeqNo(grpSeqNo);
                if (!codeMgtGrp.isPresent()) {
                    String message =
                            messageByLocale.get("tps.codeMgt.error.invalid.grpCd", request);
                    invalidList.add(new InvalidDataDTO("grpCd", message));
                } else {
                    if (!codeMgtGrp.get().getGrpCd().equals(grpCd)) {
                        String message = messageByLocale
                                .get("tps.codeMgt.error.invalid.matchGrpCd", request);
                        invalidList.add(new InvalidDataDTO("grpCd", message));
                    }
                }
            }

            // dtlCd중복검사
            Long countDtls = codeMgtService.countCodeMgtByDtlCd(grpCd, codeMgtDTO.getDtlCd());
            if ((seqNo == 0 && countDtls > 0) || seqNo > 0 && countDtls > 1) {
                String message =
                        messageByLocale.get("tps.codeMgt.error.invalid.dupDtlCd", request);
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
     * @param request 요청
     * @param codeMgtDTO 등록할 코드정보
     * @param principal 로그인사용자 세션
     * @return 등록된 코드정보
     * @throws Exception
     */
    @PostMapping("/codeMgts")
    public ResponseEntity<?> postCodeMgt(HttpServletRequest request, @Valid CodeMgtDTO codeMgtDTO,
            Principal principal) throws Exception {

        // 데이타유효성검사.
        validData(request, (long) 0, codeMgtDTO);

        // 등록
        CodeMgt codeMgt = modelMapper.map(codeMgtDTO, CodeMgt.class);
//        codeMgt.setRegId(principal.getName()); //?
        codeMgt.setRegId("test");
        CodeMgt returnValue = codeMgtService.insertCodeMgt(codeMgt);

        // 결과리턴
        CodeMgtDTO dto = modelMapper.map(returnValue, CodeMgtDTO.class);
        ResultDTO<CodeMgtDTO> resultDto = new ResultDTO<CodeMgtDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드수정
     * 
     * @param request 요청
     * @param seqNo 코드순
     * @param codeMgtDTO 수정할 코드정보
     * @param principal 로그인 사용자 세션
     * @return 수정된 코드정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException 데이타 없음
     * @throws Exception 기타예외
     */
    @PutMapping("/codeMgts/{seqNo}")
    public ResponseEntity<?> putCodeMgt(
        HttpServletRequest request,
        @PathVariable("seqNo") @Min(value = 0,
            message = "{tps.codeMgt.error.invalid.seqNo}") Long seqNo,
        @Valid CodeMgtDTO codeMgtDTO,
        Principal principal) throws InvalidDataException, NoDataException, Exception
    {
        // 데이타유효성검사.
        validData(request, seqNo, codeMgtDTO);

        // 수정
        String infoMessage = messageByLocale.get("tps.codeMgt.error.noContent", request);
        CodeMgt newCodeMgt = modelMapper.map(codeMgtDTO, CodeMgt.class);
        CodeMgt orgCodeMgt =
                codeMgtService.findBySeqNo(seqNo).orElseThrow(() -> new NoDataException(infoMessage));

        newCodeMgt.setRegDt(orgCodeMgt.getRegDt());
        newCodeMgt.setRegId(orgCodeMgt.getRegId());
        newCodeMgt.setModDt(McpDate.now());
//        newCodeMgt.setModId(principal.getName()); //?
        newCodeMgt.setModId("test");
        CodeMgt returnValue = codeMgtService.updateCodeMgt(newCodeMgt);

        // 결과리턴
        CodeMgtDTO dto = modelMapper.map(returnValue, CodeMgtDTO.class);

        ResultDTO<CodeMgtDTO> resultDto = new ResultDTO<CodeMgtDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }


    /**
     * 코드삭제
     * 
     * @param request 요청
     * @param seqNo 삭제 할 코드순번 (필수)
     * @param principal 로그인 사용자 세션
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException 코드정보 없음 오류
     * @throws Exception 기타예외
     */
    @DeleteMapping("/codeMgts/{seqNo}")
    public ResponseEntity<?> deleteCodeMgt(
        HttpServletRequest request,
        @PathVariable("seqNo") @Min(value = 0,
            message = "{tps.codeMgt.error.invalid.seqNo}") Long seqNo,
        Principal principal
    ) throws InvalidDataException, NoDataException, Exception
    {
        // 1. 데이타 존재여부 검사
        String noContentMessage = messageByLocale.get("tps.codeMgt.error.noContent", request);
        CodeMgt codeMgt = codeMgtService.findBySeqNo(seqNo)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // 2. 삭제
//        codeMgtService.deleteCodeMgt(codeMgt, principal.getName()); //?
        codeMgtService.deleteCodeMgt(codeMgt, "test");

        // 3. 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

}

