/**
 * msp-tps ReservedRestController.java 2020. 6. 17. 오전 11:46:08 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.reserved.dto.ReservedDTO;
import jmnet.moka.core.tps.mvc.reserved.dto.ReservedSearchDTO;
import jmnet.moka.core.tps.mvc.reserved.entity.Reserved;
import jmnet.moka.core.tps.mvc.reserved.service.ReservedService;

/**
 * <pre>
 * 
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 17. 오전 11:46:08
 * @author ssc
 */
@RestController
@Validated
@RequestMapping("/api/reserveds")
public class ReservedRestController {

    @Autowired
    private ReservedService reservedService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    /**
     * 예약어목록조회
     * 
     * @param request 요청
     * @param search 검색조건
     * @return 예약어목록
     */
    @GetMapping
    public ResponseEntity<?> getReservedList(HttpServletRequest request,
            @Valid @SearchParam ReservedSearchDTO search) throws InvalidDataException {
        // 페이징조건 설정
        Pageable pageable = search.getPageable();

        // 조회
        Page<Reserved> returnValue = reservedService.findList(search, pageable);

        // 리턴값 설정
        ResultListDTO<ReservedDTO> resultListMessage = new ResultListDTO<ReservedDTO>();
        List<ReservedDTO> dtoList = modelMapper.map(returnValue.getContent(), ReservedDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ReservedDTO>> resultDto =
                new ResultDTO<ResultListDTO<ReservedDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 예약어정보 조회
     * 
     * @param request 요청
     * @param reservedSeq 예약어아이디 (필수)
     * @return 예약어정보
     * @throws NoDataException 예약어 정보가 없음
     * @throws InvalidDataException 예약어 아이디 형식오류
     * @throws Exception 기타예외
     */
    @GetMapping("/{reservedSeq}")
    public ResponseEntity<?> getReserved(HttpServletRequest request,
            @PathVariable("reservedSeq") @Min(value = 0,
                    message = "{tps.reserved.error.invalid.reservedSeq}") Long reservedSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, reservedSeq, null);

        String message = messageByLocale.get("tps.reserved.error.noContent", request);
        Reserved reserved = reservedService.findByReservedSeq(reservedSeq)
                .orElseThrow(() -> new NoDataException(message));

        ReservedDTO dto = modelMapper.map(reserved, ReservedDTO.class);
        ResultDTO<ReservedDTO> resultDto = new ResultDTO<ReservedDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 예약어정보 유효성 검사
     * 
     * @param request 요청
     * @param reservedSeq 예약어 순번. 0이면 등록일때 유효성 검사
     * @param ReservedDTO 예약어정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception 기타예외
     */
    private void validData(HttpServletRequest request, Long reservedSeq, ReservedDTO reservedDTO)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (reservedDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (reservedSeq > 0 && !reservedSeq.equals(reservedDTO.getReservedSeq())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // 중복검사...

        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.reserved.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 예약어등록
     * 
     * @param request 요청
     * @param reservedDTO 등록할 예약어정보
     * @param principal 로그인사용자 세션
     * @return 등록된 예약어정보
     * @throws Exception
     */
    @PostMapping
    public ResponseEntity<?> postReserved(HttpServletRequest request,
            @Valid ReservedDTO reservedDTO, Principal principal) throws Exception {

        // 데이타유효성검사.
        validData(request, (long) 0, reservedDTO);

        // 등록
        Reserved reserved = modelMapper.map(reservedDTO, Reserved.class);
        reserved.setCreateYmdt(McpDate.nowStr());
        reserved.setCreator(principal.getName());
        Reserved returnValue = reservedService.insertReserved(reserved);

        // 결과리턴
        ReservedDTO dto = modelMapper.map(returnValue, ReservedDTO.class);
        ResultDTO<ReservedDTO> resultDto = new ResultDTO<ReservedDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 예약어수정
     * 
     * @param request 요청
     * @param reservedSeq 예약어번호
     * @param ReservedDTO 수정할 예약어정보
     * @param principal 로그인 사용자 세션
     * @return 수정된 예약어정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException 데이타 없음
     * @throws Exception 기타예외
     */
    @PutMapping("/{reservedSeq}")
    public ResponseEntity<?> putReserved(HttpServletRequest request,
            @PathVariable("reservedSeq") @Min(value = 0,
                    message = "{tps.reserved.error.invalid.reservedSeq}") Long reservedSeq,
            @Valid ReservedDTO reservedDTO, Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(request, reservedSeq, reservedDTO);

        // 수정
        String infoMessage = messageByLocale.get("tps.reserved.error.noContent", request);
        Reserved newReserved = modelMapper.map(reservedDTO, Reserved.class);
        Reserved orgReserved = reservedService.findByReservedSeq(reservedSeq)
                .orElseThrow(() -> new NoDataException(infoMessage));

        newReserved.setCreateYmdt(orgReserved.getCreateYmdt());
        newReserved.setCreator(orgReserved.getCreator());
        newReserved.setModifiedYmdt(McpDate.nowStr());
        newReserved.setModifier(principal.getName());
        Reserved returnValue = reservedService.updateReserved(newReserved);

        // 결과리턴
        ReservedDTO dto = modelMapper.map(returnValue, ReservedDTO.class);

        ResultDTO<ReservedDTO> resultDto = new ResultDTO<ReservedDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 예약어삭제
     * 
     * @param request 요청
     * @param reservedSeq 삭제 할 예약어순번 (필수)
     * @param principal 로그인 사용자 세션
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException 예약어정보 없음 오류
     * @throws Exception 기타예외
     */
    @DeleteMapping("/{reservedSeq}")
    public ResponseEntity<?> deleteReserved(HttpServletRequest request,
            @PathVariable("reservedSeq") @Min(value = 0,
                    message = "{tps.reserved.error.invalid.reservedSeq}") Long reservedSeq,
            Principal principal) throws InvalidDataException, NoDataException, Exception {

        // 1. 데이타 존재여부 검사
        String noContentMessage = messageByLocale.get("tps.reserved.error.noContent", request);
        Reserved reserved = reservedService.findByReservedSeq(reservedSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // 2. 삭제
        reservedService.deleteReserved(reserved, principal.getName());

        // 3. 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }


}
