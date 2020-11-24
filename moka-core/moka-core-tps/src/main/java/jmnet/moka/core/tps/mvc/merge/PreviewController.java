package jmnet.moka.core.tps.mvc.merge;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tms.merge.MokaPreviewTemplateMerger;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.desking.mapper.ComponentWorkMapper;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * <pre>
 * 사용자 권한
 * 2020. 1. 28. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 28. 오후 2:09:06
 */
@Controller
@Slf4j
public class PreviewController {
    @Autowired
    private GenericApplicationContext appContext;

    @Autowired
    private DomainService domainService;

    @Autowired
    private PageService pageService;

    @Autowired
    private ComponentWorkMapper componentWorkMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TpsLogger tpsLogger;

    //    @GetMapping("/preview")
    //    public ResponseEntity<?> perview(HttpServletRequest request)
    //            throws Exception {
    //
    //        DomainItem domainItem = new DomainItem("1000", "news.msp.com", "http://localhost:8081", "demo_api");
    //        try {
    //            // MspPreviewTemplateMerger dtm =
    //            // appContext.getBean(MspPreviewTemplateMerger.class, domainItem);
    //            MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean("previewTemplateMerger", domainItem);
    //
    //            PageItem pageItem = (PageItem) dtm.getItem(MokaConstants.ITEM_PAGE, "4");
    //            StringBuilder sb = dtm.merge(pageItem, null, true);
    //
    //            return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    //        } catch (Exception e) {
    //            logger.error("Fail to Merge : 4", e);
    //            throw new Exception(messageByLocale.get("tps.common.error.merge", request), e);
    //        }
    //    }

    /**
     * 페이지 미리보기
     *
     * @param request 요청
     * @param pageDto 페이지
     * @return 페이지 미리보기
     * @throws InvalidDataException         페이지정보오류
     * @throws NoDataException              도메인,페이지 정보 없음 오류
     * @throws IOException                  입출력오류
     * @throws Exception                    기타오류
     * @throws TemplateMergeException       tems 머징오류
     * @throws UnsupportedEncodingException 인코딩오류
     * @throws TemplateParseException       tems 문법오류
     * @throws TemplateLoadException        tems 로딩오류
     */
    @PostMapping("/preview/page")
    public void perviewPage(HttpServletRequest request, HttpServletResponse response, @Valid PageDTO pageDto)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {

        // 도메인
        Domain domainInfo = domainService.findDomainById(pageDto.getDomain()
                                                                .getDomainId())
                                         .orElseThrow(() -> {
                                             String message = messageByLocale.get("tps.domain.error.no-data", request);
                                             tpsLogger.fail(ActionType.SELECT, message, true);
                                             return new NoDataException(message);
                                         });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // 페이지
        PageItem pageItem = pageDto.toPageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime.now()
                                                               .format(df));

