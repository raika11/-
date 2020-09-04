package jmnet.moka.core.tps.mvc.etccode.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
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
import jmnet.moka.core.tps.mvc.etccode.dto.EtccodeDTO;
import jmnet.moka.core.tps.mvc.etccode.dto.EtccodeSearchDTO;
import jmnet.moka.core.tps.mvc.etccode.dto.EtccodeTypeDTO;
import jmnet.moka.core.tps.mvc.etccode.entity.Etccode;
import jmnet.moka.core.tps.mvc.etccode.entity.EtccodeType;
import jmnet.moka.core.tps.mvc.etccode.service.EtccodeService;

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
@RequestMapping("/api/etccodeTypes")
public class EtccodeRestController {

    @Autowired
    private EtccodeService etccodeService;

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
    public ResponseEntity<?> getEtccodeTypeList(HttpServletRequest request,
            @Valid @SearchParam SearchDTO search) {
        // 페이징조건 설정
        Pageable pageable = search.getPageable();

        // 조회
        Page<EtccodeType> returnValue = etccodeService.findTypeList(pageable);

        // 리턴값 설정
        ResultListDTO<EtccodeTypeDTO> resultListMessage = new ResultListDTO<EtccodeTypeDTO>();
        List<EtccodeTypeDTO> dtoList =
                modelMapper.map(returnValue.getContent(), EtccodeTypeDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<EtccodeTypeDTO>> resultDto =
                new ResultDTO<ResultListDTO<EtccodeTypeDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * <pre>
     * 코드 목록조회. 페이징있음.
     * </pre>
     * 
     * @param request 요청
     * @param codeTypeId : 부모 공통코드
     * @param search 검색조건
     * @return 공통코드 목록
     * @throws Exception
     * @throws InvalidDataException
     */
    @GetMapping("/{codeTypeId}/etccodes")
    public ResponseEntity<?> getEtccodeList(HttpServletRequest request,
            @PathVariable("codeTypeId") @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$",
                    message = "{tps.etccodeType.error.invalid.codeTypeId3}") String codeTypeId,
            @Valid @SearchParam EtccodeSearchDTO search) throws InvalidDataException, Exception {

        // 데이타유효성검사.
        validSearchData(request, codeTypeId, search);

        Pageable pageable = search.getPageable();

        // 조회
        Page<Etccode> returnValue = etccodeService.findList(search, pageable);

        // 리턴값 설정
        ResultListDTO<EtccodeDTO> resultListMessage = new ResultListDTO<EtccodeDTO>();
        List<EtccodeDTO> codeDtoList = modelMapper.map(returnValue.getContent(), EtccodeDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<EtccodeDTO>> resultDto =
                new ResultDTO<ResultListDTO<EtccodeDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * <pre>
     * 사용중인 코드 목록조회. 페이징없음.
     * </pre>
     * 
     * @param request 요청
     * @param codeTypeId : 부모 공통코드
     * @return 공통코드 목록
     * @throws Exception
     * @throws InvalidDataException
     */
    @GetMapping("/{codeTypeId}/useEtccodes")
    public ResponseEntity<?> getUseEtccodeList(HttpServletRequest request,
            @PathVariable("codeTypeId") @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$",
                    message = "{tps.etccodeType.error.invalid.codeTypeId3}") String codeTypeId)
            throws InvalidDataException, Exception {

        // 조회
        List<Etccode> returnValue = etccodeService.findUseList(codeTypeId);

        // 리턴값 설정
        ResultListDTO<EtccodeDTO> resultListMessage = new ResultListDTO<EtccodeDTO>();
        List<EtccodeDTO> codeDtoList = modelMapper.map(returnValue, EtccodeDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<EtccodeDTO>> resultDto =
                new ResultDTO<ResultListDTO<EtccodeDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹정보 조회
     * 
     * @param request 요청
     * @param reservedSeq 공통코드그룹순번 (필수)
     * @return 공통코드그룹정보
     * @throws NoDataException 공통코드그룹 정보가 없음
     * @throws InvalidDataException 공통코드그룹 아이디 형식오류
     * @throws Exception 기타예외
     */
    @GetMapping("/{codeTypeSeq}")
    public ResponseEntity<?> getEtccodeType(HttpServletRequest request,
            @PathVariable("codeTypeSeq") @Min(value = 0,
                    message = "{tps.etccodeType.error.invalid.codeTypeId3}") Long codeTypeSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validTypeData(request, codeTypeSeq, null);

        String message = messageByLocale.get("tps.etccodeType.error.noContent", request);
        EtccodeType etccodeType = etccodeService.findByCodeTypeSeq(codeTypeSeq)
                .orElseThrow(() -> new NoDataException(message));

        // 하위코드갯수 조회
        Long count = etccodeService.countEtccodeByCodeTypeId(etccodeType.getCodeTypeId());

        EtccodeTypeDTO dto = modelMapper.map(etccodeType, EtccodeTypeDTO.class);
        dto.setCountEtccode(count);

        ResultDTO<EtccodeTypeDTO> resultDto = new ResultDTO<EtccodeTypeDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹정보 유효성 검사
     * 
     * @param request 요청
     * @param reservedSeq 공통코드그룹아이디. 0이면 등록일때 유효성 검사
     * @param ReservedDTO 공통코드그룹정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception 기타예외
     */
    private void validTypeData(HttpServletRequest request, Long codeTypeSeq,
            EtccodeTypeDTO etccodeTypeDTO) throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (etccodeTypeDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (codeTypeSeq > 0 && !codeTypeSeq.equals(etccodeTypeDTO.getCodeTypeSeq())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // codeTypeId중복검사
            Long countCodeTypeId =
                    etccodeService.countEtccodeTypeByCodeTypeId(etccodeTypeDTO.getCodeTypeId());
            if ((codeTypeSeq == 0 && countCodeTypeId > 0)
                    || codeTypeSeq > 0 && countCodeTypeId > 1) {
                String message =
                        messageByLocale.get("tps.etccodeType.error.invalid.dupCodeTypeId", request);
                invalidList.add(new InvalidDataDTO("codeTypeId", message));
            }

        }

        if (invalidList.size() > 0) {
            String validMessage =
                    messageByLocale.get("tps.etccodeType.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 검색정보 유효성 검사
     * 
     * @param request 요청
     * @param codeTypeId 공통코드그룹아이디
     * @param EtccodeSearchDTO 검색정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception 기타예외
     */
    private void validSearchData(HttpServletRequest request, String codeTypeId,
            EtccodeSearchDTO etccodeSearchDTO) throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (etccodeSearchDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (!codeTypeId.equals(etccodeSearchDTO.getCodeTypeId())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }
        }

        if (invalidList.size() > 0) {
            String validMessage =
                    messageByLocale.get("tps.etccodeType.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 그룹등록
     * 
     * @param request 요청
     * @param ReservedDTO 등록할 예약어정보
     * @param principal 로그인사용자 세션
     * @return 등록된 예약어정보
     * @throws Exception
     */
    @PostMapping
    public ResponseEntity<?> postEtccodeType(HttpServletRequest request,
            @Valid EtccodeTypeDTO etccodeTypeDTO, Principal principal) throws Exception {

        // 데이타유효성검사.
        validTypeData(request, (long) 0, etccodeTypeDTO);

        // 등록
        EtccodeType etccodeType = modelMapper.map(etccodeTypeDTO, EtccodeType.class);
        etccodeType.setCreateYmdt(McpDate.nowStr());
        etccodeType.setCreator(principal.getName());
        EtccodeType returnValue = etccodeService.insertEtccodeType(etccodeType);

        // 결과리턴
        EtccodeTypeDTO dto = modelMapper.map(returnValue, EtccodeTypeDTO.class);
        ResultDTO<EtccodeTypeDTO> resultDto = new ResultDTO<EtccodeTypeDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹수정
     * 
     * @param request 요청
     * @param codeTypeSeq 그룹순번
     * @param EtccodeTypeDTO 수정할 그룹정보
     * @param principal 로그인 사용자 세션
     * @return 수정된 그룹정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException 데이타 없음
     * @throws Exception 기타예외
     */
    @PutMapping("/{codeTypeSeq}")
    public ResponseEntity<?> putEtccodeType(HttpServletRequest request,
            @PathVariable("codeTypeSeq") @Min(value = 0,
                    message = "{tps.etccodeType.error.invalid.codeTypeId3}") Long codeTypeSeq,
            @Valid EtccodeTypeDTO etccodeTypeDTO, Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validTypeData(request, codeTypeSeq, etccodeTypeDTO);

        // 수정
        String infoMessage = messageByLocale.get("tps.etccodeType.error.noContent", request);
        EtccodeType newEtccodeType = modelMapper.map(etccodeTypeDTO, EtccodeType.class);
        EtccodeType orgEtccodeType = etccodeService.findByCodeTypeSeq(codeTypeSeq)
                .orElseThrow(() -> new NoDataException(infoMessage));

        newEtccodeType.setCreateYmdt(orgEtccodeType.getCreateYmdt());
        newEtccodeType.setCreator(orgEtccodeType.getCreator());
        newEtccodeType.setModifiedYmdt(McpDate.nowStr());
        newEtccodeType.setModifier(principal.getName());
        EtccodeType returnValue = etccodeService.updateEtccodeType(newEtccodeType);

        // 결과리턴
        EtccodeTypeDTO dto = modelMapper.map(returnValue, EtccodeTypeDTO.class);

        ResultDTO<EtccodeTypeDTO> resultDto = new ResultDTO<EtccodeTypeDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 그룹삭제
     * 
     * @param request 요청
     * @param codeTypeSeq 삭제 할 그룹순번 (필수)
     * @param principal 로그인 사용자 세션
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException 예약어정보 없음 오류
     * @throws Exception 기타예외
     */
    @DeleteMapping("/{codeTypeSeq}")
    public ResponseEntity<?> deleteEtccodeType(HttpServletRequest request,
            @PathVariable("codeTypeSeq") @Min(value = 0,
                    message = "{tps.etccodeType.error.invalid.codeTypeId3}") Long codeTypeSeq,
            Principal principal) throws InvalidDataException, NoDataException, Exception {

        // 1. 데이타 존재여부 검사
        String noContentMessage = messageByLocale.get("tps.etccodeType.error.noContent", request);
        EtccodeType etccodeType = etccodeService.findByCodeTypeSeq(codeTypeSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // 2. 삭제
        etccodeService.deleteEtccodeType(etccodeType, principal.getName());

        // 3. 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 코드정보 조회
     * 
     * @param request 요청
     * @param seq 코드순번 (필수)
     * @return 코드정보
     * @throws NoDataException 코드 정보가 없음
     * @throws InvalidDataException 코드 아이디 형식오류
     * @throws Exception 기타예외
     */
    @GetMapping("/etccodes/{seq}")
    public ResponseEntity<?> getEtccode(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.etccode.error.invalid.seq}") Long seq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, seq, null);

        String message = messageByLocale.get("tps.reserved.error.noContent", request);
        Etccode etccode =
                etccodeService.findBySeq(seq).orElseThrow(() -> new NoDataException(message));

        EtccodeDTO dto = modelMapper.map(etccode, EtccodeDTO.class);
        ResultDTO<EtccodeDTO> resultDto = new ResultDTO<EtccodeDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드정보 유효성 검사
     * 
     * @param request 요청
     * @param seq 코드 순번. 0이면 등록일때 유효성 검사
     * @param etccodeDTO 코드정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception 기타예외
     */
    private void validData(HttpServletRequest request, Long seq, EtccodeDTO etccodeDTO)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (etccodeDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (seq > 0 && !seq.equals(etccodeDTO.getSeq())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // 그룹의 codeTypeSeq정보 검사
            Long codeTypeSeq = etccodeDTO.getEtccodeType().getCodeTypeSeq();
            if (codeTypeSeq == null || codeTypeSeq < 0) {
                String message =
                        messageByLocale.get("tps.etccode.error.invalid.codeTypeSeq", request);
                invalidList.add(new InvalidDataDTO("codeTypeSeq", message));
            }

            // 그룹아이디 정보 검사
            String codeTypeId = etccodeDTO.getEtccodeType().getCodeTypeId();
            if (McpString.isEmpty(codeTypeId)) {
                String message =
                        messageByLocale.get("tps.etccode.error.invalid.codeTypeId", request);
                invalidList.add(new InvalidDataDTO("codeTypeId", message));
            }

            // 그룹정보가 올바른지 검사
            if (McpString.isNotEmpty(codeTypeId) && codeTypeSeq > 0) {
                Optional<EtccodeType> etccodeType = etccodeService.findByCodeTypeSeq(codeTypeSeq);
                if (!etccodeType.isPresent()) {
                    String message =
                            messageByLocale.get("tps.etccode.error.invalid.noCodeType", request);
                    invalidList.add(new InvalidDataDTO("codeTypeId", message));
                } else {
                    if (!etccodeType.get().getCodeTypeId().equals(codeTypeId)) {
                        String message = messageByLocale
                                .get("tps.etccode.error.invalid.matchCodeTypeId", request);
                        invalidList.add(new InvalidDataDTO("codeTypeId", message));
                    }
                }
            }

            // codeId중복검사
            Long countCodeId = etccodeService.countEtccodeByCodeId(
                    etccodeDTO.getEtccodeType().getCodeTypeId(), etccodeDTO.getCodeId());
            if ((seq == 0 && countCodeId > 0) || seq > 0 && countCodeId > 1) {
                String message =
                        messageByLocale.get("tps.etccode.error.invalid.dupCodeId", request);
                invalidList.add(new InvalidDataDTO("codeId", message));
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.etccode.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 코드등록
     * 
     * @param request 요청
     * @param etccodeDTO 등록할 코드정보
     * @param principal 로그인사용자 세션
     * @return 등록된 코드정보
     * @throws Exception
     */
    @PostMapping("/etccodes")
    public ResponseEntity<?> postEtccode(HttpServletRequest request, @Valid EtccodeDTO etccodeDTO,
            Principal principal) throws Exception {

        // 데이타유효성검사.
        validData(request, (long) 0, etccodeDTO);

        // 등록
        Etccode etccode = modelMapper.map(etccodeDTO, Etccode.class);
        etccode.setCreateYmdt(McpDate.nowStr());
        etccode.setCreator(principal.getName());
        Etccode returnValue = etccodeService.insertEtccode(etccode);

        // 결과리턴
        EtccodeDTO dto = modelMapper.map(returnValue, EtccodeDTO.class);
        ResultDTO<EtccodeDTO> resultDto = new ResultDTO<EtccodeDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 코드수정
     * 
     * @param request 요청
     * @param seq 코드순
     * @param ReservedDTO 수정할 코드정보
     * @param principal 로그인 사용자 세션
     * @return 수정된 코드정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException 데이타 없음
     * @throws Exception 기타예외
     */
    @PutMapping("/etccodes/{seq}")
    public ResponseEntity<?> putEtccode(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.etccode.error.invalid.seq}") Long seq,
            @Valid EtccodeDTO etccodeDTO, Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(request, seq, etccodeDTO);

        // 수정
        String infoMessage = messageByLocale.get("tps.etccode.error.noContent", request);
        Etccode newEtccode = modelMapper.map(etccodeDTO, Etccode.class);
        Etccode orgEtccode =
                etccodeService.findBySeq(seq).orElseThrow(() -> new NoDataException(infoMessage));

        newEtccode.setCreateYmdt(orgEtccode.getCreateYmdt());
        newEtccode.setCreator(orgEtccode.getCreator());
        newEtccode.setModifiedYmdt(McpDate.nowStr());
        newEtccode.setModifier(principal.getName());
        Etccode returnValue = etccodeService.updateEtccode(newEtccode);

        // 결과리턴
        EtccodeDTO dto = modelMapper.map(returnValue, EtccodeDTO.class);

        ResultDTO<EtccodeDTO> resultDto = new ResultDTO<EtccodeDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }


    /**
     * 코드삭제
     * 
     * @param request 요청
     * @param seq 삭제 할 코드순번 (필수)
     * @param principal 로그인 사용자 세션
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException 코드정보 없음 오류
     * @throws Exception 기타예외
     */
    @DeleteMapping("/etccodes/{seq}")
    public ResponseEntity<?> deleteEtccode(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.etccode.error.invalid.seq}") Long seq,
            Principal principal) throws InvalidDataException, NoDataException, Exception {

        // 1. 데이타 존재여부 검사
        String noContentMessage = messageByLocale.get("tps.etccode.error.noContent", request);
        Etccode etccode = etccodeService.findBySeq(seq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // 2. 삭제
        etccodeService.deleteEtccode(etccode, principal.getName());

        // 3. 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

}

