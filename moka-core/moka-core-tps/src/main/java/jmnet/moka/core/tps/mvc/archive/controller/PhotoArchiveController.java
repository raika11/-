package jmnet.moka.core.tps.mvc.archive.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.PhotoArchiveMenuCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.mvc.archive.dto.PhotoArchiveDTO;
import jmnet.moka.core.tps.mvc.archive.dto.PhotoArchiveSearchDTO;
import jmnet.moka.core.tps.mvc.archive.service.PhotoArchiveService;
import jmnet.moka.core.tps.mvc.archive.vo.OriginCodeVO;
import jmnet.moka.core.tps.mvc.archive.vo.PhotoArchiveDetailVO;
import jmnet.moka.core.tps.mvc.archive.vo.PhotoArchiveVO;
import jmnet.moka.core.tps.mvc.archive.vo.PhotoTypeVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.achive.controller
 * ClassName : PhotoArchiveController
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 17:51
 */
@RestController
@RequestMapping("/api/achive/photos")
@Api(tags = {"?????? ???????????? API"})
@Slf4j
public class PhotoArchiveController extends AbstractCommonController {

    private final PhotoArchiveService photoArchiveService;

    public PhotoArchiveController(PhotoArchiveService photoArchiveService) {
        this.photoArchiveService = photoArchiveService;
    }

    /**
     * ?????? ???????????? ?????? ?????? ??????
     *
     * @param search ?????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ???????????? ?????? ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getPhotoArchiveList(@SearchParam PhotoArchiveSearchDTO search, @NotNull Principal principal) {

        ResultListDTO<PhotoArchiveVO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<PhotoArchiveVO> returnValue = photoArchiveService.findAllPhotoArchive(search, principal.getName());
        List<PhotoArchiveVO> resultDTOs = modelMapper.map(returnValue.getContent(), PhotoArchiveDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(resultDTOs);

        ResultDTO<ResultListDTO<PhotoArchiveVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ???????????? ?????? ?????? ??????
     *
     * @param photoId ?????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ???????????? ?????? ?????? ??????")
    @GetMapping("/{photoId}")
    public ResponseEntity<?> getPhotoArchive(@ApiParam("??????ID") @PathVariable(value = "photoId", required = true)
    @Size(message = "{tps.photo-archive.error.pattern.photoId}") String photoId, @NotNull Principal principal)
            throws NoDataException {

        // ??????
        String message = msg("tps.common.error.no-data");
        PhotoArchiveVO returnValue = photoArchiveService
                .findPhotoArchiveById(photoId, principal.getName())
                .orElseThrow(() -> {
                    return new NoDataException(message);
                });
        PhotoArchiveDetailVO resultDTO = modelMapper.map(returnValue, PhotoArchiveDetailVO.class);

        ResultDTO<PhotoArchiveDetailVO> resultDto = new ResultDTO<>(resultDTO);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ???????????? ?????? ?????? ??????
     *
     * @param menuCode ?????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ???????????? ?????? ?????? ??????")
    @GetMapping("/origins")
    public ResponseEntity<?> getPhotoOriginList(
            @ApiParam("????????????") @NotNull(message = "{tps.photo-archive.error.notnull.menuCode}") @RequestParam(value = "menuCode", required = false)
                    PhotoArchiveMenuCode menuCode, @NotNull Principal principal) {

        ResultListDTO<OriginCodeVO> resultListMessage = new ResultListDTO<>();
        if (menuCode == null) {
            menuCode = PhotoArchiveMenuCode.PHOTO_DB;
        }
        // ??????
        List<OriginCodeVO> returnValue = photoArchiveService.findAllPhotoOrigin(menuCode.getMenuNo(), principal.getName(), TpsConstants.SITE_CD);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(returnValue);

        ResultDTO<ResultListDTO> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ?????? ?????? ?????? ??????
     *
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ?????? ?????? ?????? ??????")
    @GetMapping("/types")
    public ResponseEntity<?> getPhotoTypeList(@NotNull Principal principal) {

        ResultListDTO<PhotoTypeVO> resultListMessage = new ResultListDTO<>();

        // ??????
        List<PhotoTypeVO> returnValue = photoArchiveService.findAllPhotoType(principal.getName());
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(returnValue);

        ResultDTO<ResultListDTO> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ????????? ?????? ?????????
     *
     * @param request HTTP ??????
     * @return ????????? byte[]
     * @throws NoDataException ???????????????
     */
    @ApiOperation(value = "????????? ?????? ?????????")
    @GetMapping(value = "/by-url", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE})
    public ResponseEntity<byte[]> getPhotoArchiveAsResponseEntity(HttpServletRequest request,
            @ApiParam("??????URL") @RequestParam(value = "url", required = true) String url) {
        if (McpString.isEmpty(url)) {
            log.debug("[NO FILE PATH] {}", url);
        } else {
            try {
                byte[] media = ImageUtil.getImageBytes(url);
                HttpHeaders headers = new HttpHeaders();
                headers.setCacheControl(CacheControl
                        .noCache()
                        .getHeaderValue());

                ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(media, headers, HttpStatus.OK);
                return responseEntity;
            } catch (Exception e) {
                log.debug("[FAIL TO FILE LOAD] {}", url);
            }
        }
        return null;
    }
}
