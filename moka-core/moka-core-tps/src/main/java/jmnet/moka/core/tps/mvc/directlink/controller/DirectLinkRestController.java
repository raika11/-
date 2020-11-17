package jmnet.moka.core.tps.mvc.directlink.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkDTO;
import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import jmnet.moka.core.tps.mvc.directlink.service.DirectLinkService;
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
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * <pre>
 * 기자관리
 * 2020. 11. 16. ssc 최초생성
 * RequestMapping 생성 규칙
 * RESTful 방식에 소문자만 허용하고 단어 사이 구분이 필요한 경우 '-' 사용
 * 메소드 생성 규칙
 * 목록 조회 : get{Target}List, HttpMethod = GET
 * 조회 : get{Target}, HttpMethod = GET
 * 저장  : post{Target}, HttpMethod = POST
 * 수정  : put{Target}, HttpMethod = PUT
 * 삭제  : delete{Target}, HttpMethod = DELETE
 * 사이트내멤버조회 : get{Target}, HttpMethod = GET
 * </pre>
 *
 * @author ssc
 * @since 2020. 11. 16. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/direct-links")
public class DirectLinkRestController {

    private final DirectLinkService directLinkService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final TpsLogger tpsLogger;

    public DirectLinkRestController(DirectLinkService directLinkService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger) {
        this.directLinkService = directLinkService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * 사이트관리 목록 조회
     *
     * @param search 검색조건 : 사용여부, 노출고정, 링크타입
     * @return 기자목록
     */
    @ApiOperation(value = "사이트관리 목록 조회")
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
     * 사이트관리 조회
     *
     * @param request  요청
     * @param linkSeq 링크일련번호 (필수)
     * @return 사이트관리정보
     * @throws NoDataException 사이트 정보가 없음
     */
    @ApiOperation(value = "사이트관리 조회")
    @GetMapping("/{linkSeq}")
    public ResponseEntity<?> getDirectLink(HttpServletRequest request
            , @PathVariable("linkSeq") @Pattern(regexp = "[0-9]{5}$"
                    , message = "{tps.direct-link.error.pattern.linkSeq}") String linkSeq)
            throws NoDataException {

        String message = messageByLocale.get("tps.direct-link.error.no-data", request);
        DirectLink directLink = directLinkService.findById(linkSeq).orElseThrow(() -> new NoDataException(message));
        DirectLinkDTO dto = modelMapper.map(directLink, DirectLinkDTO.class);
        tpsLogger.success(ActionType.SELECT);
        ResultDTO<DirectLinkDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 사이트등록
     *
     * @param directLinkDTO 등록할 사이트정보
     * @param directLinkThumbnailFile 등록할 사이트바로가기 이미지
     * @return 등록된 사이트정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "사이트 등록")
    @PostMapping(produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}
    , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postDirectLink(@Valid DirectLinkDTO directLinkDTO
            ,@RequestPart(value = "http://localhost:8100/swagger-ui.html", required = false)
            MultipartFile directLinkThumbnailFile
    )throws InvalidDataException, Exception {

        // 데이터 유효성 검사
        //validData(directLinkDTO, directLinkThumbnailFile, ActionType.INSERT);

        // DirectLinkDTO -> directlink 변환
        DirectLink directLink = modelMapper.map(directLinkDTO, DirectLink.class);
        if (McpString.isNotEmpty(directLink.getLinkSeq())) { // 자동 발번이 아닌 경우 중복 체크
            if (directLinkService.isDuplicatedId(directLink.getLinkSeq())) {
                throw new InvalidDataException(messageByLocale.get("tps.direct-link.error.duplicate.linkSeq"));
            }
        }

        try {
            // 등록(이미지 등록에 seq가 필요해서 먼저 저장)
            DirectLink returnValue = directLinkService.insertDirectLink(directLink);

//            if (directLinkThumbnailFile != null && !directLinkThumbnailFile.isEmpty()) {
//                // 이미지파일 저장(multipartFile)
//                String imgPath = directLinkService.saveImage(returnValue, directLinkThumbnailFile);
//                tpsLogger.success(ActionType.UPLOAD, true);
//
//                directLinkDTO.setImgUrl(imgPath);
//                returnValue = directLinkService.updateDirectLink(directLink);
//            }

            // 결과리턴
            DirectLinkDTO dto = modelMapper.map(returnValue, DirectLinkDTO.class);
            ResultDTO<DirectLinkDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT SITE]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(messageByLocale.get("tps.direct-link.error.save"), e);
        }
    }

