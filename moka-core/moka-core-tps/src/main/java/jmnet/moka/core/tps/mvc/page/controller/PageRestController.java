package jmnet.moka.core.tps.mvc.page.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
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
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.dto.PageNode;
import jmnet.moka.core.tps.mvc.page.dto.PageSearchDTO;
import jmnet.moka.core.tps.mvc.page.dto.ParentPageDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 페이지 API
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/pages")
public class PageRestController {

    @Autowired
    private PageService pageService;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    TemplateService templateService;

    @Autowired
    ComponentService componentService;

    @Autowired
    ContainerService containerService;

    @Value("${tps.page.servicename.excludes}")
    private String[] serviceNameExcludes;

    @Autowired
    private PurgeHelper purgeHelper;

    @Autowired
    private TpsLogger tpsLogger;

    /**
     * 페이지 목록조회(트리용)
     *
     * @param search 검색조건(검색조건있으나, 해당되는 페이지만 조회되는것은 아니다.)
     * @return 페이지 트리 목록(PageNode)
     */
    @ApiOperation(value = "페이지목록조회(트리용)")
    @GetMapping("/tree")
    public ResponseEntity<?> getPageTree(@Valid @SearchParam PageSearchDTO search) {

        PageNode pageNode = pageService.makeTree(search);

        ResultDTO<PageNode> resultDto = new ResultDTO<PageNode>(pageNode);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 페이지 상세조회
     *
     * @param pageSeq 페이지아이디 (필수)
     * @return 페이지정보
     * @throws NoDataException      데이타없음
     * @throws InvalidDataException 데이타유효성오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "페이지 상세조회")
    @GetMapping("/{pageSeq}")
    public ResponseEntity<?> getPage(@PathVariable("pageSeq") @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(pageSeq, null, ActionType.SELECT);

        Page page = pageService.findPageBySeq(pageSeq)
                               .orElseThrow(() -> {
                                   String message = messageByLocale.get("tps.common.error.no-data");
                                   tpsLogger.fail(message, true);
                                   return new NoDataException(message);
                               });

        PageDTO dto = modelMapper.map(page, PageDTO.class);
        if (page.getParent() != null) {
            ParentPageDTO parentDto = modelMapper.map(page.getParent(), ParentPageDTO.class);
            dto.setParent(parentDto);
        }
        ResultDTO<PageDTO> resultDto = new ResultDTO<PageDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 페이지정보 유효성 검사
     *
     * @param pageSeq 페이지 순번. 0이면 등록일때 유효성 검사
     * @param pageDTO 페이지정보
     * @param actionType 동작유형
     * @throws InvalidDataException 유효성예외
     * @throws Exception            기타예외
     */
    private void validData(Long pageSeq, PageDTO pageDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (pageDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (pageSeq > 0 && !pageSeq.equals(pageDTO.getPageSeq())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                invalidList.add(new InvalidDataDTO("matchId", message));
                tpsLogger.fail(actionType, message, true);
            }

            // command명칭 사용불가
            if (Arrays.asList(serviceNameExcludes)
                      .contains(pageDTO.getPageServiceName())) {
                String message = messageByLocale.get("tps.page.error.invalid.pageServiceName");
                invalidList.add(new InvalidDataDTO("pageServiceName", message));
                tpsLogger.fail(actionType, message, true);
            }

            // PageUrl 중복검사
            List<Page> pageList = pageService.findPageByPageUrl(pageDTO.getPageUrl(), pageDTO.getDomain()
                                                                                             .getDomainId());
            if (pageList.size() > 0) {
                for (Page page : pageList) {
                    if (!page.getPageSeq()
                             .equals(pageDTO.getPageSeq())) {
                        String message = messageByLocale.get("tps.page.error.duplicate.pageServiceName");
                        invalidList.add(new InvalidDataDTO("pageServiceName", message));
                        tpsLogger.fail(actionType, message, true);
                    }
                }
            }

            // 문법검사
            try {
                TemplateParserHelper.checkSyntax(pageDTO.getPageBody());
            } catch (TemplateParseException e) {
                String message = e.getMessage();
                String extra = Integer.toString(e.getLineNumber());
                invalidList.add(new InvalidDataDTO("pageBody", message, extra));
                tpsLogger.fail(actionType, message, true);
            } catch (Exception e) {
                String message = e.getMessage();
                invalidList.add(new InvalidDataDTO("pageBody", message));
                tpsLogger.fail(actionType, message, true);
            }

            if (invalidList.size() > 0) {
                String validMessage = messageByLocale.get("tps.common.error.invalidContent");
                throw new InvalidDataException(invalidList, validMessage);
            }
        }


    }

    /**
     * 페이지 등록
     *
     * @param pageDTO   등록할 페이지정보
     * @return 등록된 페이지정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "페이지 등록")
    @PostMapping(headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postPage(@RequestBody @Valid PageDTO pageDTO)
            throws InvalidDataException, Exception {

        if (McpString.isEmpty(pageDTO.getPageBody())) {
            pageDTO.setPageBody("");
        }

        // 데이타유효성검사.
        validData((long) 0, pageDTO, ActionType.INSERT);


        Page page = modelMapper.map(pageDTO, Page.class);

        try {
            // 등록
            Page returnValue = pageService.insertPage(page);

            // 결과리턴
            PageDTO dto = modelMapper.map(returnValue, PageDTO.class);
            if (returnValue.getParent() != null) {
                ParentPageDTO parentDto = modelMapper.map(returnValue.getParent(), ParentPageDTO.class);
                dto.setParent(parentDto);
            }

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<PageDTO> resultDto = new ResultDTO<PageDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT PAGE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT PAGE]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.insert"), e);
        }

    }

    /**
     * 페이지 수정
     *
     * @param pageSeq   페이지번호
     * @param pageDTO   수정할 페이지정보
     * @return 수정된 페이지정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "페이지 수정")
    @PutMapping(value = "/{pageSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putPage(@PathVariable("pageSeq") @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq,
            @RequestBody @Valid PageDTO pageDTO)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(pageSeq, pageDTO, ActionType.UPDATE);

        // 수정
        Page newPage = modelMapper.map(pageDTO, Page.class);
        pageService.findPageBySeq(pageSeq)
              .orElseThrow(() -> {
                  String message = messageByLocale.get("tps.common.error.no-data");
                  tpsLogger.fail(ActionType.UPDATE, message, true);
                  return new NoDataException(message);
              });

        try {
            Page returnValue = pageService.updatePage(newPage);

            // 페이지 퍼지. 성공실패여부는 리턴하지 않는다.
            purgeHelper.purgeTms(returnValue.getDomain()
                                            .getDomainId(), MokaConstants.ITEM_PAGE, returnValue.getPageSeq());

            // 결과리턴
            PageDTO dto = modelMapper.map(returnValue, PageDTO.class);
            if (returnValue.getParent() != null) {
                ParentPageDTO parentDto = modelMapper.map(returnValue.getParent(), ParentPageDTO.class);
                dto.setParent(parentDto);
            }

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<PageDTO> resultDto = new ResultDTO<PageDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE PAGE] seq: {} {}", pageSeq, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE PAGE]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.update"), e);
        }
    }

    /**
     * 페이지 삭제
     *
     * @param pageSeq   삭제 할 페이지순번 (필수)
     * @param principal 로그인 사용자 세션
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      페이지정보 없음 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "페이지 삭제")
    @DeleteMapping("/{pageSeq}")
    public ResponseEntity<?> deletePage(@PathVariable("pageSeq") @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq,
            Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 1.1 아이디체크
        //validData(pageSeq, null, ActionType.DELETE);

        // 1.2. 데이타 존재여부 검사
        Page page = pageService.findPageBySeq(pageSeq)
                               .orElseThrow(() -> {
                                   String message = messageByLocale.get("tps.common.error.no-data");
                                   tpsLogger.fail(ActionType.DELETE, message, true);
                                   return new NoDataException(message);
                               });

        try {
            // 2. 삭제
            pageService.deletePage(page, principal.getName());

            // 3. 결과리턴
            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE PAGE] seq: {} {}", pageSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE PAGE]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.delete"), e);
        }
    }

    /**
     * 페이지서 서비스URL 사용여부 체크
     *
     * @param pageUrl  페이지 서비스 URL
     * @param domainId 도메인아이디
     * @param pageSeq  페이지가 0 보다 클 경우, 해당 페이지는 제외하고 서비되는 URL을 찾는다.
     * @return URL사용여부
     */
    @ApiOperation(value = "페이지 서비스URL 사용여부 체크")
    @GetMapping("/isPageUrl")
    public ResponseEntity<?> getIsPageUrl(@RequestParam(name = "pageUrl")
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN, message = "{tps.page.error.pattern.pageUrl}") String pageUrl,
            @RequestParam(name = "domainId") @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId,
            @RequestParam(name = "pageSeq", defaultValue = "0") @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq) {

        List<Page> pageList = pageService.findPageByPageUrl(pageUrl, domainId);

        Boolean ret = false;
        if (pageList.size() > 0) {
            for (Page page : pageList) {
                if (page.getPageSeq()
                        .equals(pageSeq)) {
                    ret = true;
                }
            }
        }

        String message = "";
        if (ret) {
            messageByLocale.get("tps.page.error.duplicate.pageServiceName");
        }
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(ret, message);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    //    /**
    //     * 페이지 PURGE
    //     *
    //     * @param request 요청
    //     * @param pageSeq 페이지 순번 (필수)
    //     * @return 퍼지성공여부
    //     * @throws URISyntaxException
    //     * @throws IOException
    //     * @throws Exception          기타예외
    //     */
    //    @ApiOperation(value = "페이지 PURGE - 삭제될 수 있음")
    //    @GetMapping("/{pageSeq}/purge")
    //    public ResponseEntity<?> getPurge(HttpServletRequest request,
    //            @PathVariable("pageSeq") @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq)
    //            throws Exception {
    //
    //        // 데이타유효성검사.
    //        validData(request, pageSeq, null, ActionType.SELECT);
    //
    //        // 1.1 아이디체크
    //        validData(request, pageSeq, null, ActionType.SELECT);
    //
    //        // 1.2. 데이타 존재여부 검사
    //        Page page = pageService.findPageBySeq(pageSeq)
    //                               .orElseThrow(() -> {
    //                                   String message = messageByLocale.get("tps.page.error.no-data", request);
    //                                   tpsLogger.fail(ActionType.SELECT, message, true);
    //                                   return new NoDataException(message);
    //                               });
    //
    //        // 페이지 바니시 퍼지. 성공실패여부는 리턴하지 않는다.
    //        String message = purgeHelper.purgeVarnish(request, page);
    //
    //        boolean success = true;
    //        if (McpString.isNotEmpty(message)) {
    //            success = false;
    //        }
    //
    //        ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(success);
    //        resultDTO.getHeader()
    //                 .setSuccess(success);
    //        resultDTO.getHeader()
    //                 .setMessage(message);
    //
    //        log.debug("[PAGE PURGE] pageSeq: {}, pageUrl: {}", pageSeq, page.getPageUrl());
    //
    //        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    //    }

    /**
     * 페이지 목록조회(목록용)
     *
     * @param search 검색조건
     * @return 페이지 목록(PageDTO)
     * @throws NoDataException 등록된 페이지 없음
     */
    @ApiOperation(value = "페이지 목록조회(목록용)")
    @GetMapping
    public ResponseEntity<?> getPagList(@Valid @SearchParam PageSearchDTO search) {
        // 페이징조건 설정
        Pageable pageable = search.getPageable();

        // 조회
        org.springframework.data.domain.Page<Page> returnValue = pageService.findAllPage(search, pageable);

        // 리턴값 설정
        ResultListDTO<PageDTO> resultListMessage = new ResultListDTO<PageDTO>();
        List<PageDTO> pageDtoList = modelMapper.map(returnValue.getContent(), PageDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(pageDtoList);

        ResultDTO<ResultListDTO<PageDTO>> resultDto = new ResultDTO<ResultListDTO<PageDTO>>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



}
