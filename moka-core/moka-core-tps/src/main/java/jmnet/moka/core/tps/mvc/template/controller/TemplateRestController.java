package jmnet.moka.core.tps.mvc.template.controller;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;

import javax.validation.constraints.NotNull;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.helper.RelationHelper;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateHistDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;
import jmnet.moka.core.tps.mvc.template.service.TemplateHistService;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

/**
 * 템플릿 API
 * 2020. 1. 14. jeon 최초생성
 * 
 * @since 2020. 1. 14. 오후 1:33:50
 * @author jeon
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
    private ActionLogger actionLogger;

    /**
     * 템플릿 목록조회
     *
     * @param request HTTP 요청
     * @param search 검색조건
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 템플릿 목록
     */
    @ApiOperation(value = "템플릿 목록조회")
    @GetMapping
    public ResponseEntity<?> getTemplateList(
        HttpServletRequest request,
        @Valid @SearchParam TemplateSearchDTO search,
        @NotNull Principal principal,
        @RequestAttribute Long processStartTime
    ) {
        // 조회(mybatis)
        List<TemplateVO> returnValue = templateService.findAllTemplate(search);

        ResultListDTO<TemplateVO> resultList = new ResultListDTO<TemplateVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<TemplateVO>> resultDTO = new ResultDTO<ResultListDTO<TemplateVO>>(resultList);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 템플릿 상세 조회
     * 
     * @param request HTTP 요청
     * @param templateSeq 템플릿번호
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 템플릿
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "템플릿 상세조회")
    @GetMapping("/{seq}")
    public ResponseEntity<?> getTemplate(
        HttpServletRequest request,
        @PathVariable("seq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq,
        @NotNull Principal principal,
        @RequestAttribute Long processStartTime
    ) throws NoDataException {

        // 조회
        Template template = templateService.findTemplateBySeq(templateSeq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data", request);
                    actionLogger.fail(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime, message);
                    return new NoDataException(message);
                });

        TemplateDTO templateDTO = modelMapper.map(template, TemplateDTO.class);

        ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(templateDTO);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 템플릿 등록
     * 
     * @param request HTTP 요청
     * @param templateDTO 템플릿DTO
     * @param templateThumbnailFile 템플릿썸네일파일
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 템플릿
     * @throws InvalidDataException 데이터유효성에러
     * @throws Exception 썸네일 저장 실패, 템플릿오류 그외 모든 에러
     */
    @ApiOperation(value = "템플릿 등록")
    @PostMapping(consumes = {"multipart/form-data","application/x-www-form-urlencoded"})
    public ResponseEntity<?> postTemplate(
            HttpServletRequest request,
            @Valid TemplateDTO templateDTO,
            @ApiParam(value = "templateThumbnailFile") @RequestPart(value = "templateThumbnailFile", required = false)
                    MultipartFile templateThumbnailFile,
            @NotNull Principal principal,
            @RequestAttribute Long processStartTime
    ) throws InvalidDataException, Exception {
        // 데이터 검사
        validData(request, templateDTO, templateThumbnailFile, principal, processStartTime, ActionType.INSERT);

        Template template = modelMapper.map(templateDTO, Template.class);

        try {
            // 등록(이미지 등록에 seq가 필요해서 템플릿을 먼저 저장함)
            Template returnVal = templateService.insertTemplate(template);

            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {
                // 이미지파일 저장(multipartFile)
                String imgPath = templateService.saveTemplateImage(returnVal,templateThumbnailFile);
                actionLogger.success(principal.getName(), ActionType.UPLOAD, System.currentTimeMillis() - processStartTime);
                returnVal.setTemplateThumb(imgPath);

                // 썸네일경로 업데이트(히스토리 생성X)
                returnVal = templateService.updateTemplate(template, false);

            } else if (McpString.isNotEmpty(templateDTO.getTemplateThumb())) {
                /*
                 * 파일은 없는데 이미지 url이 있는 경우 ===> 파일을 복사한다!
                 */
                String targetImg =  uploadFileHelper.getRealPathByDB(templateDTO.getTemplateThumb());
                String imgPath = templateService.copyTemplateImage(returnVal, targetImg);
                actionLogger.success(principal.getName(), ActionType.FILE_COPY, System.currentTimeMillis() - processStartTime);
                returnVal.setTemplateThumb(imgPath);

                // 썸네일경로 업데이트(히스토리 생성X)
                returnVal = templateService.updateTemplate(template, false);
            }

            TemplateDTO returnValDTO = modelMapper.map(returnVal, TemplateDTO.class);

            ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(returnValDTO);
            actionLogger.success(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT TEMPLATE]", e);
            actionLogger.error(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.template.error.save", request), e);
        }
    }

    /**
     * 템플릿 수정
     * 
     * @param request HTTP 요청
     * @param templateDTO 템플릿DTO
     * @param templateThumbnailFile 템플릿썸네일파일
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 템플릿
     * @throws NoDataException 데이터없음
     * @throws InvalidDataException 데이터 유효성검사 에러
     * @throws Exception 썸네일 저장 실패, 템플릿오류 그외 모든 에러
     */
    @ApiOperation(value = "템플릿 수정")
    @PutMapping(value="/{seq}", consumes = "multipart/form-data")
    public ResponseEntity<?> putTemplate(
        HttpServletRequest request,
        @Valid TemplateDTO templateDTO,
        @ApiParam(value = "templateThumbnailFile") @RequestPart(value = "templateThumbnailFile", required = false)
                    MultipartFile templateThumbnailFile,
        @NotNull Principal principal,
        @RequestAttribute Long processStartTime
    ) throws NoDataException, InvalidDataException, Exception {

        // 데이터 검사
        validData(request, templateDTO, templateThumbnailFile, principal, processStartTime, ActionType.UPDATE);

        Template newTemplate = modelMapper.map(templateDTO, Template.class);
        Template orgTemplate = templateService.findTemplateBySeq(templateDTO.getTemplateSeq())
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.template.error.no-data", request);
                    actionLogger.fail(principal.getName(), ActionType.UPDATE, System.currentTimeMillis() - processStartTime, message);
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
                    actionLogger.success(principal.getName(), ActionType.FILE_DELETE, System.currentTimeMillis() - processStartTime);
                }
                // 새로운 이미지 저장
                String imgPath = templateService.saveTemplateImage(newTemplate, templateThumbnailFile);
                actionLogger.success(principal.getName(), ActionType.UPLOAD, System.currentTimeMillis() - processStartTime);

                // 이미지 파일명 수정
                newTemplate.setTemplateThumb(imgPath);

            } else if (McpString.isNotEmpty(orgTemplate.getTemplateThumb())
                    && McpString.isEmpty(newTemplate.getTemplateThumb())) {
                templateService.deleteTemplateImage(orgTemplate);
                actionLogger.success(principal.getName(), ActionType.FILE_DELETE, System.currentTimeMillis() - processStartTime);
            }

            // 수정 (템플릿바디가 변경되었을 때만 히스토리를 생성한다)
            Template returnVal;
            if (orgTemplate.getTemplateBody() != null
                    && orgTemplate.getTemplateBody().equals(newTemplate.getTemplateBody())) {
                returnVal = templateService.updateTemplate(newTemplate, false);
            } else {
                returnVal = templateService.updateTemplate(newTemplate);
            }
            TemplateDTO returnValDTO = modelMapper.map(returnVal, TemplateDTO.class);

//            if (McpString.isNotEmpty(returnValDTO.getTemplateThumb())) {
//                returnValDTO.setTemplateThumb(templateImagePrefix + returnValDTO.getTemplateThumb());
//            }

            ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(returnValDTO);

            actionLogger.success(principal.getName(), ActionType.UPDATE, System.currentTimeMillis() - processStartTime);

            // purge 날림!!
//            if (returnVal.getDomain() == null) {
//                // 공통 도메인일 때
//                List<String> domainIds =
//                        templateService.findDomainIdListByTemplateSeq(returnVal.getTemplateSeq());
//                purgeHelper.purgeTms(request, domainIds, MokaConstants.ITEM_TEMPLATE,
//                        returnVal.getTemplateSeq());
//            } else {
                purgeHelper.purgeTms(request, returnVal.getDomain().getDomainId(),
                        MokaConstants.ITEM_TEMPLATE, returnVal.getTemplateSeq());
//                actionLogger.success(principal.getName(), ActionType.PURGE, System.currentTimeMillis() - processStartTime);
//            }

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE TEMPLATE] seq: {}) {}", templateDTO.getTemplateSeq(), e.getMessage());
            actionLogger.error(principal.getName(), ActionType.UPDATE, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.template.error.save", request), e);
        }
    }

    /**
     * 템플릿 복사
     * 
     * @param request HTTP요청
     * @param seq 템플릿SEQ
     * @param domain 도메인DTO
     * @param templateName 템플릿명
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 복사한 데이터
     * @throws InvalidDataException 데이터유효성검사 예외
     * @throws Exception 그외 예외
     */
    @ApiOperation(value = "템플릿 복사")
    @PostMapping("/{seq}/copy")
    public ResponseEntity<?> copyTemplate(
        HttpServletRequest request,
        @PathVariable("seq") @Min(value = 0,message = "{tps.template.error.min.templateSeq}") Long seq,
        DomainSimpleDTO domain,
        String templateName,
        @NotNull Principal principal,
        @RequestAttribute Long processStartTime
    ) throws InvalidDataException, Exception {

        // 조회
        Template template = templateService.findTemplateBySeq(seq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.template.error.no-data", request);
                    actionLogger.fail(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime, message);
                    return new NoDataException(message);
                });

        TemplateDTO templateDTO = modelMapper.map(template, TemplateDTO.class);
        templateDTO.setTemplateSeq(null);
        templateDTO.setTemplateName(templateName);
        templateDTO.setDomain(domain);

        return this.postTemplate(request, templateDTO, null, principal, processStartTime);
    }

    /**
     * 템플릿 삭제
     * 
     * @param request HTTP요청
     * @param templateSeq 템플릿SEQ
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 템플릿 삭제 여부
     * @throws NoDataException 데이터없음
     * @throws Exception 관련아이템 있으면 삭제 불가능, 그외 에러
     */
    @ApiOperation(value = "템플릿 삭제")
    @DeleteMapping("/{seq}")
    public ResponseEntity<?> deleteTemplate(
        HttpServletRequest request,
        @PathVariable("seq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq,
        @NotNull Principal principal,
        @RequestAttribute Long processStartTime
    ) throws NoDataException, Exception {

        // 템플릿 확인
        Template template = templateService.findTemplateBySeq(templateSeq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.template.error.no-data", request);
                    actionLogger.fail(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime, message);
                    return new NoDataException(message);
                });

        // 관련 데이터 확인
        Boolean hasRels = relationHelper.hasRelations(templateSeq, MokaConstants.ITEM_TEMPLATE);
        if (hasRels) {
            String relMessage = messageByLocale.get("tps.template.error.delete.related", request);
            actionLogger.fail(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime, relMessage);
            throw new Exception(relMessage);
        }

        try {
            // 템플릿 삭제
            templateService.deleteTemplate(template);

            // 썸네일 파일 삭제
            if (McpString.isNotEmpty(template.getTemplateThumb())) {
                templateService.deleteTemplateImage(template);
                actionLogger.success(principal.getName(), ActionType.FILE_DELETE, System.currentTimeMillis() - processStartTime);
            }

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true);
            actionLogger.success(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE TEMPLATE] seq: {}) {}", templateSeq, e.getMessage());
            actionLogger.error(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.template.error.delete", request), e);
        }
    }

    /**
     * 관련 아이템 존재여부
     * 
     * @param request HTTP요청
     * @param seq 템플릿SEQ
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 관련 아이템 존재 여부
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "관련 아이템 존재여부")
    @GetMapping("/{seq}/has-relations")
    public ResponseEntity<?> hasRelations(
        HttpServletRequest request,
        @PathVariable("seq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long seq,
        @NotNull Principal principal,
        @RequestAttribute Long processStartTime
    ) throws NoDataException {

        // 템플릿 확인
        templateService.findTemplateBySeq(seq).orElseThrow(() -> {
            String message = messageByLocale.get("tps.template.error.no-data", request);
            actionLogger.fail(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime, message);
            return new NoDataException(message);
        });

        Boolean chkRels = relationHelper.hasRelations(seq, MokaConstants.ITEM_TEMPLATE);

        ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 관련 아이템 목록조회
     * 
     * @param request HTTP요청
     * @param search 검새 조건
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 관련아이템 목록
     * @throws NoDataException 데이터없음
     * @throws Exception 잘못된 분류
     */
    @ApiOperation(value = "관련 아이템 목록조회")
    @GetMapping("/{seq}/relations")
    public ResponseEntity<?> getRelationList(
        HttpServletRequest request,
        @PathVariable("seq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long seq,
        @Valid @SearchParam RelSearchDTO search,
        @NotNull Principal principal,
        @RequestAttribute Long processStartTime
    ) throws NoDataException, Exception {

        search.setRelSeq(seq);
        search.setRelSeqType(MokaConstants.ITEM_TEMPLATE);

        // 템플릿 확인
        templateService.findTemplateBySeq(seq).orElseThrow(() -> {
            String message = messageByLocale.get("tps.template.error.no-data", request);
            actionLogger.fail(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime, message);
            return new NoDataException(message);
        });

        ResponseEntity<?> response = relationHelper.findRelations(search);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);

        return response;
    }

    /**
     * 템플릿 히스토리 목록조회
     * 
     * @param request HTTP요청
     * @param templateSeq 템플릿SEQ
     * @param search 검색조건
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 템플릿 히스토리 목록
     */
    @ApiOperation(value = "템플릿 히스토리 목록조회")
    @GetMapping("/{seq}/histories")
    public ResponseEntity<?> getHistoryList(
        HttpServletRequest request,
        @PathVariable("seq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq,
        @Valid @SearchParam SearchDTO search,
        @NotNull Principal principal,
        @RequestAttribute Long processStartTime
    ) {
        // 페이징조건 설정 (order by seq desc)
        List<String> sort = new ArrayList<String>();
        sort.add("seq,desc");
        search.setSort(sort);
        Pageable pageable = search.getPageable();

        // 조회
        Page<TemplateHist> historyList = templateHistService.findAllTemplateHist(templateSeq, search, pageable);

        // entity -> DTO
        List<TemplateHistDTO> historiesDTO = modelMapper.map(historyList.getContent(), TemplateHistDTO.TYPE);

        ResultListDTO<TemplateHistDTO> resultList = new ResultListDTO<TemplateHistDTO>();
        resultList.setTotalCnt(historyList.getTotalElements());
        resultList.setList(historiesDTO);

        ResultDTO<ResultListDTO<TemplateHistDTO>> resultDTO =
                new ResultDTO<ResultListDTO<TemplateHistDTO>>(resultList);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 템플릿 히스토리 상세조회
     * 
     * @param request HTTP 요청
     * @param seq 순번
     * @param principal 로그인사용자 세션
     * @param processStartTime 작업시간
     * @return 템플릿 히스토리
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "템플릿 히스토리 상세조회")
    @GetMapping("/{templateSeq}/histories/{seq}")
    public ResponseEntity<?> getHistory(
        HttpServletRequest request,
        @PathVariable("seq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long seq,
        @NotNull Principal principal,
        @RequestAttribute Long processStartTime
    ) throws NoDataException {

        // 템플릿 히스토리 조회
        TemplateHist history = templateHistService.findTemplateHistBySeq(seq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.template.error.history.no-data", request);
                    actionLogger.fail(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime, message);
                    return new NoDataException(message);
                });
        TemplateHistDTO historyDTO = modelMapper.map(history, TemplateHistDTO.class);

        ResultDTO<TemplateHistDTO> resultDTO = new ResultDTO<TemplateHistDTO>(historyDTO);
        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 템플릿 데이터 유효성 검사
     *
     * @param request 요청
     * @param template 템플릿정보
     * @param templateThumbnailFile 템플릿썸네일파일
     * @param principal 작업자
     * @param processStartTime 작업시간
     * @param actionType 작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성 오류
     * @throws Exception 예외
     */
    private void validData(
        HttpServletRequest request,
        TemplateDTO template,
        MultipartFile templateThumbnailFile,
        Principal principal,
        Long processStartTime,
        ActionType actionType
    ) throws InvalidDataException, Exception {
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
                actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
            } catch (IOException e) {
                String message = e.getMessage();
                invalidList.add(new InvalidDataDTO("templateBody", message));
                actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
            }
            // 등록한 파일이 이미지 파일인지 체크
            if (templateThumbnailFile != null && !templateThumbnailFile.isEmpty()) {
                boolean isImage = ImageUtil.isImage(templateThumbnailFile);
                if (!isImage) {
                    String message = messageByLocale.get("tps.template.error.onlyimage.thumbnail");
                    invalidList.add(new InvalidDataDTO("thumbnail", message));
                    actionLogger.fail(principal.getName(), actionType, System.currentTimeMillis() - processStartTime, message);
                }
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }
}
