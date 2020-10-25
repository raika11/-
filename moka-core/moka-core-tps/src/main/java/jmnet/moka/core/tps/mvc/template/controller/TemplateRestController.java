package jmnet.moka.core.tps.mvc.template.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.helper.RelationHelper;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateHistDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;
import jmnet.moka.core.tps.mvc.template.service.TemplateHistService;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

/**
 * 템플릿 API
 * 2020. 1. 14. jeon 최초생성
 *
 * @author jeon
 * @since 2020. 1. 14. 오후 1:33:50
 */
@Controller
@Validated
@Slf4j
@RequestMapping("/api/templates")
public class TemplateRestController {

    @Autowired
    private TemplateService templateService;

    @Autowired
    private TemplateHistService templateHistService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private PurgeHelper purgeHelper;

    @Autowired
    private RelationHelper relationHelper;

    @Autowired
    private UploadFileHelper uploadFileHelper;

    @Autowired
    private TpsLogger tpsLogger;

    /**
     * 템플릿 목록조회
     *
     * @param request HTTP 요청
     * @param search  검색조건
     * @return 템플릿 목록
     */
    @ApiOperation(value = "템플릿 목록조회")
    @GetMapping
    public ResponseEntity<?> getTemplateList(HttpServletRequest request, @Valid @SearchParam TemplateSearchDTO search) {

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
     * @param request     HTTP 요청
     * @param templateSeq 템플릿번호 (필수)
     * @return 템플릿
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "템플릿 상세조회")
    @GetMapping("/{templateSeq}")
    public ResponseEntity<?> getTemplate(HttpServletRequest request,
            @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq)
            throws NoDataException {

        Template template = templateService.findTemplateBySeq(templateSeq)
                                           .orElseThrow(() -> {
                                               String message = messageByLocale.get("tps.common.error.no-data", request);
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
     * @param request               HTTP 요청
     * @param templateDTO           템플릿DTO
     * @param templateThumbnailFile 템플릿썸네일파일
     * @return 템플릿
     * @throws InvalidDataException 데이터유효성에러
     * @throws Exception            썸네일 저장 실패, 템플릿오류 그외 모든 에러
     */
    @ApiOperation(value = "템플릿 등록")
    @PostMapping(produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postTemplate(HttpServletRequest request, @Valid TemplateDTO templateDTO,
            @RequestPart(value = "templateThumbnailFile", required = false) MultipartFile templateThumbnailFile)
            throws InvalidDataException, Exception {

        // 데이터 유효성 검사
        validData(request, templateDTO, templateThumbnailFile, ActionType.INSERT);

        Template template = modelMapper.map(templateDTO, Template.class);

        try {
            // 등록(이미지 등록에 seq가 필요해서 템플릿을 먼저 저장함)
            Template returnVal = templateService.insertTemplate(template);

            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {
                // 이미지파일 저장(multipartFile)
                String imgPath = templateService.saveTemplateImage(returnVal, templateThumbnailFile);
                tpsLogger.success(ActionType.UPLOAD, true);
                returnVal.setTemplateThumb(imgPath);

                // 썸네일경로 업데이트(히스토리 생성X)
                returnVal = templateService.updateTemplate(template, false);

            } else if (McpString.isNotEmpty(templateDTO.getTemplateThumb())) {
                /*
                 * 파일은 없는데 이미지 url이 있는 경우 ===> 파일을 복사한다!
                 */
                String targetImg = uploadFileHelper.getRealPathByDB(templateDTO.getTemplateThumb());
                String imgPath = templateService.copyTemplateImage(returnVal, targetImg);
                tpsLogger.success(ActionType.FILE_COPY, true);
                returnVal.setTemplateThumb(imgPath);

                // 썸네일경로 업데이트(히스토리 생성X)
                returnVal = templateService.updateTemplate(template, false);
            }

            TemplateDTO returnValDTO = modelMapper.map(returnVal, TemplateDTO.class);


            String message = messageByLocale.get("tps.common.success.insert", request);
            ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT TEMPLATE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT TEMPLATE]", e, true);
            throw new Exception(messageByLocale.get("tps.template.error.save", request), e);
        }
    }

    /**
     * 템플릿 수정
     *
     * @param request               HTTP 요청
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
    public ResponseEntity<?> putTemplate(HttpServletRequest request, @Valid TemplateDTO templateDTO,
            @ApiParam(value = "templateThumbnailFile") @RequestPart(value = "templateThumbnailFile", required = false)
                    MultipartFile templateThumbnailFile)
            throws NoDataException, InvalidDataException, Exception {

        // 데이터 검사
        validData(request, templateDTO, templateThumbnailFile, ActionType.UPDATE);

        Template newTemplate = modelMapper.map(templateDTO, Template.class);
        Template orgTemplate = templateService.findTemplateBySeq(templateDTO.getTemplateSeq())
                                              .orElseThrow(() -> {
                                                  String message = messageByLocale.get("tps.template.error.no-data", request);
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
            if (orgTemplate.getTemplateBody() != null && orgTemplate.getTemplateBody()
                                                                    .equals(newTemplate.getTemplateBody())) {
                returnVal = templateService.updateTemplate(newTemplate, false);
            } else {
                returnVal = templateService.updateTemplate(newTemplate);
            }
            TemplateDTO returnValDTO = modelMapper.map(returnVal, TemplateDTO.class);

            //            if (McpString.isNotEmpty(returnValDTO.getTemplateThumb())) {
            //                returnValDTO.setTemplateThumb(templateImagePrefix + returnValDTO.getTemplateThumb());
            //            }

            String message = messageByLocale.get("tps.common.success.update", request);
            ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(returnValDTO, message);

            // purge 날림!!
            //            if (returnVal.getDomain() == null) {
            //                // 공통 도메인일 때
            //                List<String> domainIds =
            //                        templateService.findDomainIdListByTemplateSeq(returnVal.getTemplateSeq());
            //                purgeHelper.purgeTms(request, domainIds, MokaConstants.ITEM_TEMPLATE,
            //                        returnVal.getTemplateSeq());
            //            } else {
            purgeHelper.purgeTms(request, returnVal.getDomain()
                                                   .getDomainId(), MokaConstants.ITEM_TEMPLATE, returnVal.getTemplateSeq());
            //                actionLogger.success(principal.getName(), ActionType.PURGE, System.currentTimeMillis() - processStartTime);
            //            }

            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE TEMPLATE] seq: {}) {}", templateDTO.getTemplateSeq(), e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE TEMPLATE]", e, true);
            throw new Exception(messageByLocale.get("tps.template.error.save", request), e);
        }
    }

    /**
     * 템플릿 복사
     *
     * @param request      HTTP요청
     * @param templateSeq  템플릿SEQ
     * @param domain       도메인DTO
     * @param templateName 템플릿명
     * @return 복사한 데이터
     * @throws InvalidDataException 데이터유효성검사 예외
     * @throws Exception            그외 예외
     */
    @ApiOperation(value = "템플릿 복사")
    @PostMapping("/{templateSeq}/copy")
    public ResponseEntity<?> copyTemplate(HttpServletRequest request,
            @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq, DomainSimpleDTO domain,
            String templateName)
            throws InvalidDataException, Exception {

        // 조회
        Template template = templateService.findTemplateBySeq(templateSeq)
                                           .orElseThrow(() -> {
                                               String message = messageByLocale.get("tps.template.error.no-data", request);
                                               tpsLogger.fail(ActionType.INSERT, message, true);
                                               return new NoDataException(message);
                                           });

        TemplateDTO templateDTO = modelMapper.map(template, TemplateDTO.class);
        templateDTO.setTemplateSeq(null);
        templateDTO.setTemplateName(templateName);
        templateDTO.setDomain(domain);

        return this.postTemplate(request, templateDTO, null);
    }

    /**
     * 템플릿 삭제
     *
     * @param request     HTTP요청
     * @param templateSeq 템플릿SEQ
     * @return 템플릿 삭제 여부
     * @throws NoDataException 데이터없음
     * @throws Exception       관련아이템 있으면 삭제 불가능, 그외 에러
     */
    @ApiOperation(value = "템플릿 삭제")
    @DeleteMapping("/{templateSeq}")
    public ResponseEntity<?> deleteTemplate(HttpServletRequest request,
            @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq)
            throws NoDataException, Exception {

        // 데이타 확인
        Template template = templateService.findTemplateBySeq(templateSeq)
                                           .orElseThrow(() -> {
                                               String message = messageByLocale.get("tps.template.error.no-data", request);
                                               tpsLogger.fail(ActionType.DELETE, message, true);
                                               return new NoDataException(message);
                                           });

        // 관련 데이터 확인
        Boolean hasRels = relationHelper.hasRelations(templateSeq, MokaConstants.ITEM_TEMPLATE);
        if (hasRels) {
            String relMessage = messageByLocale.get("tps.template.error.delete.related", request);
            tpsLogger.fail(ActionType.DELETE, relMessage, true);
            throw new Exception(relMessage);
        }

        try {
            // 템플릿 삭제
            templateService.deleteTemplate(template);

            // 썸네일 파일 삭제
            if (McpString.isNotEmpty(template.getTemplateThumb())) {
                templateService.deleteTemplateImage(template);
                tpsLogger.success(ActionType.FILE_DELETE, true);
            }

            String message = messageByLocale.get("tps.common.success.delete", request);
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE TEMPLATE] seq: {}) {}", templateSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE TEMPLATE]", e, true);
            throw new Exception(messageByLocale.get("tps.template.error.delete", request), e);
        }
    }

