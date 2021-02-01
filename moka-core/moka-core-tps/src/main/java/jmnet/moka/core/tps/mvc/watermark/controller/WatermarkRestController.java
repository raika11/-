package jmnet.moka.core.tps.mvc.watermark.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkDTO;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkSearchDTO;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import jmnet.moka.core.tps.mvc.watermark.service.WatermarkService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
 * 워터마크 관리
 * 2020. 10. 22. ssc 최초생성
 * RequestMapping 생성 규칙
 * </pre>
 *
 * @author ssc
 * @since 2020. 10. 22. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/watermark")
@Api(tags = {"워터마크 관리 API"})
public class WatermarkRestController extends AbstractCommonController {

    @Value("${pds.url}")
    private String pdsUrl;

    /////////////////////////////////////////////
    //임시 파일 저장 경로 설정
    //@Value("${direct-link.save.filepath}")
    private String saveFilePath = "/moka_storage/watermark";

    /////////////////////////////////////////////
    //임시 파디폴트 파일 설정
    //@Value("${direct-link.save.default.filename}")
    private String saveDefaultFileName = "000.png";

    private final WatermarkService watermarkService;

    public WatermarkRestController(WatermarkService watermarkService) {
        this.watermarkService = watermarkService;
    }

    /**
     * 워터마크관리 목록 조회
     *
     * @param search 검색조건 : 사용여부
     * @return 워터마크목록
     */
    @ApiOperation(value = "워터마크 목록 조회")
    @GetMapping
    public ResponseEntity<?> getWatermarkList(@Valid @SearchParam WatermarkSearchDTO search) {

        ResultListDTO<WatermarkDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Watermark> returnValue = watermarkService.findAllWatermark(search);

        // 리턴값 설정
        List<WatermarkDTO> watermarkList = modelMapper.map(returnValue.getContent(), WatermarkDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(watermarkList);

        // 결과값 셋팅
        ResultDTO<ResultListDTO<WatermarkDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 워터마크 조회
     *
     * @param request 요청
     * @param seqNo 일련번호 (필수)
     * @return 워터마크정보
     * @throws NoDataException 워터마크 정보가 없음
     */
    @ApiOperation(value = "워터마크 조회")
    @GetMapping("/{seqNo}")
    public ResponseEntity<?> getWatermark(HttpServletRequest request,
                                           @ApiParam("일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.watermark.error.pattern.seqNo}") Long seqNo)
            throws NoDataException {

        String message = msg("tps.common.error.invalidSearch");
        //String message = msg("tps.watermark.error.no-data");
        // tps.message_ko.properties 메시지 프로퍼티 생성 추가 예정 : tps.watermark.error.no-data:워터마크 정보가 없습니다.

        Watermark watermark = watermarkService
                .findById(seqNo)
                .orElseThrow(() -> new NoDataException(message));
        WatermarkDTO dto = modelMapper.map(watermark, WatermarkDTO.class);
        tpsLogger.success(ActionType.SELECT);
        ResultDTO<WatermarkDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 워터마크등록
     *
     * @param watermarkDTO           등록할 워터마크정보
     * @param watermarkThumbnailFile 등록할 워터마크 이미지
     * @return 등록된 워터마크정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "워터마크 등록")
    @PostMapping(produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postWatermark(@Valid WatermarkDTO watermarkDTO,
                                            @ApiParam("썸네일파일") @RequestParam(value = "watermarkThumbnailFile", required = false) MultipartFile watermarkThumbnailFile)
            throws InvalidDataException, Exception {

        // 널이면 강제로 셋팅
        if (McpString.isEmpty(watermarkDTO.getImgUrl())) {
            watermarkDTO.setImgUrl(pdsUrl + saveFilePath + "/" + saveDefaultFileName);
        }

        // 데이터 유효성 검사
        validData(watermarkThumbnailFile);

        // WatermarkDTO -> watermark 변환
        Watermark watermark = modelMapper.map(watermarkDTO, Watermark.class);
        if (McpString.isNotEmpty(watermark.getSeqNo())) { // 자동 발번이 아닌 경우 중복 체크
            if (watermarkService.isDuplicatedId(watermark.getSeqNo())) {
                throw new InvalidDataException(msg("tps.columnist.error.duplicate.seqNo"));//중복된 일련번호가 있습니다.
            }
        }

        try {
            Watermark returnValue = watermarkService.insertWatermark(watermark);

            if (watermarkThumbnailFile != null && !watermarkThumbnailFile.isEmpty()) {
                // 이미지파일 저장(multipartFile)
                String imgUrl = watermarkService.saveImage(returnValue, watermarkThumbnailFile);
                if (McpString.isNotEmpty(imgUrl)) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                    watermark.setSeqNo(returnValue.getSeqNo());
                    watermark.setImgUrl(imgUrl);
                    returnValue = watermarkService.updateWatermark(watermark);
                } else {
                    String message = msg("tps.columnist.error.fileUpload"); //파일업로드에 실패 하였습니다.
                    tpsLogger.fail(ActionType.INSERT, message, true);
                }
            }

            // 결과리턴
            WatermarkDTO dto = modelMapper.map(returnValue, WatermarkDTO.class);
            ResultDTO<WatermarkDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.insert"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT SITE]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.area.error.save"), e);     //저장하지 못했습니다.
        }
    }

