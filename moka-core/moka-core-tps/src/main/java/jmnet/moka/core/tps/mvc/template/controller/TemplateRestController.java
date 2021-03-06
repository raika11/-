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
 * ????????? API
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/templates")
@Api(tags = {"????????? API"})
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
     * ????????? ????????????
     *
     * @param search ????????????
     * @return ????????? ??????
     */
    @ApiOperation(value = "????????? ????????????")
    @GetMapping
    public ResponseEntity<?> getTemplateList(@Valid @SearchParam TemplateSearchDTO search) {

        // ??????(mybatis)
        List<TemplateVO> returnValue = templateService.findAllTemplate(search);

        ResultListDTO<TemplateVO> resultList = new ResultListDTO<TemplateVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<TemplateVO>> resultDTO = new ResultDTO<ResultListDTO<TemplateVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ????????? ????????????
     *
     * @param templateSeq ??????????????? (??????)
     * @return ?????????
     * @throws NoDataException ???????????????
     */
    @ApiOperation(value = "????????? ????????????")
    @GetMapping("/{templateSeq}")
    public ResponseEntity<?> getTemplate(
            @ApiParam("?????????SEQ(??????)") @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq)
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
     * ????????? ??????
     *
     * @param templateDTO           ?????????DTO
     * @param templateThumbnailFile ????????????????????????
     * @return ?????????
     * @throws InvalidDataException ????????????????????????
     * @throws Exception            ????????? ?????? ??????, ??????????????? ?????? ?????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @PostMapping(produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                                                                                 MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postTemplate(@Valid TemplateDTO templateDTO,
            @ApiParam("????????? ???????????? ???????????????") @RequestPart(value = "templateThumbnailFile", required = false) MultipartFile templateThumbnailFile)
            throws InvalidDataException, Exception {

        // ????????? ????????? ??????
        validData(templateDTO, templateThumbnailFile, ActionType.INSERT);

        Template template = modelMapper.map(templateDTO, Template.class);

        try {
            // ??????(????????? ????????? seq??? ???????????? ???????????? ?????? ?????????)
            Template returnVal = templateService.insertTemplate(template);

            // ???????????????
            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {
                // ??????????????? ??????(multipartFile)
                String imgPath = templateService.saveTemplateImage(returnVal, templateThumbnailFile);
                if (imgPath.length() > 0) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                    returnVal.setTemplateThumb(imgPath);
                } else {
                    tpsLogger.fail(ActionType.UPLOAD, "IMAGE FILE UPLOAD FAIL");
                }

                // ??????????????? ????????????(???????????? ??????X)
                returnVal = templateService.updateTemplate(returnVal, false);

            } else if (McpString.isNotEmpty(templateDTO.getTemplateThumb())) {
                /*
                 * ????????? ????????? ????????? url??? ?????? ?????? ===> ????????? ????????????!
                 */
                String targetImg = uploadFileHelper.getRealPathByDB(templateDTO.getTemplateThumb());
                String imgPath = templateService.copyTemplateImage(returnVal, targetImg);
                tpsLogger.success(ActionType.FILE_COPY, true);
                returnVal.setTemplateThumb(imgPath);

                // ??????????????? ????????????(???????????? ??????X)
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
     * ????????? ??????
     *
     * @param templateDTO           ?????????DTO
     * @param templateThumbnailFile ????????????????????????
     * @return ?????????
     * @throws NoDataException      ???????????????
     * @throws InvalidDataException ????????? ??????????????? ??????
     * @throws Exception            ????????? ?????? ??????, ??????????????? ?????? ?????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @PutMapping(value = "/{templateSeq}", produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                                                                                                          MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putTemplate(@Valid TemplateDTO templateDTO,
            @ApiParam("????????? ???????????? ???????????????") @RequestPart(value = "templateThumbnailFile", required = false) MultipartFile templateThumbnailFile)
            throws NoDataException, InvalidDataException, Exception {

        // ????????? ??????
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
             * ????????? ?????? ?????? ????????? ????????? ????????? ?????? ????????? ????????? ???????????? ??? ????????? ????????????.
             * ????????? ????????? ????????? ?????? ????????? ????????? ?????? ????????? ????????????
             */
            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {

                // ??????????????? ??????
                if (McpString.isNotEmpty(orgTemplate.getTemplateThumb())) {
                    templateService.deleteTemplateImage(orgTemplate);
                    tpsLogger.success(ActionType.FILE_DELETE, true);
                }
                // ????????? ????????? ??????
                String imgPath = templateService.saveTemplateImage(newTemplate, templateThumbnailFile);
                if (imgPath.length() > 0) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                } else {
                    tpsLogger.fail(ActionType.UPLOAD, "IMAGE FILE UPLOAD FAIL");
                }

                // ????????? ????????? ??????
                newTemplate.setTemplateThumb(imgPath);

            } else if (McpString.isNotEmpty(orgTemplate.getTemplateThumb()) && McpString.isEmpty(newTemplate.getTemplateThumb())) {
                templateService.deleteTemplateImage(orgTemplate);
                tpsLogger.success(ActionType.FILE_DELETE, true);
            }

            // ?????? (?????????????????? ??????????????? ?????? ??????????????? ????????????)
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

            // purge ??????!!  ????????????????????? ???????????? ?????????.
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
     * ????????? ??????
     *
     * @param templateSeq  ?????????SEQ
     * @param domain       ?????????DTO
     * @param templateName ????????????
     * @return ????????? ?????????
     * @throws InvalidDataException ???????????????????????? ??????
     * @throws Exception            ?????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @PostMapping("/{templateSeq}/copy")
    public ResponseEntity<?> copyTemplate(
            @ApiParam("?????????SEQ(??????)") @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq,
            @ApiParam("?????????(??????)") DomainSimpleDTO domain, @ApiParam("????????? ????????????(??????)") String templateName)
            throws InvalidDataException, Exception {

        // ??????
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
     * ????????? ??????
     *
     * @param templateSeq ?????????SEQ
     * @return ????????? ?????? ??????
     * @throws NoDataException ???????????????
     * @throws Exception       ??????????????? ????????? ?????? ?????????, ?????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @DeleteMapping("/{templateSeq}")
    public ResponseEntity<?> deleteTemplate(
            @ApiParam("?????????SEQ(??????)") @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq)
            throws NoDataException, Exception {

        // ????????? ??????
        Template template = templateService
                .findTemplateBySeq(templateSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        // ?????? ????????? ??????
        Boolean hasRels = relationService.hasRelations(templateSeq, MokaConstants.ITEM_TEMPLATE);
        if (hasRels) {
            String relMessage = msg("tps.common.error.delete.related");
            tpsLogger.fail(ActionType.DELETE, relMessage, true);
            throw new Exception(relMessage);
        }

        try {
            TemplateDTO templateDTO = modelMapper.map(template, TemplateDTO.class);

            // ????????? ??????
            templateService.deleteTemplate(template);

            // ????????? ?????? ??????
            if (McpString.isNotEmpty(template.getTemplateThumb())) {
                templateService.deleteTemplateImage(template);
                tpsLogger.success(ActionType.FILE_DELETE, true);
            }

            // purge ??????!!  ????????????????????? ???????????? ?????????.
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
     * ?????? ????????? ????????????
     *
     * @param templateSeq ?????????SEQ
     * @return ?????? ????????? ?????? ??????
     * @throws NoDataException ???????????????
     * @throws Exception       ??????????????? ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ????????????")
    @GetMapping("/{templateSeq}/has-relations")
    public ResponseEntity<?> hasRelationList(
            @ApiParam("?????????SEQ(??????)") @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq)
            throws Exception {

        // ????????? ??????
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
     * ????????? ????????? ????????? ??????
     *
     * @param template              ???????????????
     * @param templateThumbnailFile ????????????????????????
     * @param actionType            ????????????(INSERT OR UPDATE)
     * @throws InvalidDataException ?????????????????? ??????
     * @throws Exception            ??????
     */
    private void validData(TemplateDTO template, MultipartFile templateThumbnailFile, ActionType actionType)
            throws InvalidDataException, Exception {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (template != null) {
            // ????????????
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
            // ????????? ????????? ????????? ???????????? ??????
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
     * tms????????? ?????????????????? ????????????. ?????? ???????????? ????????? fileYn=Y??? ???????????? ????????????.
     *
     * @param returnValDTO ???????????????
     * @return ?????????????????????
     * @throws DataLoadException
     * @throws TemplateMergeException
     * @throws TemplateParseException
     * @throws NoDataException
     */
    private String purge(TemplateDTO returnValDTO)
            throws DataLoadException, TemplateMergeException, TemplateParseException, NoDataException {
        //        if (returnVal.getDomain() == null) {
        //            // ?????? ???????????? ???
        //            List<String> domainIds =
        //                    templateService.findDomainIdListByTemplateSeq(returnVal.getTemplateSeq());
        //            purgeHelper.purgeTms(request, domainIds, MokaConstants.ITEM_TEMPLATE,
        //                    returnVal.getTemplateSeq());
        //        } else {
        //            actionLogger.success(principal.getName(), ActionType.PURGE, System.currentTimeMillis() - processStartTime);
        //        }

        // 1. ????????? tms purge
        String returnValue = "";
        String retTemplate = purgeHelper.tmsPurge(Collections.singletonList(returnValDTO.toTemplateItem()));
        if (McpString.isNotEmpty(retTemplate)) {
            log.error("[FAIL TO PURGE TEMPLATE] templateSeq: {} {}", returnValDTO.getTemplateSeq(), retTemplate);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PURGE TEMPLATE]", true);
            returnValue = String.join("\r\n", retTemplate);
        }

        // 2. fileYn=Y??? ??????????????? tms pageUpdate
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
