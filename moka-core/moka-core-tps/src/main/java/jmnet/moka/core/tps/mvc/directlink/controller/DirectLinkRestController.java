package jmnet.moka.core.tps.mvc.directlink.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
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
import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkDTO;
import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import jmnet.moka.core.tps.mvc.directlink.service.DirectLinkService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 * 바로가기관리
 * 2020. 11. 16. ssc 최초생성
 * RequestMapping 생성 규칙
 * </pre>
 *
 * @author ssc
 * @since 2020. 11. 16. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/direct-links")
@Api(tags = {"바로가기 API"})
public class DirectLinkRestController extends AbstractCommonController {

    @Value("${pds.url}")
    private String pdsUrl;

    @Value("${direct-link.save.filepath}")
    private String saveFilePath;

    @Value("${direct-link.save.default.filename}")
    private String saveDefaultFileName;

    private final DirectLinkService directLinkService;

    public DirectLinkRestController(DirectLinkService directLinkService) {
        this.directLinkService = directLinkService;
    }

    /**
     * 바로가기관리 목록 조회
     *
     * @param search 검색조건 : 사용여부, 노출고정, 링크타입
     * @return 기자목록
     */
    @ApiOperation(value = "바로가기 목록 조회")
    @GetMapping
    public ResponseEntity<?> getDirectLinkList(@Valid @SearchParam DirectLinkSearchDTO search) {

        ResultListDTO<DirectLinkDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<DirectLink> returnValue = directLinkService.findAllDirectLink(search);

        // 리턴값 설정
        List<DirectLinkDTO> directLinkList = modelMapper.map(returnValue.getContent(), DirectLinkDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(directLinkList);

        // 결과값 셋팅
        ResultDTO<ResultListDTO<DirectLinkDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 바로가기관리 조회
     *
     * @param request 요청
     * @param linkSeq 링크일련번호 (필수)
     * @return 바로가기관리정보
     * @throws NoDataException 사이트 정보가 없음
     */
    @ApiOperation(value = "바로가기 조회")
    @GetMapping("/{linkSeq}")
    public ResponseEntity<?> getDirectLink(HttpServletRequest request,
            @ApiParam("바로가기 일련번호") @PathVariable("linkSeq") @Min(value = 0, message = "{tps.direct-link.error.pattern.linkSeq}") Long linkSeq)
            throws NoDataException {

        String message = msg("tps.direct-link.error.no-data");
        DirectLink directLink = directLinkService
                .findById(linkSeq)
                .orElseThrow(() -> new NoDataException(message));
        DirectLinkDTO dto = modelMapper.map(directLink, DirectLinkDTO.class);
        tpsLogger.success(ActionType.SELECT);
        ResultDTO<DirectLinkDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 사이트등록
     *
     * @param directLinkDTO           등록할 사이트정보
     * @param directLinkThumbnailFile 등록할 사이트바로가기 이미지
     * @return 등록된 사이트정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "사이트 등록")
    @PostMapping(produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                                                                                 MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postDirectLink(@Valid DirectLinkDTO directLinkDTO,
            @ApiParam("썸네일파일") @RequestParam(value = "directLinkThumbnailFile", required = false) MultipartFile directLinkThumbnailFile)
            throws InvalidDataException, Exception {


        // 널이면 강제로 셋팅
        //if (McpString.isEmpty(directLinkDTO.getImgUrl())) {
        //    directLinkDTO.setImgUrl(pdsUrl + saveFilePath + "/" + saveDefaultFileName);
        //}

        // 데이터 유효성 검사
        //validData(directLinkThumbnailFile);

        // DirectLinkDTO -> direct link 변환
        DirectLink directLink = modelMapper.map(directLinkDTO, DirectLink.class);
        if (McpString.isNotEmpty(directLink.getLinkSeq())) { // 자동 발번이 아닌 경우 중복 체크
            if (directLinkService.isDuplicatedId(directLink.getLinkSeq())) {
                throw new InvalidDataException(msg("tps.direct-link.error.duplicate.linkSeq"));
            }
        }

        try {
            DirectLink returnValue = directLinkService.insertDirectLink(directLink);

            if (directLinkThumbnailFile != null && !directLinkThumbnailFile.isEmpty()) {
                // 이미지파일 저장(multipartFile)
                String imgUrl = directLinkService.saveImage(returnValue, directLinkThumbnailFile);
                if (McpString.isNotEmpty(imgUrl)) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                    directLink.setLinkSeq(returnValue.getLinkSeq());
                    directLink.setImgUrl(imgUrl);
                    returnValue = directLinkService.updateDirectLink(directLink);
                } else {
                    String message = msg("tps.direct-link.error.image-upload");
                    tpsLogger.fail(ActionType.INSERT, message, true);
                    // 이미지저장 실패시 오류로 처리하지 않는다. 디폴트이미지로 저장된다.
                    //                    List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();
                    //                    invalidList.add(new InvalidDataDTO("imgUrl", message));
                    //                    throw new InvalidDataException(invalidList, message);
                }
            }

            // 결과리턴
            DirectLinkDTO dto = modelMapper.map(returnValue, DirectLinkDTO.class);
            ResultDTO<DirectLinkDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.insert"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT SITE]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.direct-link.error.save"), e);
        }
    }

