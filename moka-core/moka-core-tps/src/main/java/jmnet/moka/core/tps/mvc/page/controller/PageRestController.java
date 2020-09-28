package jmnet.moka.core.tps.mvc.page.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;

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
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.dto.HistDTO;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
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
import jmnet.moka.core.tps.mvc.page.entity.PageHist;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;

/**
 * 페이지 2020. 3. 8. ssc 최초생성
 * 
 * @since 2020. 3. 8. 오후 2:09:06
 * @author ssc
 */
@RestController
@Validated
@RequestMapping("/api/pages")
public class PageRestController {

    // private static final Logger logger = LoggerFactory.getLogger(PageRestController.class);

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

    /**
     * 페이지목록조회(트리용)
     * 
     * @param request 요청
     * @param search 검색조건(검색조건있으나, 해당되는 페이지만 조회되는것은 아니다.)
     * @return 페이지 트리 목록(PageNode)
     * @throws NoDataException 등록된 페이지 없음
     */
    @GetMapping("/tree")
    public ResponseEntity<?> getPageTree(HttpServletRequest request,
            @Valid @SearchParam PageSearchDTO search) throws NoDataException {

        PageNode pageNode = pageService.makeTree(search);
        if (pageNode == null) {
            throw new NoDataException(messageByLocale.get("tps.page.error.noContent", request));
        }
        ResultDTO<PageNode> resultDto = new ResultDTO<PageNode>(pageNode);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 페이지정보 조회
     * 
     * @param request 요청
     * @param pageSeq 페이지아이디 (필수)
     * @return 페이지정보
     * @throws NoDataException 데이타없음
     * @throws InvalidDataException 데이타유효성오류
     * @throws Exception 기타예외
     */
    @GetMapping("/{pageSeq}")
    public ResponseEntity<?> getPage(HttpServletRequest request,
            @PathVariable("pageSeq") @Min(value = 0,
                    message = "{tps.page.error.invalid.pageSeq}") Long pageSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, pageSeq, null);

        Page page = pageService.findByPageSeq(pageSeq).orElseThrow(() -> new NoDataException(
                messageByLocale.get("tps.page.error.noContent", request)));

        PageDTO dto = modelMapper.map(page, PageDTO.class);
        if (page.getParent() != null) {
            ParentPageDTO parentDto = modelMapper.map(page.getParent(), ParentPageDTO.class);
            dto.setParent(parentDto);
        }
        ResultDTO<PageDTO> resultDto = new ResultDTO<PageDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 페이지정보 유효성 검사
     * 
     * @param request 요청
     * @param pageSeq 페이지 순번. 0이면 등록일때 유효성 검사
     * @param pageDTO 페이지정보
     * @throws InvalidDataException 유효성예외
     * @throws Exception 기타예외
     */
    private void validData(HttpServletRequest request, Long pageSeq, PageDTO pageDTO)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (pageDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (pageSeq > 0 && !pageSeq.equals(pageDTO.getPageSeq())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // command명칭 사용불가
            if (Arrays.asList(serviceNameExcludes).contains(pageDTO.getPageServiceName())) {
                String message =
                        messageByLocale.get("tps.page.error.invalid.pageServiceName3", request);
                invalidList.add(new InvalidDataDTO("pageServiceName", message));
            }

            // PageUrl 중복검사
            List<Page> pageList = pageService.findByPageUrl(pageDTO.getPageUrl(),
                    pageDTO.getDomain().getDomainId());
            if (pageList.size() > 0) {
                for (Page page : pageList) {
                    if (!page.getPageSeq().equals(pageDTO.getPageSeq())) {
                        String message = messageByLocale
                                .get("tps.page.error.invalid.pageServiceName2", request);
                        invalidList.add(new InvalidDataDTO("pageServiceName", message));
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
            } catch (Exception e) {
                throw e;
            }

            if (invalidList.size() > 0) {
                String validMessage = messageByLocale.get("tps.page.error.invalidContent", request);
                throw new InvalidDataException(invalidList, validMessage);
            }
        }


    }

    /**
     * 페이지등록
     * 
     * @param request 요청
     * @param pageDTO 등록할 페이지정보
     * @param principal 로그인 사용자 세션
     * @return 등록된 페이지정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception 기타예외
     */
    @PostMapping(headers = {"content-type=application/json"},
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postPage(HttpServletRequest request,
            @RequestBody @Valid PageDTO pageDTO, Principal principal)
            throws InvalidDataException, Exception {

        if (McpString.isEmpty(pageDTO.getPageBody())) {
            pageDTO.setPageBody("");
        } ;

        // 데이타유효성검사.
        validData(request, (long) 0, pageDTO);

        // 등록
        Page page = modelMapper.map(pageDTO, Page.class);
        page.setCreateYmdt(McpDate.nowStr());
        page.setCreator(principal.getName());
        Page returnValue = pageService.insertPage(page);

        // 결과리턴
        PageDTO dto = modelMapper.map(returnValue, PageDTO.class);
        if (returnValue.getParent() != null) {
            ParentPageDTO parentDto = modelMapper.map(returnValue.getParent(), ParentPageDTO.class);
            dto.setParent(parentDto);
        }
        ResultDTO<PageDTO> resultDto = new ResultDTO<PageDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 페이지수정
     * 
     * @param request 요청
     * @param pageSeq 페이지번호
     * @param pageDTO 수정할 페이지정보
     * @param principal 로그인 사용자 세션
     * @return 수정된 페이지정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException 데이타 없음
     * @throws Exception 기타예외
     */
    @PutMapping(value = "/{seq}", headers = {"content-type=application/json"},
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putPage(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.page.error.invalid.pageSeq}") Long pageSeq,
            @RequestBody @Valid PageDTO pageDTO, Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(request, pageSeq, pageDTO);

        // 수정
        Page newPage = modelMapper.map(pageDTO, Page.class);
        Page orgPage = pageService.findByPageSeq(pageSeq).orElseThrow(() -> new NoDataException(
                messageByLocale.get("tps.page.error.noContent", request)));

        newPage.setCreateYmdt(orgPage.getCreateYmdt());
        newPage.setCreator(orgPage.getCreator());
        newPage.setModifiedYmdt(McpDate.nowStr());
        newPage.setModifier(principal.getName());
        Page returnValue = pageService.updatePage(newPage);

        // 페이지 퍼지. 성공실패여부는 리턴하지 않는다.
        purgeHelper.purgeTms(request, returnValue.getDomain().getDomainId(), MokaConstants.ITEM_PAGE,
                returnValue.getPageSeq());

        // 결과리턴
        PageDTO dto = modelMapper.map(returnValue, PageDTO.class);
        if (returnValue.getParent() != null) {
            ParentPageDTO parentDto = modelMapper.map(returnValue.getParent(), ParentPageDTO.class);
            dto.setParent(parentDto);
        }
        ResultDTO<PageDTO> resultDto = new ResultDTO<PageDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 페이지삭제
     * 
     * @param request 요청
     * @param pageSeq 삭제 할 페이지순번 (필수)
     * @param principal 로그인 사용자 세션
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException 페이지정보 없음 오류
     * @throws Exception 기타예외
     */
    @DeleteMapping("/{seq}")
    public ResponseEntity<?> deletePage(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.page.error.invalid.pageSeq}") Long pageSeq,
            Principal principal) throws InvalidDataException, NoDataException, Exception {

        // 1.1 아이디체크
        validData(request, pageSeq, null);

        // 1.2. 데이타 존재여부 검사
        Page page = pageService.findByPageSeq(pageSeq).orElseThrow(() -> new NoDataException(
                messageByLocale.get("tps.page.error.noContent", request)));

        // 2. 삭제
        pageService.deletePage(page, principal.getName());

        // 3. 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 페이지서비스URL사용여부 체크
     * 
     * @param request 요청
     * @param pageUrl 페이지 서비스 URL
     * @param domainId 도메인아이디
     * @param pageSeq 페이지가 0 보다 클 경우, 해당 페이지는 제외하고 서비되는 URL을 찾는다.
     * @return URL사용여부
     */
    @GetMapping("/isPageUrl")
    public ResponseEntity<?> getIsPageUrl(HttpServletRequest request,
            @RequestParam(name = "pageUrl") @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN,
                    message = "{tps.page.error.invalid.pageUrl2}") String pageUrl,
            @RequestParam(name = "domainId") @Pattern(regexp = "[0-9]{4}$",
                    message = "{tps.domain.error.invalid.domainId}") String domainId,
            @RequestParam(name = "pageSeq", defaultValue = "0") @Min(value = 0,
                    message = "{tps.page.error.invalid.pageSeq}") Long pageSeq) {

        List<Page> pageList = pageService.findByPageUrl(pageUrl, domainId);

        Boolean ret = false;
        if (pageList.size() > 0) {
            for (Page page : pageList) {
                if (page.getPageSeq().equals(pageSeq)) {
                    ret = true;
                }
            }
        }

        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(ret);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 페이지 PURGE
     * 
     * @param request 요청
     * @param pageSeq 페이지 순번 (필수)
     * @return 퍼지성공여부
     * @throws URISyntaxException
     * @throws IOException
     * @throws Exception 기타예외
     */
    @GetMapping("/{pageSeq}/purge")
    public ResponseEntity<?> getPurge(HttpServletRequest request,
            @PathVariable("pageSeq") @Min(value = 0,
                    message = "{tps.page.error.invalid.pageSeq}") Long pageSeq)
            throws Exception {

        // 데이타유효성검사.
        validData(request, pageSeq, null);

        // 1.1 아이디체크
        validData(request, pageSeq, null);

        // 1.2. 데이타 존재여부 검사
        Page page = pageService.findByPageSeq(pageSeq).orElseThrow(() -> new NoDataException(
                messageByLocale.get("tps.page.error.noContent", request)));

        // 페이지 바니시 퍼지. 성공실패여부는 리턴하지 않는다.
        String message = purgeHelper.purgeVarnish(request, page);

        boolean success = true;
        if (McpString.isNotEmpty(message))
            success = false;

        ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(success);
        resultDTO.getHeader().setSuccess(success);
        resultDTO.getHeader().setMessage(message);

        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 히스토리 목록 조회
     * 
     * @param request 요청
     * @param pageSeq 페이지순번
     * @param search 검색조건
     * @return 히스토리 목록
     */
    @GetMapping("/{pageSeq}/histories")
    public ResponseEntity<?> getHistoryList(HttpServletRequest request,
            @PathVariable("pageSeq") @Min(value = 0,
                    message = "{tps.page.error.invalid.pageSeq}") Long pageSeq,
            @Valid @SearchParam HistSearchDTO search) {

        search.setSeq(pageSeq);

        // 조회
        org.springframework.data.domain.Page<PageHist> histList =
                pageService.findHistoryList(search, search.getPageable());

        // entity -> DTO
        List<HistDTO> histDTOList =
                histList.stream().map(this::convertToHistDto).collect(Collectors.toList());

        ResultListDTO<HistDTO> resultList = new ResultListDTO<HistDTO>();
        resultList.setTotalCnt(histList.getTotalElements());
        resultList.setList(histDTOList);

        ResultDTO<ResultListDTO<HistDTO>> resultDTO =
                new ResultDTO<ResultListDTO<HistDTO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * Page History Entity -> History DTO 변환
     * 
     * @param hist history정보
     * @return historyDTO
     */
    private HistDTO convertToHistDto(PageHist hist) {
        HistDTO histDTO = modelMapper.map(hist, HistDTO.class);
        histDTO.setBody(hist.getPageBody());
        histDTO.setCreateYmdt(hist.getCreateYmdt());
        histDTO.setCreator(hist.getCreator());
        return histDTO;
    }

    /**
     * 페이지목록조회(목용)
     * 
     * @param request 요청
     * @param search 검색조건
     * @return 페이지 목록(PageDTO)
     * @throws NoDataException 등록된 페이지 없음
     */
    @GetMapping
    public ResponseEntity<?> getPagList(HttpServletRequest request,
            @Valid @SearchParam PageSearchDTO search) throws NoDataException {
        // 페이징조건 설정
        Pageable pageable = search.getPageable();

        // 조회
        org.springframework.data.domain.Page<Page> returnValue =
                pageService.findList(search, pageable);

        // 리턴값 설정
        ResultListDTO<PageDTO> resultListMessage = new ResultListDTO<PageDTO>();
        List<PageDTO> pageDtoList = modelMapper.map(returnValue.getContent(), PageDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(pageDtoList);

        ResultDTO<ResultListDTO<PageDTO>> resultDto =
                new ResultDTO<ResultListDTO<PageDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



}