    /**
     * 수정
     *
     * @param linkSeq  링크일련번호
     * @param directLinkDTO 수정할 사이트
     * @param directLinkThumbnailFile 등록할 사이트바로가기 이미지
     * @return 수정된 사이트정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "사이트정보 수정")
    @PutMapping(value = "/{linkSeq}"
            //, produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}
    , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}
            //,MediaType.APPLICATION_JSON_UTF8_VALUE}
            )
    public ResponseEntity<?> putDirectLink(@PathVariable("linkSeq") @Size(min = 1, max = 5, message = "{tps.direct-link.error.pattern.linkSeq}") String linkSeq,
                                       @Valid DirectLinkDTO directLinkDTO,
                                       @ApiParam(value = "directLinkThumbnailFile")
                                       @RequestPart(value = "directLinkThumbnailFile", required = false)
                                                       MultipartFile directLinkThumbnailFile)
            throws Exception {

        // DirectLinkDTO -> DirectLink 변환
        DirectLink newDirectLink = modelMapper.map(directLinkDTO, DirectLink.class);

        DirectLink orgDirectLink = directLinkService.findById(newDirectLink.getLinkSeq()).orElseThrow(() -> {
            String message = messageByLocale.get("tps.direct-link.error.no-data");
            tpsLogger.fail(ActionType.UPDATE, message, true);
            return new NoDataException(message);
        });


        try {

            /*
             * 이미지 파일 저장 새로운 파일이 있으면 기존 파일이 있으면 삭제하고 새 파일을 저장한다.
             */
            System.out.println("debug::" + directLinkThumbnailFile);


//            if (directLinkThumbnailFile != null && !directLinkThumbnailFile.isEmpty()) {
//
//                // 기존이미지 삭제
//                if (McpString.isNotEmpty(orgDirectLink.getImgUrl())) {
//                    directLinkService.deleteImage(orgDirectLink);
//                    tpsLogger.success(ActionType.FILE_DELETE, true);
//                }
//                // 새로운 이미지 저장
//                String imgPath = directLinkService.saveImage(newDirectLink, directLinkThumbnailFile);
//                tpsLogger.success(ActionType.UPLOAD, true);
//
//                // 이미지 파일명 수정
//                newDirectLink.setImgUrl(imgPath);
//            }

            // update
            DirectLink returnValue = directLinkService.updateDirectLink(newDirectLink);

            // 결과리턴
            DirectLinkDTO dto = modelMapper.map(returnValue, DirectLinkDTO.class);
            String message = messageByLocale.get("tps.direct-link.success.update");
            ResultDTO<DirectLinkDTO> resultDto = new ResultDTO<DirectLinkDTO>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE DirectLink] seq: {} {}", directLinkDTO.getLinkSeq(),  e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE DirectLink]", e, true);
            throw new Exception(messageByLocale.get("tps.direct-link.error.save"), e);
        }
    }

    /**
     * 사이트 내 속한 멤버 존재 여부
     *
     * @param request HTTP요청
     * @param linkSeq 링크일련번호
     * @return 관련아이템 존재 여부
     * @throws NoDataException 데이터없음 예외처리
     */
    @ApiOperation(value = "사이트 내 속한 멤버 존재 여부")
    @GetMapping("/{linkSeq}/has-members")
    public ResponseEntity<?> hasMembers(HttpServletRequest request,
                                        @PathVariable("linkSeq")
                                        @Size(min = 1, max = 5,
                                                message = "{tps.direct-link.error.pattern.linkSeq}") String linkSeq)
            throws NoDataException {

        boolean exists = directLinkService.hasMembers(linkSeq);
        String message = exists ? messageByLocale.get("tps.common.success.select.exist-member") : "";

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
    @ApiOperation(value = "그룹 삭제")
    @DeleteMapping("/{linkSeq}")
    public ResponseEntity<?> deleteDirectLink(HttpServletRequest request,
                                         @PathVariable("linkSeq")
                                         @Size(min = 1, max = 5,
                                         message = "{tps.direct-link.error.pattern.linkSeq}") String linkSeq)
            throws InvalidDataException, NoDataException, Exception {


        // 그룹 데이터 조회
        String noContentMessage = messageByLocale.get("tps.direct-link.error.no-data", request);
        DirectLink member = directLinkService.findById(linkSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // 삭제
            directLinkService.deleteDirectLink(member);

            // 이미지 있으면 이미지도
//            if (McpString.isNotEmpty(member.getImgUrl())) {
//                directLinkService.deleteImage(member);
//                tpsLogger.success(ActionType.FILE_DELETE, true);
//            }

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            String message = messageByLocale.get("tps.direct-link.success.delete");
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE DIRECT_LINK] linkSeq: {} {}", linkSeq, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(messageByLocale.get("tps.direct-link.error.delete", request), e);
        }
    }

    /**
     * 템플릿 데이터 유효성 검사
     *
     * @param template              템플릿정보
     * @param templateThumbnailFile 템플릿썸네일파일
     * @param actionType            작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성 오류
     * @throws Exception            예외
     */
//    private void validData(DirectLink directLink, MultipartFile templateThumbnailFile, ActionType actionType)
//            throws InvalidDataException, Exception {
//        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();
//
//        if (directLink != null) {
//            // 문법검사
//            try {
//                if (McpString.isNotEmpty(template.getTemplateBody())) {
//                    TemplateParserHelper.checkSyntax(template.getTemplateBody());
//                }
//            } catch (TemplateParseException e) {
//                String message = e.getMessage();
//                String extra = Integer.toString(e.getLineNumber());
//                invalidList.add(new InvalidDataDTO("templateBody", message, extra));
//                tpsLogger.fail(actionType, message, true);
//            } catch (Exception e) {
//                String message = e.getMessage();
//                invalidList.add(new InvalidDataDTO("templateBody", message));
//                tpsLogger.fail(actionType, message, true);
//            }
//            // 등록한 파일이 이미지 파일인지 체크
//            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {
//                boolean isImage = ImageUtil.isImage(templateThumbnailFile);
//                if (!isImage) {
//                    String message = messageByLocale.get("tps.template.error.onlyimage.thumbnail");
//                    invalidList.add(new InvalidDataDTO("thumbnail", message));
//                    tpsLogger.fail(actionType, message, true);
//                }
//            }
//        }
//
//        if (invalidList.size() > 0) {
//            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
//            throw new InvalidDataException(invalidList, validMessage);
//        }
//    }
}