    /**
     * 관련 아이템 존재여부
     *
     * @param request HTTP요청
     * @param templateSeq     템플릿SEQ
     * @return 관련 아이템 존재 여부
     * @throws NoDataException 데이터없음
     * @throws Exception       관련아이템 조회 에러
     */
    @ApiOperation(value = "관련 아이템 존재여부")
    @GetMapping("/{templateSeq}/has-relations")
    public ResponseEntity<?> hasRelationList(HttpServletRequest request,
            @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq)
            throws Exception {

        // 템플릿 확인
        templateService.findTemplateBySeq(templateSeq)
                       .orElseThrow(() -> {
                           String message = messageByLocale.get("tps.template.error.no-data", request);
                           tpsLogger.fail(ActionType.SELECT, message, true);
                           return new NoDataException(message);
                       });

        try {
            Boolean chkRels = relationHelper.hasRelations(templateSeq, MokaConstants.ITEM_TEMPLATE);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[TEMPLATE RELATION EXISTENCE CHECK FAILED] seq: {}) {}", templateSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[TEMPLATE RELATION EXISTENCE CHECK FAILEDE]", e, true);
            throw new Exception(messageByLocale.get("tps.template.error.hasRelations", request), e);
        }
    }

    /**
     * 관련 아이템 목록조회
     *
     * @param request HTTP요청
     * @param templateSeq 템플릿SEQ
     * @param search 검색조건
     * @return 관련아이템 목록
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "관련 아이템 목록조회")
    @GetMapping("/{templateSeq}/relations")
    public ResponseEntity<?> getRelationList(HttpServletRequest request,
            @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq, @Valid @SearchParam RelSearchDTO search)
            throws NoDataException, Exception {

        search.setRelSeq(templateSeq);
        search.setRelSeqType(MokaConstants.ITEM_TEMPLATE);

        // 템플릿 확인
        templateService.findTemplateBySeq(templateSeq)
                       .orElseThrow(() -> {
                           String message = messageByLocale.get("tps.template.error.no-data", request);
                           tpsLogger.fail(ActionType.SELECT, message, true);
                           return new NoDataException(message);
                       });

        ResponseEntity<?> response = relationHelper.findRelations(search);
        tpsLogger.success(ActionType.SELECT, true);
        return response;
    }

    /**
     * 템플릿 히스토리 목록조회
     *
     * @param request     HTTP요청
     * @param templateSeq 템플릿SEQ
     * @param search      검색조건
     * @return 템플릿 히스토리 목록
     */
    @ApiOperation(value = "템플릿 히스토리 목록조회")
    @GetMapping("/{templateSeq}/histories")
    public ResponseEntity<?> getHistoryList(HttpServletRequest request,
            @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq,
            @Valid @SearchParam SearchDTO search) {

        // 페이징조건 설정 (order by seq desc)
        List<String> sort = new ArrayList<String>();
        sort.add("seq,desc");
        search.setSort(sort);
        Pageable pageable = search.getPageable();

        // 조회
        Page<TemplateHist> historyList = templateHistService.findAllTemplateHist(templateSeq, search, pageable);

        // entity -> DTO
        List<TemplateHistDTO> historiesDTO = modelMapper.map(historyList.getContent(), TemplateHistDTO.TYPE);

        // 리턴 DTO 생성
        ResultListDTO<TemplateHistDTO> resultList = new ResultListDTO<TemplateHistDTO>();
        resultList.setTotalCnt(historyList.getTotalElements());
        resultList.setList(historiesDTO);

        ResultDTO<ResultListDTO<TemplateHistDTO>> resultDTO = new ResultDTO<ResultListDTO<TemplateHistDTO>>(resultList);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 템플릿 히스토리 상세조회
     *
     * @param request HTTP 요청
     * @param seq     순번
     * @return 템플릿 히스토리
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "템플릿 히스토리 상세조회")
    @GetMapping("/{templateSeq}/histories/{seq}")
    public ResponseEntity<?> getHistory(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0, message = "{tps.templatehist.error.min.seq}") Long seq)
            throws NoDataException {

        // 템플릿 히스토리 조회
        TemplateHist history = templateHistService.findTemplateHistBySeq(seq)
                                                  .orElseThrow(() -> {
                                                      String message = messageByLocale.get("tps.templatehist.error.no-data", request);
                                                      tpsLogger.fail(ActionType.SELECT, message, true);
                                                      return new NoDataException(message);
                                                  });
        TemplateHistDTO historyDTO = modelMapper.map(history, TemplateHistDTO.class);

        ResultDTO<TemplateHistDTO> resultDTO = new ResultDTO<TemplateHistDTO>(historyDTO);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 템플릿 데이터 유효성 검사
     *
     * @param request               요청
     * @param template              템플릿정보
     * @param templateThumbnailFile 템플릿썸네일파일
     * @param actionType            작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성 오류
     * @throws Exception            예외
     */
    private void validData(HttpServletRequest request, TemplateDTO template, MultipartFile templateThumbnailFile, ActionType actionType)
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
            } catch (IOException e) {
                String message = e.getMessage();
                invalidList.add(new InvalidDataDTO("templateBody", message));
                tpsLogger.fail(actionType, message, true);
            }
            // 등록한 파일이 이미지 파일인지 체크
            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {
                boolean isImage = ImageUtil.isImage(templateThumbnailFile);
                if (!isImage) {
                    String message = messageByLocale.get("tps.template.error.onlyimage.thumbnail");
                    invalidList.add(new InvalidDataDTO("thumbnail", message));
                    tpsLogger.fail(actionType, message, true);
                }
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }
}
