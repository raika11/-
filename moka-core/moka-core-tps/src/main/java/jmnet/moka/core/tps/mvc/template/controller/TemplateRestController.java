package jmnet.moka.core.tps.mvc.template.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import jmnet.moka.core.tps.mvc.relation.service.RelationService;
import jmnet.moka.core.tps.mvc.template.dto.TemplateDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import lombok.extern.slf4j.Slf4j;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 템플릿 API
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/templates")
@Api(tags = {"템플릿 API"})
public class TemplateRestController extends AbstractCommonController {

    private final TemplateService templateService;

    private final RelationService relationService;

    private final PurgeHelper purgeHelper;

    private final UploadFileHelper uploadFileHelper;

    public TemplateRestController(TemplateService templateService, RelationService relationService, PurgeHelper purgeHelper,
            UploadFileHelper uploadFileHelper) {
        this.templateService = templateService;
        this.relationService = relationService;
        this.purgeHelper = purgeHelper;
        this.uploadFileHelper = uploadFileHelper;
    }

    /**
     * 템플릿 목록조회
     *
     * @param search 검색조건
     * @return 템플릿 목록
     */
    @ApiOperation(value = "템플릿 목록조회")
    @GetMapping
    public ResponseEntity<?> getTemplateList(@Valid @SearchParam TemplateSearchDTO search) {

        // 조회(mybatis)
        List<TemplateVO> returnValue = templateService.findAllTemplate(search);

        ResultListDTO<TemplateVO> resultList = new ResultListDTO<TemplateVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<TemplateVO>> resultDTO = new ResultDTO<ResultListDTO<TemplateVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 템플릿 상세조회
     *
     * @param templateSeq 템플릿번호 (필수)
     * @return 템플릿
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "템플릿 상세조회")
    @GetMapping("/{templateSeq}")
    public ResponseEntity<?> getTemplate(
            @ApiParam("템플릿SEQ(필수)") @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq)
            throws NoDataException {

        Template template = templateService
                .findTemplateBySeq(templateSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        TemplateDTO templateDTO = modelMapper.map(template, TemplateDTO.class);

        ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(templateDTO);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 템플릿 등록
     *
     * @param templateDTO           템플릿DTO
     * @param templateThumbnailFile 템플릿썸네일파일
     * @return 템플릿
     * @throws InvalidDataException 데이터유효성에러
     * @throws Exception            썸네일 저장 실패, 템플릿오류 그외 모든 에러
     */
    @ApiOperation(value = "템플릿 등록")
    @PostMapping(produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                                                                                 MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postTemplate(@Valid TemplateDTO templateDTO,
            @ApiParam("템플릿 미리보기 이미지파일") @RequestPart(value = "templateThumbnailFile", required = false) MultipartFile templateThumbnailFile)
            throws InvalidDataException, Exception {

        // 데이터 유효성 검사
        validData(templateDTO, templateThumbnailFile, ActionType.INSERT);

        Template template = modelMapper.map(templateDTO, Template.class);

        try {
            // 등록(이미지 등록에 seq가 필요해서 템플릿을 먼저 저장함)
            Template returnVal = templateService.insertTemplate(template);

            // 이미지등록
            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {
                // 이미지파일 저장(multipartFile)
                String imgPath = templateService.saveTemplateImage(returnVal, templateThumbnailFile);
                tpsLogger.success(ActionType.UPLOAD, true);
                returnVal.setTemplateThumb(imgPath);

                // 썸네일경로 업데이트(히스토리 생성X)
                returnVal = templateService.updateTemplate(returnVal, false);

            } else if (McpString.isNotEmpty(templateDTO.getTemplateThumb())) {
                /*
                 * 파일은 없는데 이미지 url이 있는 경우 ===> 파일을 복사한다!
                 */
                String targetImg = uploadFileHelper.getRealPathByDB(templateDTO.getTemplateThumb());
                String imgPath = templateService.copyTemplateImage(returnVal, targetImg);
                tpsLogger.success(ActionType.FILE_COPY, true);
                returnVal.setTemplateThumb(imgPath);

                // 썸네일경로 업데이트(히스토리 생성X)
                returnVal = templateService.updateTemplate(returnVal, false);
            }

            TemplateDTO returnValDTO = modelMapper.map(returnVal, TemplateDTO.class);


            String message = msg("tps.common.success.insert");
            ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT TEMPLATE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT TEMPLATE]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * 템플릿 수정
     *
     * @param templateDTO           템플릿DTO
     * @param templateThumbnailFile 템플릿썸네일파일
     * @return 템플릿
     * @throws NoDataException      데이터없음
     * @throws InvalidDataException 데이터 유효성검사 에러
     * @throws Exception            썸네일 저장 실패, 템플릿오류 그외 모든 에러
     */
    @ApiOperation(value = "템플릿 수정")
    @PutMapping(value = "/{templateSeq}", produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                                                                                                          MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putTemplate(@Valid TemplateDTO templateDTO,
            @ApiParam("템플릿 미리보기 이미지파일") @RequestPart(value = "templateThumbnailFile", required = false) MultipartFile templateThumbnailFile)
            throws NoDataException, InvalidDataException, Exception {

        // 데이터 검사
        validData(templateDTO, templateThumbnailFile, ActionType.UPDATE);

        Template newTemplate = modelMapper.map(templateDTO, Template.class);
        Template orgTemplate = templateService
                .findTemplateBySeq(templateDTO.getTemplateSeq())
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });

        //        newTemplate.setRegDt(orgTemplate.getRegDt());
        //        newTemplate.setRegId(orgTemplate.getRegId());
        //        newTemplate.setModDt(McpDate.now());
        //        newTemplate.setModId(principal.getName());
        //        if (newTemplate.getTemplateBody() == null) {
        //            newTemplate.setTemplateBody("");
        //        }

        try {
            /*
             * 이미지 파일 저장 새로운 파일이 있으면 기존 파일이 있으면 삭제하고 새 파일을 저장한다.
             * 새로운 파일이 없는데 기존 파일이 있으면 기존 파일을 삭제한다
             */
            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {

                // 기존이미지 삭제
                if (McpString.isNotEmpty(orgTemplate.getTemplateThumb())) {
                    templateService.deleteTemplateImage(orgTemplate);
                    tpsLogger.success(ActionType.FILE_DELETE, true);
                }
                // 새로운 이미지 저장
                String imgPath = templateService.saveTemplateImage(newTemplate, templateThumbnailFile);
                tpsLogger.success(ActionType.UPLOAD, true);

                // 이미지 파일명 수정
                newTemplate.setTemplateThumb(imgPath);

            } else if (McpString.isNotEmpty(orgTemplate.getTemplateThumb()) && McpString.isEmpty(newTemplate.getTemplateThumb())) {
                templateService.deleteTemplateImage(orgTemplate);
                tpsLogger.success(ActionType.FILE_DELETE, true);
            }

            // 수정 (템플릿바디가 변경되었을 때만 히스토리를 생성한다)
            Template returnVal;
            if (orgTemplate.getTemplateBody() != null && orgTemplate
                    .getTemplateBody()
                    .equals(newTemplate.getTemplateBody())) {
                returnVal = templateService.updateTemplate(newTemplate, false);
            } else {
                returnVal = templateService.updateTemplate(newTemplate);
            }
            TemplateDTO returnValDTO = modelMapper.map(returnVal, TemplateDTO.class);

            //            if (McpString.isNotEmpty(returnValDTO.getTemplateThumb())) {
            //                returnValDTO.setTemplateThumb(templateImagePrefix + returnValDTO.getTemplateThumb());
            //            }

            // purge 날림!!  성공실패여부는 리턴하지 않는다.
            purge(returnValDTO);

            String message = msg("tps.common.success.update");
            ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE TEMPLATE] seq: {} {}", templateDTO.getTemplateSeq(), e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE TEMPLATE]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    /**
     * 템플릿 복사
     *
     * @param templateSeq  템플릿SEQ
     * @param domain       도메인DTO
     * @param templateName 템플릿명
     * @return 복사한 데이터
     * @throws InvalidDataException 데이터유효성검사 예외
     * @throws Exception            그외 예외
     */
    @ApiOperation(value = "템플릿 복사")
    @PostMapping("/{templateSeq}/copy")
    public ResponseEntity<?> copyTemplate(
            @ApiParam("템플릿SEQ(필수)") @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq,
            @ApiParam("도메인(필수)") DomainSimpleDTO domain, @ApiParam("복사할 템플릿명(필수)") String templateName)
            throws InvalidDataException, Exception {

        // 조회
        Template template = templateService
                .findTemplateBySeq(templateSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.INSERT, message, true);
                    return new NoDataException(message);
                });

        TemplateDTO templateDTO = modelMapper.map(template, TemplateDTO.class);
        templateDTO.setTemplateSeq(null);
        templateDTO.setTemplateName(templateName);
        templateDTO.setDomain(domain);

        return this.postTemplate(templateDTO, null);
    }

    /**
     * 템플릿 삭제
     *
     * @param templateSeq 템플릿SEQ
     * @return 템플릿 삭제 여부
     * @throws NoDataException 데이터없음
     * @throws Exception       관련아이템 있으면 삭제 불가능, 그외 에러
     */
    @ApiOperation(value = "템플릿 삭제")
    @DeleteMapping("/{templateSeq}")
    public ResponseEntity<?> deleteTemplate(
            @ApiParam("템플릿SEQ(필수)") @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq)
            throws NoDataException, Exception {

        // 데이타 확인
        Template template = templateService
                .findTemplateBySeq(templateSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        // 관련 데이터 확인
        Boolean hasRels = relationService.hasRelations(templateSeq, MokaConstants.ITEM_TEMPLATE);
        if (hasRels) {
            String relMessage = msg("tps.common.error.delete.related");
            tpsLogger.fail(ActionType.DELETE, relMessage, true);
            throw new Exception(relMessage);
        }

        try {
            TemplateDTO templateDTO = modelMapper.map(template, TemplateDTO.class);

            // 템플릿 삭제
            templateService.deleteTemplate(template);

            // 썸네일 파일 삭제
            if (McpString.isNotEmpty(template.getTemplateThumb())) {
                templateService.deleteTemplateImage(template);
                tpsLogger.success(ActionType.FILE_DELETE, true);
            }

            // purge 날림!!  성공실패여부는 리턴하지 않는다.
            purge(templateDTO);

            String message = msg("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE TEMPLATE] seq: {} {}", templateSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE TEMPLATE]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }

    /**
     * 관련 아이템 존재여부
     *
     * @param templateSeq 템플릿SEQ
     * @return 관련 아이템 존재 여부
     * @throws NoDataException 데이터없음
     * @throws Exception       관련아이템 조회 에러
     */
    @ApiOperation(value = "관련 아이템 존재여부")
    @GetMapping("/{templateSeq}/has-relations")
    public ResponseEntity<?> hasRelationList(
            @ApiParam("템플릿SEQ(필수)") @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq)
            throws Exception {

        // 템플릿 확인
        templateService
                .findTemplateBySeq(templateSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        try {
            Boolean chkRels = relationService.hasRelations(templateSeq, MokaConstants.ITEM_TEMPLATE);

            String message = "";
            if (chkRels) {
                message = msg("tps.common.success.has-relations");
            }
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[TEMPLATE RELATION EXISTENCE CHECK FAILED] seq: {} {}", templateSeq, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[TEMPLATE RELATION EXISTENCE CHECK FAILEDE]", e, true);
            throw new Exception(msg("tps.common.error.has-relation"), e);
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
    private void validData(TemplateDTO template, MultipartFile templateThumbnailFile, ActionType actionType)
            throws InvalidDataException, Exception {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (template != null) {
            // 문법검사
            try {
                if (McpString.isNotEmpty(template.getTemplateBody())) {
                    TemplateParserHelper.checkSyntax(template.getTemplateBody());
                }
            } catch (TemplateParseException e) {
                String message = e.getMessage();
                String extra = Integer.toString(e.getLineNumber());
                invalidList.add(new InvalidDataDTO("templateBody", message, extra));
                tpsLogger.fail(actionType, message, true);
            } catch (Exception e) {
                String message = e.getMessage();
                invalidList.add(new InvalidDataDTO("templateBody", message));
                tpsLogger.fail(actionType, message, true);
            }
            // 등록한 파일이 이미지 파일인지 체크
            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {
                boolean isImage = ImageUtil.isImage(templateThumbnailFile);
                if (!isImage) {
                    String message = msg("tps.template.error.onlyimage.thumbnail");
                    invalidList.add(new InvalidDataDTO("thumbnail", message));
                    tpsLogger.fail(actionType, message, true);
                }
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = msg("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * tms서버의 템플릿정보를 갱신한다. 해당 템플릿과 관련된 fileYn=Y인 페이지도 갱신한다.
     *
     * @param returnValDTO 템플릿정보
     * @return 갱신오류메세지
     * @throws DataLoadException
     * @throws TemplateMergeException
     * @throws TemplateParseException
     * @throws NoDataException
     */
    private String purge(TemplateDTO returnValDTO)
            throws DataLoadException, TemplateMergeException, TemplateParseException, NoDataException {
        //        if (returnVal.getDomain() == null) {
        //            // 공통 도메인일 때
        //            List<String> domainIds =
        //                    templateService.findDomainIdListByTemplateSeq(returnVal.getTemplateSeq());
        //            purgeHelper.purgeTms(request, domainIds, MokaConstants.ITEM_TEMPLATE,
        //                    returnVal.getTemplateSeq());
        //        } else {
        //            actionLogger.success(principal.getName(), ActionType.PURGE, System.currentTimeMillis() - processStartTime);
        //        }

        // 1. 템플릿 tms purge
        String returnValue = "";
        String retTemplate = purgeHelper.tmsPurge(Collections.singletonList(returnValDTO.toTemplateItem()));
        if (McpString.isNotEmpty(retTemplate)) {
            log.error("[FAIL TO PURGE TEMPLATE] templateSeq: {} {}", returnValDTO.getTemplateSeq(), retTemplate);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PURGE TEMPLATE]", true);
            returnValue = String.join("\r\n", retTemplate);
        }

        // 2. fileYn=Y인 관련페이지 tms pageUpdate
        RelationSearchDTO search = RelationSearchDTO
                .builder()
                .domainId(returnValDTO
                        .getDomain()
                        .getDomainId())
                .fileYn(MokaConstants.YES)
                .relSeq(returnValDTO.getTemplateSeq())
                .relSeqType(MokaConstants.ITEM_TEMPLATE)
                .relType(MokaConstants.ITEM_PAGE)
                .build();
        search.setSize(9999);
        List<PageVO> pageList = relationService.findAllPage(search);
        String retPage = purgeHelper.tmsPageUpdate(pageList);
        if (McpString.isNotEmpty(retPage)) {
            log.error("[FAIL TO PAGE UPATE] templateSeq: {} {}", returnValDTO.getTemplateSeq(), retPage);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PAGE UPATE]", true);
            returnValue = String.join("\r\n", retPage);
        }

        return returnValue;
    }
}