        try {
            // merger
            // MspPreviewTemplateMerger dtm =
            // appContext.getBean(MspPreviewTemplateMerger.class, domainItem);
            MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean("previewTemplateMerger", domainItem);

            // 랜더링
            StringBuilder sb = dtm.merge(pageItem, null, true);
            tpsLogger.success(ActionType.SELECT, true);
            writeResonse(response, sb.toString(), pageDto.getPageType());
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] pageSeq: {} {}", pageDto.getPageSeq(), e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.page", request), e);
        }
    }

    private void writeResonse(HttpServletResponse response, String content, String pageType)
            throws IOException {
        response.setHeader("X-XSS-Protection", "0");
        if (pageType != null) {
            response.setContentType(pageType + "; charset=UTF-8");
        } else {
            response.setContentType("text/html; charset=UTF-8");
        }

        response.getWriter()
                .write(content);
    }

    /**
     * 화면편집 페이지 전체 미리보기
     *
     * @param request    HTTP요청
     * @param response   HTTP응답
     * @param pageSeq    페이지아이디
     * @param principal  Principal
     * @param editionSeq 예약순번
     * @throws InvalidDataException         데이터검증
     * @throws NoDataException              데이터없음
     * @throws IOException                  입출력 에러
     * @throws Exception                    나머지 에러
     * @throws TemplateMergeException       TMS 머지 실패
     * @throws UnsupportedEncodingException 인코딩에러
     * @throws TemplateParseException       TMS 파싱 실패
     * @throws TemplateLoadException        TMS 로드 실패
     */
    @GetMapping("/preview/desking/page")
    public void perviewDeskingPage(HttpServletRequest request, HttpServletResponse response, Long pageSeq, Principal principal)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {

        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);

        // 페이지
        Page pageInfo = pageService.findPageBySeq(pageSeq)
                                   .orElseThrow(() -> {
                                       String message = messageByLocale.get("tps.common.error.no-data", request);
                                       tpsLogger.fail(ActionType.SELECT, message, true);
                                       return new NoDataException(message);
                                   });
        PageDTO pageDto = modelMapper.map(pageInfo, PageDTO.class);
        PageItem pageItem = pageDto.toPageItem();
        pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime.now()
                                                               .format(df));

        // 도메인
        Domain domainInfo = domainService.findDomainById(pageDto.getDomain()
                                                                .getDomainId())
                                         .orElseThrow(() -> {
                                             String message = messageByLocale.get("tps.common.error.no-data", request);
                                             tpsLogger.fail(ActionType.SELECT, message, true);
                                             return new NoDataException(message);
                                         });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        try {
            // merger
            MokaPreviewTemplateMerger dtm =
                    (MokaPreviewTemplateMerger) appContext.getBean("previewWorkTemplateMerger", domainItem, principal.getName(),
                                                                   new ArrayList<String>());

            // 랜더링
            StringBuilder sb = dtm.merge(pageItem, null, true);
            tpsLogger.success(ActionType.SELECT, true);
            writeResonse(response, sb.toString(), pageDto.getPageType());
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] pageSeq: {} {}", pageSeq, e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.page", request), e);
        }
    }

    /**
     * 화면편집 컴포넌트만 미리보기
     *
     * @param request          요청
     * @param response         응답
     * @param pageSeq          페이지아이디
     * @param componentWorkSeq 컴포넌트워크아이디
     * @param principal        Principal
     * @throws InvalidDataException         데이터검증
     * @throws NoDataException              데이터없음
     * @throws IOException                  입출력
     * @throws Exception                    나머지 에러
     * @throws TemplateMergeException       TMS 머지 실패
     * @throws UnsupportedEncodingException 인코딩 에러
     * @throws TemplateParseException       TMS 파싱 실패
     * @throws TemplateLoadException        TMS 로드 실패
     */
    @GetMapping("/preview/desking/component")
    public void perviewDeskingComponent(HttpServletRequest request, HttpServletResponse response, Long pageSeq, Long componentWorkSeq,
            Principal principal)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {

        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        // 페이지
        Page pageInfo = pageService.findPageBySeq(pageSeq)
                                   .orElseThrow(() -> {
                                       String message = messageByLocale.get("tps.common.error.no-data", request);
                                       tpsLogger.fail(ActionType.SELECT, message, true);
                                       return new NoDataException(message);
                                   });
        PageDTO pageDto = modelMapper.map(pageInfo, PageDTO.class);
        PageItem pageItem = pageDto.toPageItem();
        pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime.now()
                                                               .format(df));

        // 도메인
        Domain domainInfo = domainService.findDomainById(pageDto.getDomain()
                                                                .getDomainId())
                                         .orElseThrow(() -> {
                                             String message = messageByLocale.get("tps.common.error.no-data", request);
                                             tpsLogger.fail(ActionType.SELECT, message, true);
                                             return new NoDataException(message);
                                         });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        try {
            // 컴포넌트 : work 컴포넌트정보를 모두 보내지는 않는다.
            ComponentWorkVO componentVO = componentWorkMapper.findComponentWorkBySeq(componentWorkSeq);
            if (componentVO == null) {
                String message = messageByLocale.get("tps.common.error.no-data", request);
                tpsLogger.fail(ActionType.SELECT, message, true);
                throw new NoDataException(message);
            }
            ComponentItem componentItem = componentVO.toComponentItem();
            componentItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime.now()
                                                                        .format(df));

            List<String> componentIdList = new ArrayList<String>(1);
            componentIdList.add(componentVO.getComponentSeq()
                                           .toString());

            // merger
            MokaPreviewTemplateMerger dtm =
                    (MokaPreviewTemplateMerger) appContext.getBean("previewWorkTemplateMerger", domainItem, principal.getName(), 0, componentIdList);

            // 랜더링
            StringBuilder sb = dtm.merge(pageItem, componentItem, false);
            tpsLogger.success(ActionType.SELECT, true);
            writeResonse(response, sb.toString(), pageDto.getPageType());
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] componentWorkSeq:{} {}", componentWorkSeq, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.component", request), e);
        }
    }

}
