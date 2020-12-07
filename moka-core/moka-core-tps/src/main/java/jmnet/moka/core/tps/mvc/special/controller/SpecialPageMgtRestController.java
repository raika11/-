/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.special.controller;

import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
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
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtDTO;
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtSearchDTO;
import jmnet.moka.core.tps.mvc.special.entity.SpecialPageMgt;
import jmnet.moka.core.tps.mvc.special.service.SpecialPageMgtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import org.springframework.web.multipart.MultipartFile;

/**
 * Description: 디지털 스페셜 API
 *
 * @author ohtah
 * @since 2020. 12. 6.
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/specials")
public class SpecialPageMgtRestController extends AbstractCommonController {
    @Autowired
    private SpecialPageMgtService specialPageMgtService;

    /**
     * 디지털스페셜 목록조회
     *
     * @param search 검색조건
     * @return 디지털스페셜 목록
     */
    @ApiOperation(value = "디지털스페셜 목록조회")
    @GetMapping
    public ResponseEntity<?> getSpecialPageMgtList(@Valid @SearchParam SpecialPageMgtSearchDTO search) {

        // 조회
        Page<SpecialPageMgt> returnValue = specialPageMgtService.findAllSpecialPageMgt(search);

        // 리턴값 설정
        ResultListDTO<SpecialPageMgtDTO> resultList = new ResultListDTO<>();

        List<SpecialPageMgtDTO> dtoList = modelMapper.map(returnValue.getContent(), SpecialPageMgtDTO.TYPE);
        resultList.setTotalCnt(returnValue.getTotalElements());
        resultList.setList(dtoList);

        ResultDTO<ResultListDTO<SpecialPageMgtDTO>> resultDTO = new ResultDTO<ResultListDTO<SpecialPageMgtDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 디지털스페셜 상세조회
     *
     * @param seqNo 디지털스페셜아이디 (필수)
     * @return 디지털스페셜 정보
     * @throws NoDataException JpodChannel 정보가 없음
     */
    @ApiOperation(value = "디지털스페셜 상세조회")
    @GetMapping("/{seqNo}")
    public ResponseEntity<?> getSpecialPageMgt(
            @PathVariable("seqNo") @Min(value = 0, message = "{tps.specialPageMgt.error.pattern.seqNo}") Long seqNo)
            throws NoDataException {

        SpecialPageMgt specialPage = specialPageMgtService
                .findSpecialPageMgtBySeq(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        SpecialPageMgtDTO specialPageDTO = modelMapper.map(specialPage, SpecialPageMgtDTO.class);

        ResultDTO<SpecialPageMgtDTO> resultDTO = new ResultDTO<SpecialPageMgtDTO>(specialPageDTO);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 디지털스페셜 등록
     *
     * @param specialPageMgtDTO 디지털스페셜 정보
     * @return 디지털스페셜 정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "디지털스페셜 등록")
    @PostMapping
    public ResponseEntity<?> postSpecialPageMgt(@Valid SpecialPageMgtDTO specialPageMgtDTO)
            throws Exception, InvalidDataException {

        // 데이터 유효성 검사
        validData((long) 0, specialPageMgtDTO, ActionType.INSERT);

        SpecialPageMgt specialPageMgt = modelMapper.map(specialPageMgtDTO, SpecialPageMgt.class);

        try {
            // 등록(이미지 등록에 seq가 필요해서 디지털스페셜을 먼저 저장함)
            SpecialPageMgt returnVal = specialPageMgtService.insertSpecialPageMgt(specialPageMgt);

            // 이미지등록
            boolean bImageUpload = true;
            if (specialPageMgtDTO.getThumbnailFile() != null) {
                MultipartFile mfile = specialPageMgtDTO.getThumbnailFile();
                String fileName = specialPageMgtService.saveImage(returnVal, mfile);
                if (McpString.isNotEmpty(fileName)) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                    returnVal.setImgUrl(fileName);

                    // 썸네일경로 업데이트
                    returnVal = specialPageMgtService.updateSpecialPageMgt(returnVal);
                } else {
                    tpsLogger.fail(msg("tps.specialPageMgt.error.image-upload"), true);
                    bImageUpload = false;
                }
            }

            // 리턴값 조회.
            // 이미지업로드가 실패할경우는, 등록은 성공으로 보내고, 메세지만 이미지업로드 실패로 보낸다.
            String message = msg("tps.common.success.insert");
            if (!bImageUpload) {
                message = msg("tps.specialPageMgt.error.image-upload");
            }
            SpecialPageMgtDTO returnValDTO = modelMapper.map(returnVal, SpecialPageMgtDTO.class);
            ResultDTO<SpecialPageMgtDTO> resultDTO = new ResultDTO<SpecialPageMgtDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT SPECIAL_PAGE_MGT]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT SPECIAL_PAGE_MGT]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * 데이터 유효성 검사
     *
     * @param specialPageMgtDTO 디지털스페셜 정보
     * @param actionType        작업구분(INSERT OR UPDATE)
     */
    private void validData(Long seqNo, SpecialPageMgtDTO specialPageMgtDTO, ActionType actionType)
            throws InvalidDataException {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (specialPageMgtDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (seqNo > 0 && !seqNo.equals(specialPageMgtDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                invalidList.add(new InvalidDataDTO("matchId", message));
                tpsLogger.fail(actionType, message, true);
            }

            // 등록한 파일이 이미지 파일인지 체크
            if (specialPageMgtDTO.getThumbnailFile() != null && !specialPageMgtDTO
                    .getThumbnailFile()
                    .isEmpty()) {
                boolean isImage = ImageUtil.isImage(specialPageMgtDTO.getThumbnailFile());
                if (!isImage) {
                    String message = messageByLocale.get("tps.specialPageMgt.error.onlyimage.thumbnail");
                    invalidList.add(new InvalidDataDTO("imgUrl", message));
                    tpsLogger.fail(actionType, message, true);
                }
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 디지털스페셜 수정
     *
     * @param seqNo             디지털스페셜 ID
     * @param specialPageMgtDTO 디지털스페셜 정보
     * @return 디지털스페셜 정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "디지털스페셜 수정")
    @PutMapping("/{seqNo}")
    public ResponseEntity<?> putSpecialPageMgt(
            @PathVariable("seqNo") @Min(value = 0, message = "{tps.specialPageMgt.error.pattern.seqNo}") Long seqNo,
            @Valid SpecialPageMgtDTO specialPageMgtDTO)
            throws Exception {

        // 데이터 유효성 검사
        validData(seqNo, specialPageMgtDTO, ActionType.UPDATE);

        specialPageMgtService
                .findSpecialPageMgtBySeq(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        SpecialPageMgt specialPageMgt = modelMapper.map(specialPageMgtDTO, SpecialPageMgt.class);

        try {
            // 이미지등록
            boolean bImageUpload = true;
            if (specialPageMgtDTO.getThumbnailFile() != null) {
                MultipartFile mfile = specialPageMgtDTO.getThumbnailFile();
                String fileName = specialPageMgtService.saveImage(specialPageMgt, mfile);
                if (McpString.isNotEmpty(fileName)) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                } else {
                    tpsLogger.fail(msg("tps.specialPageMgt.error.image-upload"), true);
                    bImageUpload = false;
                }
            }

            SpecialPageMgt returnValue = specialPageMgtService.updateSpecialPageMgt(specialPageMgt);

            // 결과리턴
            // 이미지업로드가 실패할경우는, 수정은 성공으로 보내고, 메세지만 이미지업로드 실패로 보낸다.
            String message = msg("tps.common.success.update");
            if (!bImageUpload) {
                message = msg("tps.specialPageMgt.error.image-upload");
            }
            SpecialPageMgtDTO returnValDTO = modelMapper.map(returnValue, SpecialPageMgtDTO.class);
            ResultDTO<SpecialPageMgtDTO> resultDTO = new ResultDTO<SpecialPageMgtDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE SPECIAL_PAGE_MGT]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO UPDATE SPECIAL_PAGE_MGT]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "디지털스페셜 삭제")
    @DeleteMapping("/{seqNo}")
    public ResponseEntity<?> deleteSpecialPageMgt(
            @PathVariable("seqNo") @Min(value = 0, message = "{tps.specialPageMgt.error.pattern.seqNo}") Long seqNo)
            throws Exception {
        // 1. 데이타 존재여부 검사
        SpecialPageMgt specialPageMgt = specialPageMgtService
                .findSpecialPageMgtBySeq(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {
            // 2. 삭제
            specialPageMgtService.deleteSpecialPageMgt(specialPageMgt);

            // 3. 결과리턴
            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE SPECIAL_PAGE_MGT] seq: {} {}", seqNo, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE SPECIAL_PAGE_MGT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.delete"), e);
        }
    }

}
