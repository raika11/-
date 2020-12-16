/**
 * msp-tps ReservedRestController.java 2020. 6. 17. 오전 11:46:08 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.reserved.dto.ReservedDTO;
import jmnet.moka.core.tps.mvc.reserved.dto.ReservedSearchDTO;
import jmnet.moka.core.tps.mvc.reserved.entity.Reserved;
import jmnet.moka.core.tps.mvc.reserved.service.ReservedService;
import lombok.extern.slf4j.Slf4j;
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

/**
 * 예약어 API
 *
 * @author ssc
 * @since 2020. 6. 17. 오전 11:46:08
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/reserveds")
@Api(tags = {"예약어 API"})
public class ReservedRestController extends AbstractCommonController {

    private final ReservedService reservedService;

    public ReservedRestController(ReservedService reservedService) {
        this.reservedService = reservedService;
    }

    /**
     * 예약어목록조회
     *
     * @param search 검색조건
     * @return 예약어목록
     */
    @ApiOperation(value = "예약어 목록조회")
    @GetMapping
    public ResponseEntity<?> getReservedList(@Valid @SearchParam ReservedSearchDTO search) {
        // 페이징조건 설정
        Pageable pageable = search.getPageable();

        // 조회
        Page<Reserved> returnValue = reservedService.findAllReserved(search, pageable);

        // 리턴값 설정
        ResultListDTO<ReservedDTO> resultListMessage = new ResultListDTO<ReservedDTO>();
        List<ReservedDTO> dtoList = modelMapper.map(returnValue.getContent(), ReservedDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ReservedDTO>> resultDto = new ResultDTO<ResultListDTO<ReservedDTO>>(resultListMessage);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 예약어 상세조회
     *
     * @param reservedSeq 예약어아이디 (필수)
     * @return 예약어정보
     * @throws NoDataException      예약어 정보가 없음
     * @throws InvalidDataException 예약어 아이디 형식오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "예약어 상세조회")
    @GetMapping("/{reservedSeq}")
    public ResponseEntity<?> getReserved(
            @ApiParam("예약어SEQ(필수)") @PathVariable("reservedSeq") @Min(value = 0, message = "{tps.reserved.error.min.reservedSeq}") Long reservedSeq)
            throws NoDataException, InvalidDataException, Exception {

        validData(reservedSeq, null);

        Reserved reserved = reservedService
                .findReservedBySeq(reservedSeq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        ReservedDTO dto = modelMapper.map(reserved, ReservedDTO.class);
        ResultDTO<ReservedDTO> resultDto = new ResultDTO<ReservedDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 예약어정보 유효성 검사
     *
     * @param reservedSeq 예약어 순번. 0이면 등록일때 유효성 검사
     * @param reservedDTO 예약어정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception            기타예외
     */
    private void validData(Long reservedSeq, ReservedDTO reservedDTO)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (reservedDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (reservedSeq > 0 && !reservedSeq.equals(reservedDTO.getReservedSeq())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // 중복검사...

        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 예약어 등록
     *
     * @param reservedDTO 등록할 예약어정보
     * @return 등록된 예약어정보
     * @throws Exception
     */
    @ApiOperation(value = "예약어 등록")
    @PostMapping
    public ResponseEntity<?> postReserved(@Valid ReservedDTO reservedDTO)
            throws Exception {

        // 데이타유효성검사.
        validData((long) 0, reservedDTO);

        // 등록
        Reserved reserved = modelMapper.map(reservedDTO, Reserved.class);

        try {
            Reserved returnValue = reservedService.insertReserved(reserved);

            ReservedDTO dto = modelMapper.map(returnValue, ReservedDTO.class);

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<ReservedDTO> resultDto = new ResultDTO<ReservedDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT RESERVED]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT RESERVED]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.insert"), e);
        }
    }

    /**
     * 예약어수정
     *
     * @param reservedSeq 예약어번호
     * @param reservedDTO 수정할 예약어정보
     * @return 수정된 예약어정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "예약어수정")
    @PutMapping("/{reservedSeq}")
    public ResponseEntity<?> putReserved(
            @ApiParam("예약어SEQ(필수)") @PathVariable("reservedSeq") @Min(value = 0, message = "{tps.reserved.error.min.reservedSeq}") Long reservedSeq,
            @Valid ReservedDTO reservedDTO)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(reservedSeq, reservedDTO);

        // 수정
        Reserved newReserved = modelMapper.map(reservedDTO, Reserved.class);
        Reserved orgReserved = reservedService
                .findReservedBySeq(reservedSeq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });
        try {
            Reserved returnValue = reservedService.updateReserved(newReserved);

            ReservedDTO dto = modelMapper.map(returnValue, ReservedDTO.class);

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<ReservedDTO> resultDto = new ResultDTO<ReservedDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE RESERVED] seq: {} {}", reservedDTO.getReservedSeq(), e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE RESERVED]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.update"), e);
        }

    }

    /**
     * 예약어삭제
     *
     * @param reservedSeq 삭제 할 예약어순번 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      예약어정보 없음 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "예약어삭제")
    @DeleteMapping("/{reservedSeq}")
    public ResponseEntity<?> deleteReserved(
            @ApiParam("예약어SEQ(필수)") @PathVariable("reservedSeq") @Min(value = 0, message = "{tps.reserved.error.min.reservedSeq}") Long reservedSeq)
            throws NoDataException, Exception {

        // 데이타 확인
        Reserved reserved = reservedService
                .findReservedBySeq(reservedSeq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {
            // 삭제
            reservedService.deleteReserved(reserved);

            // 3. 결과리턴
            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE RESERVED] seq: {} {}", reservedSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE RESERVED]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.delete"), e);
        }
    }

    /**
     * 동일 아이디 존재 여부
     *
     * @param reservedId 예약어ID
     * @param domainId   도메인ID
     * @return 중복여부
     */
    @ApiOperation(value = "동일 아이디 존재 여부")
    @GetMapping("/{reservedId}/exists")
    public ResponseEntity<?> duplicateCheckId(
            @ApiParam("예약어아이디(필수)") @PathVariable("reservedId")
            @Pattern(regexp = "^[a-zA-Z]{1}[a-zA-Z0-9_/-].+", message = "{tps.reserved.error.pattern.reservedId}") String reservedId,
            @ApiParam("도메인아이디(필수)")String domainId)
            throws Exception {

        try {
            boolean duplicated = reservedService.isDuplicatedId(reservedId, domainId);
            String message = "";
            if (duplicated) {
                message = messageByLocale.get("tps.reserved.error.duplicate.reservedId");
            }

            ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DUPLICATE RESERVED] : reservedId {} {}", reservedId, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DUPLICATE RESERVED]", e, true);
            throw new Exception(messageByLocale.get("tps.reserved.error.duplicate.reservedId"));
        }
    }


}
