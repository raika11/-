package jmnet.moka.core.tps.mvc.columnist.controller;

import io.swagger.annotations.ApiOperation;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistDTO;
import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistSearchDTO;
import jmnet.moka.core.tps.mvc.columnist.entity.Columnist;
import jmnet.moka.core.tps.mvc.columnist.service.ColumnistService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

/**
 * <pre>
 * 컬럼리스트
 * 2020. 11. 16. ssc 최초생성
 * RequestMapping 생성 규칙
 * RESTful 방식에 소문자만 허용하고 단어 사이 구분이 필요한 경우 '-' 사용
 * 메소드 생성 규칙
 * 목록 조회 : get{Target}List, HttpMethod = GET
 * 조회 : get{Target}, HttpMethod = GET
 * 저장  : post{Target}, HttpMethod = POST
 * 수정  : put{Target}, HttpMethod = PUT
 * </pre>
 *
 * @author ssc
 * @since 2020. 11. 16. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/columnists")
public class ColumnistRestController {

    private final ColumnistService columnistService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final TpsLogger tpsLogger;

    public ColumnistRestController(ColumnistService columnistService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger) {
        this.columnistService = columnistService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * 컬럼리스트 목록 조회
     *
     * @param search 검색조건 : 상태, 컬럼리스트이름
     * @return 컬럼리스트목록
     */
    @ApiOperation(value = "컬럼리스트 목록 조회")
    @GetMapping
    public ResponseEntity<?> getColumnistList(@Valid @SearchParam ColumnistSearchDTO search) {

        ResultListDTO<ColumnistDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Columnist> returnValue = columnistService.findAllColumnist(search);

        // 리턴값 설정
        List<ColumnistDTO> columnistList = modelMapper.map(returnValue.getContent(), ColumnistDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(columnistList);

        // 결과값 셋팅
        ResultDTO<ResultListDTO<ColumnistDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 컬럼리스트 조회
     *
     * @param request  요청
     * @param seqNo 일련번호 (필수)
     * @return 컬럼리스트정보
     * @throws NoDataException 컬럼리스트 정보가 없음
     */
    @ApiOperation(value = "컬럼리스트 조회")
    @GetMapping("/{seqNo}")
    public ResponseEntity<?> getColumninst(HttpServletRequest request
            , @PathVariable("seqNo") @Min(value = 0, message = "{tps.columnist.error.pattern.seqNo}") Long seqNo)
            throws NoDataException {

        String message = messageByLocale.get("tps.columnist.error.no-data", request);
        Columnist columnist = columnistService.findById(seqNo).orElseThrow(() -> new NoDataException(message));
        ColumnistDTO dto = modelMapper.map(columnist, ColumnistDTO.class);
        tpsLogger.success(ActionType.SELECT);
        ResultDTO<ColumnistDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 컬럼리스트등록
     *
     * @param columnistDTO 등록할 컬럼리스트등록
     * @param columnistFile 등록할 컬럼리스트 이미지
     * @return 등록된 컬럼리스트정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "컬럼리스트 등록")
    @PostMapping(produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}
    , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postColumnist(@Valid ColumnistDTO columnistDTO
            , @RequestParam(value="columnistFile", required = false) MultipartFile columnistFile
    )throws InvalidDataException, Exception {

        // 데이터 유효성 검사
        validData(columnistFile, ActionType.INSERT);

        // DirectLinkDTO -> directlink 변환
        Columnist columnist = modelMapper.map(columnistDTO, Columnist.class);
        if (McpString.isNotEmpty(columnist.getSeqNo())) { // 자동 발번이 아닌 경우 중복 체크
            if (columnistService.isDuplicatedId(columnist.getSeqNo())) {
                throw new InvalidDataException(messageByLocale.get("tps.columnist.error.duplicate.seqNo"));
            }
        }

        try {
            // 등록(이미지 등록에 seq가 필요해서 먼저 저장)
            Columnist returnValue = columnistService.insertColumnist(columnist);

            if (columnistFile != null && !columnistFile.isEmpty()) {
                // 이미지파일 저장(multipartFile)
                String imgPath = columnistService.saveImage(returnValue, columnistFile);
                tpsLogger.success(ActionType.UPLOAD, true);

                columnist.setProfilePhoto(imgPath);
                columnist.setSeqNo(returnValue.getSeqNo());
                columnist.setProfilePhoto(imgPath);
                returnValue = columnistService.updateColumnist(columnist);
            }

            // 결과리턴
            ColumnistDTO dto = modelMapper.map(returnValue, ColumnistDTO.class);
            ResultDTO<ColumnistDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(messageByLocale.get("tps.columnist.error.save"), e);
        }
    }

    /**
     * 수정
     *
     * @param seqNo  일련번호
     * @param columnistDTO 컬럼리스트 수정
     * @param columnistFile 프로필이미지
     * @return 수정된 컬럼리스트
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "컬럼리스트 수정")
    @PutMapping(value = "/{seqNo}", produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}
            , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putColumnist(
            @PathVariable("seqNo") @Min(value = 0, message = "{tps.columnist.error.pattern.seqNo}") Long seqNo,
            @Valid ColumnistDTO columnistDTO,
            @RequestParam(value="columnistFile", required = false) MultipartFile columnistFile
    )throws InvalidDataException, Exception {

        // ColumnistDto -> Columnist 변환
        Columnist newColumnist = modelMapper.map(columnistDTO, Columnist.class);
        Columnist orgColumnist = columnistService.findById(newColumnist.getSeqNo()).orElseThrow(() -> {
            String message = messageByLocale.get("tps.columnist.error.no-data");
            tpsLogger.fail(ActionType.UPDATE, message, true);
            return new NoDataException(message);
        });


        try {

            /*
             * 이미지 파일 저장 새로운 파일이 있으면 기존 파일이 있으면 삭제하고 새 파일을 저장한다.
             */


            if (columnistFile != null && !columnistFile.isEmpty()) {

                // 기존이미지 삭제
                if (McpString.isNotEmpty(orgColumnist.getProfilePhoto())) {
                    columnistService.deleteImage(orgColumnist);
                    tpsLogger.success(ActionType.FILE_DELETE, true);
                }
                // 새로운 이미지 저장
                String imgPath = columnistService.saveImage(newColumnist, columnistFile);
                tpsLogger.success(ActionType.UPLOAD, true);

                // 이미지 파일명 수정
                newColumnist.setProfilePhoto(imgPath);
            }

            // update
            Columnist returnValue = columnistService.updateColumnist(newColumnist);

            // 결과리턴
            ColumnistDTO dto = modelMapper.map(returnValue, ColumnistDTO.class);
            String message = messageByLocale.get("tps.columnist.success.update");
            ResultDTO<ColumnistDTO> resultDto = new ResultDTO<ColumnistDTO>(dto, message);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE Columnist] seq: {} {}", columnistDTO.getSeqNo(),  e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE columnist]", e, true);
            throw new Exception(messageByLocale.get("tps.columnist.error.save"), e);
        }
    }


    /**
     * 컬럼리스트 데이터 유효성 검사
     *
     * @param file                  컬럼리스트프로필이미지
     * @param actionType            작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성 오류
     * @throws Exception            예외
     */
    private void validData(MultipartFile file, ActionType actionType) throws InvalidDataException, Exception {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        // 문법검사
        // 등록한 파일이 이미지 파일인지 체크
        System.out.println("filefilefilefile::" + file);
        System.out.println("file.isEmpty()file.isEmpty()::" + file.isEmpty());

        if (file != null && !file.isEmpty()) {
            boolean isImage = ImageUtil.isImage(file);
            if (!isImage) {
                String message = messageByLocale.get("tps.columnist.error.onlyimage.thumbnail");
                invalidList.add(new InvalidDataDTO("thumbnail", message));
                tpsLogger.fail(actionType, message, true);
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }
}