    /**
     * 수정
     *
     * @param seqNo                   일련번호
     * @param watermarkDTO           수정할 워터마크
     * @param watermarkThumbnailFile 등록할 워터마크 이미지
     * @return 수정된 워터마크정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "워터마크 수정")
    @PutMapping(value = "/{seqNo}", produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putWatermark(
            @ApiParam("워터마크 일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.common.error.min.seqNo}") Long seqNo,
            @Valid WatermarkDTO watermarkDTO,
            @ApiParam("썸네일파일") @RequestParam(value = "watermarkThumbnailFile", required = false) MultipartFile watermarkThumbnailFile)
            throws Exception {

        // 널이면 강제로 셋팅
        if (McpString.isEmpty(watermarkDTO.getImgUrl())) {
            watermarkDTO.setImgUrl(pdsUrl + saveFilePath + "/" + saveDefaultFileName);
        }

        // WatermarkDTO -> Watermark 변환
        Watermark newWatermark = modelMapper.map(watermarkDTO, Watermark.class);
        newWatermark.setSeqNo(seqNo);
        Watermark orgWatermark = watermarkService
                .findById(newWatermark.getSeqNo())
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });


        try {
            /*
             * 이미지 파일 저장 새로운 파일이 있으면 기존 파일을 덮어쓰기 한다.
             */
            if (watermarkThumbnailFile != null && !watermarkThumbnailFile.isEmpty()) {
                // 새로운 이미지 저장
                String imgUrl = watermarkService.saveImage(newWatermark, watermarkThumbnailFile);
                if (McpString.isNotEmpty(imgUrl)) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                    // 이미지 파일명 수정
                    newWatermark.setImgUrl(imgUrl);
                } else {
                    String message = msg("tps.columnist.error.fileUpload"); //파일업로드에 실패 하였습니다.
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                }
            }
            // update
            Watermark returnValue = watermarkService.updateWatermark(newWatermark);

            // 결과리턴
            WatermarkDTO dto = modelMapper.map(returnValue, WatermarkDTO.class);
            String message = msg("tps.common.success.insert");
            ResultDTO<WatermarkDTO> resultDto = new ResultDTO<>(dto, message);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE Watermark] seq: {} {}", watermarkDTO.getSeqNo(), e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE Watermark]", e, true);
            throw new Exception(msg("tps.area.error.save"), e);
        }
    }

    /**
     * 삭제
     *
     * @param request 요청
     * @param seqNo                 삭제 할 일련번호 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 사이트정보 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "워터마크 삭제")
    @DeleteMapping("/{seqNo}")
    public ResponseEntity<?> deleteWatermark(HttpServletRequest request,
                                              @ApiParam("워터마크 일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.common.error.min.seqNo}") Long seqNo)
            throws InvalidDataException, NoDataException, Exception {


        // 그룹 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data");
        Watermark member = watermarkService
                .findById(seqNo)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // 삭제
            watermarkService.deleteWatermark(member);

            // 이미지 있으면 이미지도
            if (McpString.isNotEmpty(member.getImgUrl())) {
                if (watermarkService.deleteImage(member)) {
                    tpsLogger.success(ActionType.FILE_DELETE, true);
                } else {
                    tpsLogger.fail(ActionType.FILE_DELETE, msg("tps.common.error.delete"), true);
                }
            }

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            String message = msg("tps.common.success.delete");
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE Watermark] seqNo: {} {}", seqNo, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }

    /**
     * 워터마크 관리 데이터 유효성 검사
     *
     * @param file 워터마크 이미지
     * @throws InvalidDataException 데이타유효성 오류
     * @throws Exception            예외
     */
    private void validData(MultipartFile file)
            throws InvalidDataException, Exception {
        List<InvalidDataDTO> invalidList = new ArrayList<>();

        // 문법검사
        // 등록한 파일이 이미지 파일인지 체크
        if (file != null && !file.isEmpty()) {
            boolean isImage = ImageUtil.isImage(file);
            if (!isImage) {
                String message = msg("tps.direct-link.error.only-image.thumbnail");
                invalidList.add(new InvalidDataDTO("thumbnail", message));
                tpsLogger.fail(ActionType.INSERT, message, true);
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = msg("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }
}