    /**
     * 수정
     *
     * @param linkSeq                 링크일련번호
     * @param directLinkDTO           수정할 사이트
     * @param directLinkThumbnailFile 등록할 사이트바로가기 이미지
     * @return 수정된 사이트정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "사이트정보 수정")
    @PutMapping(value = "/{linkSeq}", produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                                                                                                      MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putDirectLink(
            @ApiParam("바로가기 일련번호") @PathVariable("linkSeq") @Min(value = 0, message = "{tps.direct-link.error.pattern.linkSeq}") Long linkSeq,
            @Valid DirectLinkDTO directLinkDTO,
            @ApiParam("썸네일파일") @RequestParam(value = "directLinkThumbnailFile", required = false) MultipartFile directLinkThumbnailFile)
            throws Exception {


        // 널이면 강제로 셋팅
        //if (McpString.isEmpty(directLinkDTO.getImgUrl())) {
        //    directLinkDTO.setImgUrl(pdsUrl + saveFilePath + "/" + saveDefaultFileName);
        //}

        // DirectLinkDTO -> DirectLink 변환
        DirectLink newDirectLink = modelMapper.map(directLinkDTO, DirectLink.class);
        newDirectLink.setLinkSeq(linkSeq);
        DirectLink orgDirectLink = directLinkService
                .findById(newDirectLink.getLinkSeq())
                .orElseThrow(() -> {
                    String message = msg("tps.direct-link.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });


        try {
            /*
             * 이미지 파일 저장 새로운 파일이 있으면 기존 파일을 덮어쓰기 한다.
             */
            if (directLinkThumbnailFile != null && !directLinkThumbnailFile.isEmpty()) {
                // 새로운 이미지 저장
                String imgUrl = directLinkService.saveImage(newDirectLink, directLinkThumbnailFile);
                if (McpString.isNotEmpty(imgUrl)) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                    // 이미지 파일명 수정
                    newDirectLink.setImgUrl(imgUrl);
                } else {
                    String message = msg("tps.direct-link.error.image-upload");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    // 이미지저장 실패시 오류로 처리하지 않는다. 디폴트이미지로 저장된다.
                    //                    List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();
                    //                    invalidList.add(new InvalidDataDTO("imgUrl", message));
                    //                    throw new InvalidDataException(invalidList, message);
                }
            }
            // update
            DirectLink returnValue = directLinkService.updateDirectLink(newDirectLink);

            // 결과리턴
            DirectLinkDTO dto = modelMapper.map(returnValue, DirectLinkDTO.class);
            String message = msg("tps.direct-link.success.update");
            ResultDTO<DirectLinkDTO> resultDto = new ResultDTO<>(dto, message);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE DirectLink] seq: {} {}", directLinkDTO.getLinkSeq(), e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE DirectLink]", e, true);
            throw new Exception(msg("tps.direct-link.error.save"), e);
        }
    }

    /**
     * 사이트 내 속한 멤버 존재 여부
     *
     * @param linkSeq 링크일련번호
     * @return 관련아이템 존재 여부
     */
    @ApiOperation(value = "사이트 내 속한 멤버 존재 여부")
    @GetMapping("/{linkSeq}/has-members")
    public ResponseEntity<?> hasMembers(
            @ApiParam("바로가기 일련번호") @PathVariable("linkSeq") @Min(value = 0, message = "{tps.direct-link.error.pattern.linkSeq}") Long linkSeq) {

        boolean exists = directLinkService.hasMembers(linkSeq);
        String message = exists ? msg("tps.direct-link.success.select.exist-member") : "";

        // 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<>(exists, message);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 삭제
     *
     * @param request 요청
     * @param linkSeq 삭제 할 링크일련번호 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 사이트정보 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "바로가기 삭제")
    @DeleteMapping("/{linkSeq}")
    public ResponseEntity<?> deleteDirectLink(HttpServletRequest request,
            @ApiParam("바로가기 일련번호") @PathVariable("linkSeq") @Min(value = 0, message = "{tps.direct-link.error.pattern.linkSeq}") Long linkSeq)
            throws InvalidDataException, NoDataException, Exception {


        // 그룹 데이터 조회
        String noContentMessage = msg("tps.direct-link.error.no-data");
        DirectLink member = directLinkService
                .findById(linkSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // 삭제
            directLinkService.deleteDirectLink(member);

            // 이미지 있으면 이미지도
            if (McpString.isNotEmpty(member.getImgUrl())) {
                if (directLinkService.deleteImage(member)) {
                    tpsLogger.success(ActionType.FILE_DELETE, true);
                } else {
                    tpsLogger.fail(ActionType.FILE_DELETE, msg("tps.direct-link.error.image-delete"), true);
                }
            }

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            String message = msg("tps.direct-link.success.delete");
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE DIRECT_LINK] linkSeq: {} {}", linkSeq, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.direct-link.error.delete"), e);
        }
    }

    /**
     * 바로가기관리 데이터 유효성 검사
     *
     * @param file 바로가기관리 이미지
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
