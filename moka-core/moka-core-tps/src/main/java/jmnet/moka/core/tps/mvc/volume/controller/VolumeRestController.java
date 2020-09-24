package jmnet.moka.core.tps.mvc.volume.controller;

import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.RelationHelper;
import jmnet.moka.core.tps.mvc.volume.dto.VolumeDTO;
import jmnet.moka.core.tps.mvc.volume.dto.VolumeSearchDTO;
import jmnet.moka.core.tps.mvc.volume.entity.Volume;
import jmnet.moka.core.tps.mvc.volume.service.VolumeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import java.security.Principal;
import java.util.List;

/**
 * <pre>
 * 볼륨 API
 * 2020. 1. 16. ssc 최초생성
 * </pre>
 *
 * @since 2020. 1. 16. 오후 2:07:40
 * @author ssc
 */
@RestController
@Validated
@RequestMapping("/api/volumes")
public class VolumeRestController {

    @Autowired
    private RelationHelper relationHelper;

    @Autowired
    private VolumeService volumeService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    /**
     * <pre>
     * 볼륨목록조회
     * </pre>
     *
     * @param request 요청
     * @param search 검색조건 page : 페이지번호, 기본값 1 count : 페이지사이즈, 기본값 20
     * @return 볼륨목록
     */
    @GetMapping
    public ResponseEntity<?> getVolumeList(HttpServletRequest request,
            @Valid @SearchParam VolumeSearchDTO search) {
        // 페이징조건 설정
        Pageable pageable = search.getPageable();

        // 조회
        Page<Volume> returnValue = volumeService.findList(search, pageable);

        // 리턴값 설정
        ResultListDTO<VolumeDTO> resultListMessage = new ResultListDTO<VolumeDTO>();
        List<VolumeDTO> volumeDtoList = modelMapper.map(returnValue.getContent(), VolumeDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(volumeDtoList);

        ResultDTO<ResultListDTO<VolumeDTO>> resultDto =
                new ResultDTO<ResultListDTO<VolumeDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * <pre>
     * 볼륨 정보 조회
     * </pre>
     *
     * @param request HTTP요청
     * @param volumeId 볼륨ID
     * @return 볼륨
     * @throws NoDataException 데이터없음 예외처리
     */
    @GetMapping("/{volumeId}")
    public ResponseEntity<?> getVolume(HttpServletRequest request,
            @PathVariable("volumeId") @Pattern(regexp = ".{0}|(^[A-Z]{2}$)",
                    message = "{tps.volume.error.invalid.volumeId}") String volumeId)
            throws NoDataException {

        String message = messageByLocale.get("tps.volume.error.noContent", request);

        // 조회
        Volume volume =
                volumeService.findVolume(volumeId).orElseThrow(() -> new NoDataException(message));

        VolumeDTO volumeDTO = modelMapper.map(volume, VolumeDTO.class);

        ResultDTO<VolumeDTO> resultDTO = new ResultDTO<VolumeDTO>(volumeDTO);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 볼륨 등록
     * </pre>
     *
     * @param request HTTP요청
     * @param volumeDTO 등록할 볼륨
     * @param principal Principal
     * @return 등록된 볼륨
     * @throws InvalidDataException 유효성 검사
     */
    @PostMapping()
    public ResponseEntity<?> postVolume(HttpServletRequest request, @Valid VolumeDTO volumeDTO,
            Principal principal) throws InvalidDataException {

        // 등록
        volumeDTO.setVolumeId(this.createVolumeId());
        Volume volume = modelMapper.map(volumeDTO, Volume.class);
        volume.setCreateYmdt(McpDate.nowStr());
        volume.setCreator(principal.getName());
        VolumeDTO returnVal = modelMapper.map(volumeService.insertVolume(volume), VolumeDTO.class);

        ResultDTO<VolumeDTO> resultDTO = new ResultDTO<VolumeDTO>(returnVal);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 볼륨ID 생성
     * </pre>
     *
     * @return 새로운 볼륨ID
     */
    private String createVolumeId() {
        String latestId = volumeService.getLatestVolumeId();
        char[] varr = new StringBuilder(latestId).reverse().toString().toCharArray();
        varr = this.getChar(varr, 0);
        return new StringBuilder(String.valueOf(varr)).reverse().toString();
    }

    private char[] getChar(char[] arr, int i) {
        if (arr[i] + 1 > 'Z') {
            arr[i] = 'A';
            arr = getChar(arr, i + 1);
        } else {
            arr[i] = (char) (arr[i] + 1);
        }
        return arr;
    }

    /**
     * <pre>
     * 볼륨 수정
     * </pre>
     *
     * @param request HTTP요청
     * @param volumeId 볼륨ID
     * @param volumeDTO 수정할 볼륨
     * @param principal Principal
     * @return 수정된 볼륨
     * @throws InvalidDataException 유효성 검사
     * @throws NoDataException 데이터없음 예외처리
     */
    @PutMapping("/{volumeId}")
    public ResponseEntity<?> putVolume(HttpServletRequest request,
            @PathVariable("volumeId") @Pattern(regexp = ".{0}|(^[A-Z]{2}$)",
                    message = "{tps.volume.error.invalid.volumeId}") String volumeId,
            @Valid VolumeDTO volumeDTO, Principal principal)
            throws InvalidDataException, NoDataException {

        // 수정
        String message = messageByLocale.get("tps.volume.error.noContent", request);
        Volume newVolume = modelMapper.map(volumeDTO, Volume.class);
        Volume orgVolume =
                volumeService.findVolume(volumeId).orElseThrow(() -> new NoDataException(message));

        newVolume.setCreateYmdt(orgVolume.getCreateYmdt());
        newVolume.setCreator(orgVolume.getCreator());
        newVolume.setModifiedYmdt(McpDate.nowStr());
        newVolume.setModifier(principal.getName());

        VolumeDTO returnVal =
                modelMapper.map(volumeService.updateVolume(newVolume), VolumeDTO.class);

        ResultDTO<VolumeDTO> resultDTO = new ResultDTO<VolumeDTO>(returnVal);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 관련 아이템이 있는지 조사
     *
     * @param request HTTP요청
     * @param volumeId 볼륨아이디
     * @return 관련아이템여부
     */
    @GetMapping("/{volumeId}/hasRelations")
    public ResponseEntity<?> hasRelations(HttpServletRequest request,
            @PathVariable("volumeId") @Pattern(regexp = ".{0}|(^[A-Z]{2}$)",
                    message = "{tps.volume.error.invalid.volumeId}") String volumeId) {

        // 관련 아이템이 있는지 조사
//        boolean isRelated = relationHelper.isRelatedVolume(volumeId);

        ResultDTO<Boolean> resultDTO = new ResultDTO<>(false);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 볼륨 삭제
     * </pre>
     *
     * @param request HTTP요청
     * @param volumeId 볼륨ID
     * @return 삭제 여부
     * @throws NoDataException 데이터없음 예외처리
     */
    @DeleteMapping("/{volumeId}")
    public ResponseEntity<?> deleteVolume(HttpServletRequest request,
            @PathVariable("volumeId") @Pattern(regexp = ".{0}|(^[A-Z]{2}$)",
                    message = "{tps.volume.error.invalid.volumeId}") String volumeId)
            throws NoDataException {

        // 데이터 확인
        String message = messageByLocale.get("tps.volume.error.noContent", request);
        Volume volume =
                volumeService.findVolume(volumeId).orElseThrow(() -> new NoDataException(message));

        // 데이터 삭제
        volumeService.deleteVolume(volume);

        ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
}
