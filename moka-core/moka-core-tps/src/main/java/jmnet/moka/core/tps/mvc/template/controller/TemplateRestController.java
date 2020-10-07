package jmnet.moka.core.tps.mvc.template.controller;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;

import jmnet.moka.core.common.MokaConstants;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
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
import jmnet.moka.core.tps.mvc.user.dto.UserDTO;

/**
 * <pre>
 * 템플릿 API
 * 2020. 1. 14. jeon 최초생성
 * </pre>
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

    /**
     * <pre>
     * 템플릿 목록을 조회한다
     * </pre>
     * 
     * @param request HTTP 요청
     * @param search 검색조건
     * @param userInfoDTO 유저(테스트)
     * @return 템플릿 목록
     */
    @GetMapping
    public ResponseEntity<?> getTemplateList(HttpServletRequest request,
            @Valid @SearchParam TemplateSearchDTO search,
            @AuthenticationPrincipal UserDTO userInfoDTO) {

        // 조회(mybatis)
        List<TemplateVO> returnValue = templateService.findList(search);

        ResultListDTO<TemplateVO> resultList = new ResultListDTO<TemplateVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<TemplateVO>> resultDTO =
                new ResultDTO<ResultListDTO<TemplateVO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 템플릿을 조회한다
     * </pre>
     * 
     * @param request HTTP 요청
     * @param templateSeq 템플릿번호
     * @return 템플릿
     * @throws NoDataException 데이터없음
     */
    @GetMapping("/{seq}")
    public ResponseEntity<?> getTemplate(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.template.error.invalid.templateSeq}") Long templateSeq)
            throws NoDataException {

        String message = messageByLocale.get("tps.template.error.noContent", request);

        // 조회
        Template template = templateService.findByTemplateSeq(templateSeq)
                .orElseThrow(() -> new NoDataException(message));

        TemplateDTO templateDTO = modelMapper.map(template, TemplateDTO.class);

        if (!McpString.isNullOrEmpty(templateDTO.getTemplateThumb())) {
            templateDTO.setTemplateThumb("/image/" + templateDTO.getTemplateThumb());
        }

        ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(templateDTO);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 템플릿을 등록한다
     * </pre>
     * 
     * @param request HTTP 요청
     * @param templateDTO 템플릿DTO
     * @param principal Principal
     * @return 템플릿
     * @throws InvalidDataException 데이터유효성검사
     * @throws Exception 썸네일 저장 실패, 그외 모든 에러
     */
    @PostMapping
    public ResponseEntity<?> postTemplate(HttpServletRequest request,
            @Valid TemplateDTO templateDTO, Principal principal)
            throws InvalidDataException, Exception {

        // 데이터 검사
        List<InvalidDataDTO> invalidList = validData(templateDTO);
        if (invalidList.size() > 0) {
            String message = messageByLocale.get("tps.template.error.invalidContent", request);
            throw new InvalidDataException(invalidList, message);
        }

        Template template = modelMapper.map(templateDTO, Template.class);
        template.setRegDt(McpDate.now());
        template.setRegId(principal.getName());
        if (template.getTemplateBody() == null) {
            template.setTemplateBody("");
        }

        try {

            // 등록(이미지 등록에 seq가 필요해서 템플릿을 먼저 저장함)
            Template returnVal = templateService.insertTemplate(template);

            if (templateDTO.getTemplateThumbnailFile() != null
                    && !templateDTO.getTemplateThumbnailFile().isEmpty()) {
                // 이미지파일 저장(multipartFile)
                String imgPath = templateService.saveTemplateImage(returnVal,
                        templateDTO.getTemplateThumbnailFile());
                returnVal.setTemplateThumb(imgPath);

                // 썸네일경로 업데이트(히스토리 생성X)
                returnVal = templateService.updateTemplate(template, false);

            } else if (!McpString.isNullOrEmpty(templateDTO.getTemplateThumb())) {
                /*
                 * 파일은 없는데 이미지 url이 있는 경우 ===> 파일을 복사한다! 복사할 파일의 /image/template/ 경로를 없애줌
                 */
                String targetImg = templateDTO.getTemplateThumb();
                targetImg = targetImg.replace(TpsConstants.TEMPLATE_IMAGE_PREFIEX, "");
                targetImg = targetImg.replace("template/", "");
                String imgPath = templateService.copyTemplateImage(returnVal, targetImg);
                returnVal.setTemplateThumb(imgPath);

                // 썸네일경로 업데이트(히스토리 생성X)
                returnVal = templateService.updateTemplate(template, false);
            }

            TemplateDTO returnValDTO = modelMapper.map(returnVal, TemplateDTO.class);

            if (!McpString.isNullOrEmpty(returnValDTO.getTemplateThumb())) {
                returnValDTO.setTemplateThumb(
                        TpsConstants.TEMPLATE_IMAGE_PREFIEX + returnValDTO.getTemplateThumb());
            }

            ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(returnValDTO);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT TEMPLATE]", e);
            throw new Exception(messageByLocale.get("tps.template.error.save", request), e);
        }
    }

    /**
     * <pre>
     * 템플릿을 수정한다
     * </pre>
     * 
     * @param request HTTP 요청
     * @param templateDTO 템플릿DTO
     * @param principal Principal
     * @return 템플릿
     * @throws NoDataException 데이터없음
     * @throws InvalidDataException 데이터 유효성검사
     * @throws Exception 썸네일 저장 실패, 그외 에러
     */
    @PutMapping("/{seq}")
    public ResponseEntity<?> putTemplate(HttpServletRequest request, @Valid TemplateDTO templateDTO,
            Principal principal) throws NoDataException, InvalidDataException, Exception {

        // 데이터 검사
        List<InvalidDataDTO> invalidList = validData(templateDTO);
        if (invalidList.size() > 0) {
            String message = messageByLocale.get("tps.template.error.invalidContent", request);
            throw new InvalidDataException(invalidList, message);
        }

        String message = messageByLocale.get("tps.template.error.noContent", request);
        Template newTemplate = modelMapper.map(templateDTO, Template.class);
        Template orgTemplate = templateService.findByTemplateSeq(templateDTO.getTemplateSeq())
                .orElseThrow(() -> new NoDataException(message));

        newTemplate.setRegDt(orgTemplate.getRegDt());
        newTemplate.setRegId(orgTemplate.getRegId());
        newTemplate.setModDt(McpDate.now());
//        newTemplate.setModId(principal.getName());
        newTemplate.setRegId("test");
        if (newTemplate.getTemplateBody() == null) {
            newTemplate.setTemplateBody("");
        }

        try {
            /*
             * 이미지 파일 저장 새로운 파일이 있으면 기존 파일이 있으면 삭제하고 새 파일을 저장한다. 새로운 파일이 없는데 기존 파일이 있으면 기존 파일을 삭제한다
             */
            if (templateDTO.getTemplateThumbnailFile() != null
                    && !templateDTO.getTemplateThumbnailFile().isEmpty()) {

                if (!McpString.isNullOrEmpty(orgTemplate.getTemplateThumb())) {
                    templateService.deleteTemplateImage(orgTemplate);
                }
                String imgPath = templateService.saveTemplateImage(newTemplate,
                        templateDTO.getTemplateThumbnailFile());
                newTemplate.setTemplateThumb(imgPath);

            } else if (!McpString.isNullOrEmpty(orgTemplate.getTemplateThumb())
                    && McpString.isNullOrEmpty(newTemplate.getTemplateThumb())) {
                templateService.deleteTemplateImage(orgTemplate);
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

            if (!McpString.isNullOrEmpty(returnValDTO.getTemplateThumb())) {
                returnValDTO.setTemplateThumb("/image/" + returnValDTO.getTemplateThumb());
            }

            // purge 날림!!
            if (returnVal.getDomain() == null) {
                // 공통 도메인일 때
                List<String> domainIds =
                        templateService.findDomainIdListByTemplateSeq(returnVal.getTemplateSeq());
                purgeHelper.purgeTms(request, domainIds, MokaConstants.ITEM_TEMPLATE,
                        returnVal.getTemplateSeq());
            } else {
                purgeHelper.purgeTms(request, returnVal.getDomain().getDomainId(),
                        MokaConstants.ITEM_TEMPLATE, returnVal.getTemplateSeq());
            }

            // 리턴값 셋팅
            ResultDTO<TemplateDTO> resultDTO = new ResultDTO<TemplateDTO>(returnValDTO);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE TEMPLATE] seq: {}) {}", templateDTO.getTemplateSeq(),
                    e.getMessage());
            throw new Exception(messageByLocale.get("tps.template.error.save", request), e);
        }
    }

    /**
     * 템플릿을 복사한다
     * 
     * @param request HTTP요청
     * @param seq 템플릿ID
     * @param domain 도메인DTO
     * @param templateName 템플릿명
     * @param principal Principal
     * @return 복사한 데이터
     * @throws InvalidDataException 데이터유효성검사
     * @throws Exception 그외 에러
     */
    @PostMapping("/{seq}/copy")
    public ResponseEntity<?> copyTemplate(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.template.error.invalid.templateSeq}") Long seq,
            DomainSimpleDTO domain, String templateName, Principal principal)
            throws InvalidDataException, Exception {

        // 조회
        String message = messageByLocale.get("tps.template.error.noContent", request);
        Template template = templateService.findByTemplateSeq(seq)
                .orElseThrow(() -> new NoDataException(message));

        TemplateDTO templateDTO = modelMapper.map(template, TemplateDTO.class);
        templateDTO.setTemplateSeq(null);
        templateDTO.setTemplateName(templateName);
        templateDTO.setDomain(domain);

        return this.postTemplate(request, templateDTO, principal);
    }

    /**
     * <pre>
     * 템플릿을 삭제한다
     * </pre>
     * 
     * @param request HTTP요청
     * @param templateSeq 템플릿아이디
     * @return 템플릿 삭제 여부
     * @throws NoDataException 데이터없음
     * @throws Exception 관련아이템 있으면 삭제 불가능, 그외 에러
     */
    @DeleteMapping("/{seq}")
    public ResponseEntity<?> deleteTemplate(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.template.error.invalid.templateSeq}") Long templateSeq)
            throws NoDataException, Exception {

        // 템플릿 확인
        String message = messageByLocale.get("tps.template.error.noContent", request);
        Template template = templateService.findByTemplateSeq(templateSeq)
                .orElseThrow(() -> new NoDataException(message));

        // 관련 데이터 확인
        Boolean hasRels = relationHelper.hasRelations(templateSeq, MokaConstants.ITEM_TEMPLATE);
        if (hasRels) {
            throw new Exception(messageByLocale.get("tps.template.error.delete.related", request));
        }

        try {

            // 템플릿 삭제
            templateService.deleteTemplate(template);

            // 썸네일 파일 삭제
            if (McpString.isNotEmpty(template.getTemplateThumb())) {
                templateService.deleteTemplateImage(template);
            }

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE TEMPLATE] seq: {}) {}", templateSeq, e.getMessage());
            throw new Exception(messageByLocale.get("tps.template.error.delete", request), e);
        }
    }

    /**
     * <pre>
     * 관련 아이템이 있는지 확인한다
     * </pre>
     * 
     * @param request HTTP요청
     * @param seq 템플릿아이디
     * @return 관련 아이템 존재 여부
     * @throws NoDataException 데이터없음
     */
    @GetMapping("/{seq}/hasRelations")
    public ResponseEntity<?> hasRelations(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.template.error.invalid.templateSeq}") Long seq)
            throws NoDataException {

        // 템플릿 확인
        String message = messageByLocale.get("tps.template.error.noContent", request);
        templateService.findByTemplateSeq(seq).orElseThrow(() -> new NoDataException(message));

        Boolean chkRels = relationHelper.hasRelations(seq, MokaConstants.ITEM_TEMPLATE);
        ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels);

        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 관련 아이템을 찾는다
     * </pre>
     * 
     * @param request HTTP요청
     * @param search 검새 조건
     * @return 관련아이템 목록
     * @throws NoDataException 데이터없음
     * @throws Exception 잘못된 분류
     */
    @GetMapping("/{seq}/relations")
    public ResponseEntity<?> getRelations(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.template.error.invalid.templateSeq}") Long seq,
            @Valid @SearchParam RelSearchDTO search) throws NoDataException, Exception {

        search.setRelSeq(seq);
        search.setRelSeqType(MokaConstants.ITEM_TEMPLATE);

        // 템플릿 확인
        String message = messageByLocale.get("tps.template.error.noContent", request);
        templateService.findByTemplateSeq(seq).orElseThrow(() -> new NoDataException(message));

        return relationHelper.findRelations(search);
    }

    /**
     * <pre>
     * 템플릿 히스토리 목록을 조회한다
     * </pre>
     * 
     * @param request HTTP요청
     * @param templateSeq 템플릿아이디
     * @param search 검색조건
     * @return 템플릿 히스토리 목록
     */
    @GetMapping("/{seq}/histories")
    public ResponseEntity<?> getHistories(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.template.error.invalid.templateSeq}") Long templateSeq,
            @Valid @SearchParam SearchDTO search) {

        // 페이징조건 설정 (order by seq desc)
        List<String> sort = new ArrayList<String>();
        sort.add("seq,desc");
        search.setSort(sort);
        Pageable pageable = search.getPageable();

        // 조회
        Page<TemplateHist> historyList =
                templateHistService.findHistories(templateSeq, search, pageable);

        // entity -> DTO
        List<TemplateHistDTO> historiesDTO =
                modelMapper.map(historyList.getContent(), TemplateHistDTO.TYPE);

        ResultListDTO<TemplateHistDTO> resultList = new ResultListDTO<TemplateHistDTO>();
        resultList.setTotalCnt(historyList.getTotalElements());
        resultList.setList(historiesDTO);

        ResultDTO<ResultListDTO<TemplateHistDTO>> resultDTO =
                new ResultDTO<ResultListDTO<TemplateHistDTO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 템플릿 히스토리를 조회한다
     * </pre>
     * 
     * @param request HTTP 요청
     * @param seq 순번
     * @return 템플릿 히스토리
     * @throws NoDataException 데이터없음
     */
    @GetMapping("/{templateSeq}/histories/{seq}")
    public ResponseEntity<?> getHistories(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.template.error.invalid.templateSeq}") Long seq)
            throws NoDataException {

        // 템플릿 히스토리 조회
        String message = messageByLocale.get("tps.template.error.history.noContent", request);
        TemplateHist history = templateHistService.findHistory(seq)
                .orElseThrow(() -> new NoDataException(message));
        TemplateHistDTO historyDTO = modelMapper.map(history, TemplateHistDTO.class);

        ResultDTO<TemplateHistDTO> resultDTO = new ResultDTO<TemplateHistDTO>(historyDTO);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 템플릿 데이터 유효성 검사
     * </pre>
     * 
     * @param template 템플릿DTO
     * @return 타당하지 않은 데이터 목록
     */
    private List<InvalidDataDTO> validData(TemplateDTO template) {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (template != null) {
            // 문법검사
            try {
                if (!McpString.isNullOrEmpty(template.getTemplateBody())) {
                    TemplateParserHelper.checkSyntax(template.getTemplateBody());
                }
            } catch (TemplateParseException e) {
                String message = e.getMessage();
                String extra = Integer.toString(e.getLineNumber());
                invalidList.add(new InvalidDataDTO("templateBody", message, extra));
            } catch (IOException e) {
                String message = e.getMessage();
                invalidList.add(new InvalidDataDTO("templateBody", message));
            }
            // 등록한 파일이 이미지 파일인지 체크
            if (template.getTemplateThumbnailFile() != null
                    && !template.getTemplateThumbnailFile().isEmpty()) {
                boolean isImage = ImageUtil.isImage(template.getTemplateThumbnailFile());
                if (!isImage) {
                    String message = messageByLocale.get("tps.template.error.invalid.thumbnail");
                    invalidList.add(new InvalidDataDTO("thumbnail", message));
                }
            }
        }
        return invalidList;
    }
}
