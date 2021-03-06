/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.special.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtDTO;
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtSearchDTO;
import jmnet.moka.core.tps.mvc.special.entity.SpecialPageMgt;
import jmnet.moka.core.tps.mvc.special.service.SpecialPageMgtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
 * Description: ????????? ????????? API
 *
 * @author ohtah
 * @since 2020. 12. 6.
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/specials")
@Api(tags = {"????????? ????????? API"})
public class SpecialPageMgtRestController extends AbstractCommonController {

    private final SpecialPageMgtService specialPageMgtService;

    public SpecialPageMgtRestController(SpecialPageMgtService specialPageMgtService) {
        this.specialPageMgtService = specialPageMgtService;
    }

    /**
     * ?????????????????? ????????????
     *
     * @param search ????????????
     * @return ?????????????????? ??????
     */
    @ApiOperation(value = "?????????????????? ????????????")
    @GetMapping
    public ResponseEntity<?> getSpecialPageMgtList(@Valid @SearchParam SpecialPageMgtSearchDTO search) {

        // ??????
        Page<SpecialPageMgt> returnValue = specialPageMgtService.findAllSpecialPageMgt(search);

        // ????????? ??????
        ResultListDTO<SpecialPageMgtDTO> resultList = new ResultListDTO<>();

        List<SpecialPageMgtDTO> dtoList = modelMapper.map(returnValue.getContent(), SpecialPageMgtDTO.TYPE);
        resultList.setTotalCnt(returnValue.getTotalElements());
        resultList.setList(dtoList);

        ResultDTO<ResultListDTO<SpecialPageMgtDTO>> resultDTO = new ResultDTO<ResultListDTO<SpecialPageMgtDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ?????????????????? ????????????
     *
     * @param seqNo ??????????????????????????? (??????)
     * @return ?????????????????? ??????
     * @throws NoDataException JpodChannel ????????? ??????
     */
    @ApiOperation(value = "?????????????????? ????????????")
    @GetMapping("/{seqNo}")
    public ResponseEntity<?> getSpecialPageMgt(
            @ApiParam("??????????????????SEQ(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.specialPageMgt.error.pattern.seqNo}") Long seqNo)
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
     * ?????????????????? ??????
     *
     * @param specialPageMgtDTO ?????????????????? ??????
     * @return ?????????????????? ??????
     * @throws Exception ??????
     */
    @ApiOperation(value = "?????????????????? ??????")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postSpecialPageMgt(@Valid SpecialPageMgtDTO specialPageMgtDTO)
            throws Exception, InvalidDataException {

        // ????????? ????????? ??????
        validData((long) 0, specialPageMgtDTO, ActionType.INSERT);

        SpecialPageMgt specialPageMgt = modelMapper.map(specialPageMgtDTO, SpecialPageMgt.class);

        try {
            // ???????????????
            if (specialPageMgtDTO.getThumbnailFile() != null) {
                MultipartFile mfile = specialPageMgtDTO.getThumbnailFile();
                String imgUrl = specialPageMgtService.saveImage(mfile);
                if (McpString.isNotEmpty(imgUrl)) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                    specialPageMgt.setImgUrl(imgUrl);
                } else {
                    String message = msg("tps.specialPageMgt.error.image-upload");
                    List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();
                    invalidList.add(new InvalidDataDTO("imgUrl", message));
                    tpsLogger.fail(ActionType.INSERT, message, true);
                    throw new InvalidDataException(invalidList, message);
                }
            }

            // ??????
            SpecialPageMgt returnVal = specialPageMgtService.insertSpecialPageMgt(specialPageMgt);

            // ????????? ??????.
            SpecialPageMgtDTO returnValDTO = modelMapper.map(returnVal, SpecialPageMgtDTO.class);
            ResultDTO<SpecialPageMgtDTO> resultDTO = new ResultDTO<SpecialPageMgtDTO>(returnValDTO, msg("tps.common.success.insert"));
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT SPECIAL_PAGE_MGT]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT SPECIAL_PAGE_MGT]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * ????????? ????????? ??????
     *
     * @param specialPageMgtDTO ?????????????????? ??????
     * @param actionType        ????????????(INSERT OR UPDATE)
     */
    private void validData(Long seqNo, SpecialPageMgtDTO specialPageMgtDTO, ActionType actionType)
            throws InvalidDataException {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (specialPageMgtDTO != null) {
            // url id??? json??? id??? ???????????? ??????
            if (seqNo > 0 && !seqNo.equals(specialPageMgtDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                invalidList.add(new InvalidDataDTO("matchId", message));
                tpsLogger.fail(actionType, message, true);
            }

            // ????????? ????????? ????????? ???????????? ??????
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

            // ???????????????????????? ??????
            if (specialPageMgtDTO.getThumbnailFile() == null && McpString.isEmpty(specialPageMgtDTO.getImgUrl())) {
                String message = messageByLocale.get("tps.specialPageMgt.error.notnull.image-upload");
                invalidList.add(new InvalidDataDTO("imgUrl", message));
                tpsLogger.fail(actionType, message, true);
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * ?????????????????? ??????
     *
     * @param seqNo             ?????????????????? ID
     * @param specialPageMgtDTO ?????????????????? ??????
     * @return ?????????????????? ??????
     * @throws Exception ??????
     */
    @ApiOperation(value = "?????????????????? ??????")
    @PutMapping(value = "/{seqNo}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putSpecialPageMgt(
            @ApiParam("??????????????????SEQ(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.specialPageMgt.error.pattern.seqNo}") Long seqNo,
            @Valid SpecialPageMgtDTO specialPageMgtDTO)
            throws Exception {

        // ????????? ????????? ??????
        validData(seqNo, specialPageMgtDTO, ActionType.UPDATE);

        specialPageMgtService
                .findSpecialPageMgtBySeq(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });


        try {
            // ???????????????
            if (specialPageMgtDTO.getThumbnailFile() != null) {
                MultipartFile mfile = specialPageMgtDTO.getThumbnailFile();
                String imgUrl = specialPageMgtService.saveImage(mfile);
                if (McpString.isNotEmpty(imgUrl)) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                    specialPageMgtDTO.setImgUrl(imgUrl);
                } else {
                    String message = msg("tps.specialPageMgt.error.image-upload");
                    List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();
                    invalidList.add(new InvalidDataDTO("imgUrl", message));
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    throw new InvalidDataException(invalidList, message);
                }
            }

            SpecialPageMgt specialPageMgt = modelMapper.map(specialPageMgtDTO, SpecialPageMgt.class);
            SpecialPageMgt returnValue = specialPageMgtService.updateSpecialPageMgt(specialPageMgt);

            // ????????????
            String message = msg("tps.common.success.update");
            SpecialPageMgtDTO returnValDTO = modelMapper.map(returnValue, SpecialPageMgtDTO.class);
            ResultDTO<SpecialPageMgtDTO> resultDTO = new ResultDTO<SpecialPageMgtDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE SPECIAL_PAGE_MGT]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE SPECIAL_PAGE_MGT]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "?????????????????? ??????")
    @DeleteMapping("/{seqNo}")
    public ResponseEntity<?> deleteSpecialPageMgt(
            @ApiParam("??????????????????SEQ(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.specialPageMgt.error.pattern.seqNo}") Long seqNo)
            throws Exception {
        // 1. ????????? ???????????? ??????
        SpecialPageMgt specialPageMgt = specialPageMgtService
                .findSpecialPageMgtBySeq(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {
            // 2. ??????
            specialPageMgtService.deleteSpecialPageMgt(specialPageMgt);

            // 3. ????????????
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

    /**
     * ?????????????????? ???????????? ??????
     *
     * @return ????????????
     */
    @ApiOperation(value = "?????????????????? ????????????")
    @GetMapping("/depts")
    public ResponseEntity<?> getDeptList() {

        // ??????
        List<String> returnValue = specialPageMgtService.findAllDeptBySpecialPageMgt();

        // ????????? ??????
        ResultListDTO<String> resultList = new ResultListDTO<>();

        resultList.setTotalCnt(returnValue.size());
        resultList.setList(returnValue);

        ResultDTO<ResultListDTO<String>> resultDTO = new ResultDTO<ResultListDTO<String>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

}
