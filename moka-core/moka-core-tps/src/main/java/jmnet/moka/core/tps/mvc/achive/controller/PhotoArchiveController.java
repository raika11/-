package jmnet.moka.core.tps.mvc.achive.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.achive.dto.PhotoArchiveDTO;
import jmnet.moka.core.tps.mvc.achive.dto.PhotoArchiveSearchDTO;
import jmnet.moka.core.tps.mvc.achive.service.PhotoArchiveService;
import jmnet.moka.core.tps.mvc.achive.vo.OriginCodeVO;
import jmnet.moka.core.tps.mvc.achive.vo.PhotoArchiveVO;
import jmnet.moka.core.tps.mvc.achive.vo.PhotoTypeVO;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
public class PhotoArchiveController extends AbstractCommonController {

    private final PhotoArchiveService photoArchiveService;

    public PhotoArchiveController(PhotoArchiveService photoArchiveService) {
        this.photoArchiveService = photoArchiveService;
    }

    /**
     * 포토 아카이브 사진 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "포토 아카이브 사진 목록 조회")
    @GetMapping
    public ResponseEntity<?> getPhotoArchiveList(@SearchParam PhotoArchiveSearchDTO search, @NotNull Principal principal) {

        ResultListDTO<PhotoArchiveVO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<PhotoArchiveVO> returnValue = photoArchiveService.findAllPhotoArchive(search, principal.getName());
        List<PhotoArchiveVO> resultDTOs = modelMapper.map(returnValue.getContent(), PhotoArchiveDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(resultDTOs);

        ResultDTO<ResultListDTO<PhotoArchiveVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 포토 아카이브 사진 목록 조회
     *
     * @param photoId 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "포토 아카이브 사진 정보 조회")
    @GetMapping("/{photoId}")
    public ResponseEntity<?> getPhotoArchive(
            @PathVariable(value = "photoId", required = true) @Size(message = "{tps.photo-archive.error.pattern.photoId}") String photoId,
            @NotNull Principal principal)
            throws NoDataException {

        // 조회
        String message = msg("tps.common.error.no-data");
        PhotoArchiveVO returnValue = photoArchiveService
                .findPhotoArchiveById(photoId, principal.getName())
                .orElseThrow(() -> {
                    return new NoDataException(message);
                });
        PhotoArchiveDTO resultDTO = modelMapper.map(returnValue, PhotoArchiveDTO.class);

        ResultDTO<PhotoArchiveDTO> resultDto = new ResultDTO<>(resultDTO);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 포토 아카이브 출처 목록 조회
     *
     * @param menuNo 메뉴 코드
     * @return 검색 결과
     */
    @ApiOperation(value = "포토 아카이브 출처 목록 조회")
    @GetMapping("/origins")
    public ResponseEntity<?> getPhotoOriginList(@RequestParam(value = "menuNo", required = true)
    @Pattern(regexp = "[0-9]{3}$", message = "{tps.domain.error.pattern.domainId}") String menuNo, @NotNull Principal principal) {

        ResultListDTO<OriginCodeVO> resultListMessage = new ResultListDTO<>();

        // 조회
        List<OriginCodeVO> returnValue = photoArchiveService.findAllPhotoOrigin(menuNo, principal.getName());
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(returnValue);

        ResultDTO<ResultListDTO> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 포토 사진 유형 목록 조회
     *
     * @return 검색 결과
     */
    @ApiOperation(value = "포토 사진 유형 목록 조회")
    @GetMapping("/types")
    public ResponseEntity<?> getPhotoTypeList(@NotNull Principal principal) {

        ResultListDTO<PhotoTypeVO> resultListMessage = new ResultListDTO<>();

        // 조회
        List<PhotoTypeVO> returnValue = photoArchiveService.findAllPhotoType(principal.getName());
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(returnValue);

        ResultDTO<ResultListDTO> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
