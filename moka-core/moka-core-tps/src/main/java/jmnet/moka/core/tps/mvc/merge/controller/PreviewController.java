package jmnet.moka.core.tps.mvc.merge.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.merge.service.MergeService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */


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
@Validated
@Slf4j
@RequestMapping("/preview")
public class PreviewController extends AbstractCommonController {

    @Autowired
    private MergeService mergeService;

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
    @PostMapping("/page")
    public void perviewPage(HttpServletRequest request, HttpServletResponse response, @Valid PageDTO pageDto)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {

        try {
            String html = mergeService.getMergePage(pageDto);
            writeResonse(response, html, pageDto.getPageType());
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

        response
                .getWriter()
                .write(content);
    }

    /**
     * 화면편집 페이지 전체 미리보기
     *
     * @param request   HTTP요청
     * @param response  HTTP응답
     * @param pageSeq   페이지아이디
     * @param principal Principal
     * @throws InvalidDataException         데이터검증
     * @throws NoDataException              데이터없음
     * @throws IOException                  입출력 에러
     * @throws Exception                    나머지 에러
     * @throws TemplateMergeException       TMS 머지 실패
     * @throws UnsupportedEncodingException 인코딩에러
     * @throws TemplateParseException       TMS 파싱 실패
     * @throws TemplateLoadException        TMS 로드 실패
     */
    @GetMapping("/desking/page")
    public void perviewDeskingPage(HttpServletRequest request, HttpServletResponse response, Long pageSeq, Principal principal)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {
        try {
            String pageType = TpsConstants.PAGE_TYPE_HTML;
            String html = mergeService.getMergePageWork(pageSeq, principal.getName(), pageType);
            tpsLogger.success(ActionType.SELECT, true);
            writeResonse(response, html, pageType);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] pageSeq: {} {}", pageSeq, e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.page", request), e);
        }
    }

    /**
     * 편집영역 미리보기
     *
     * @param areaSeq   편집영역seq
     * @param principal 작업자
     * @return 편집영역 랜더링된 HTML소스
     * @throws Exception 예외
     */
    @GetMapping(value = "/desking/area")
    public void getPreviewArea(HttpServletRequest request, HttpServletResponse response, Long areaSeq, Principal principal)
            throws Exception {
        try {
            String html = mergeService.getMergeAreaWork(areaSeq, principal.getName());
            tpsLogger.success(ActionType.SELECT, true);
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] areaSeq: {} {}", areaSeq, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.area", request), e);
        }
    }

    //    /**
    //     * 화면편집 컴포넌트만 미리보기
    //     *
    //     * @param request          요청
    //     * @param response         응답
    //     * @param pageSeq          페이지아이디
    //     * @param componentWorkSeq 컴포넌트워크아이디
    //     * @param principal        Principal
    //     * @throws InvalidDataException         데이터검증
    //     * @throws NoDataException              데이터없음
    //     * @throws IOException                  입출력
    //     * @throws Exception                    나머지 에러
    //     * @throws TemplateMergeException       TMS 머지 실패
    //     * @throws UnsupportedEncodingException 인코딩 에러
    //     * @throws TemplateParseException       TMS 파싱 실패
    //     * @throws TemplateLoadException        TMS 로드 실패
    //     */
    //    @GetMapping("/desking/component")
    //    public void perviewDeskingComponent(HttpServletRequest request, HttpServletResponse response, Long pageSeq, Long componentWorkSeq,
    //            Principal principal)
    //            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
    //            TemplateParseException, TemplateLoadException {
    //
    //        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    //
    //        // 페이지
    //        Page pageInfo = pageService
    //                .findPageBySeq(pageSeq)
    //                .orElseThrow(() -> {
    //                    String message = messageByLocale.get("tps.common.error.no-data", request);
    //                    tpsLogger.fail(ActionType.SELECT, message, true);
    //                    return new NoDataException(message);
    //                });
    //        PageDTO pageDto = modelMapper.map(pageInfo, PageDTO.class);
    //        PageItem pageItem = pageDto.toPageItem();
    //        pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
    //                .now()
    //                .format(df));
    //
    //        // 도메인
    //        Domain domainInfo = domainService
    //                .findDomainById(pageDto
    //                        .getDomain()
    //                        .getDomainId())
    //                .orElseThrow(() -> {
    //                    String message = messageByLocale.get("tps.common.error.no-data", request);
    //                    tpsLogger.fail(ActionType.SELECT, message, true);
    //                    return new NoDataException(message);
    //                });
    //        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
    //        DomainItem domainItem = domainDto.toDomainItem();
    //
    //        try {
    //            // 컴포넌트 : work 컴포넌트정보를 모두 보내지는 않는다.
    //            ComponentWorkVO componentVO = componentWorkMapper.findComponentWorkBySeq(componentWorkSeq);
    //            if (componentVO == null) {
    //                String message = messageByLocale.get("tps.common.error.no-data", request);
    //                tpsLogger.fail(ActionType.SELECT, message, true);
    //                throw new NoDataException(message);
    //            }
    //            ComponentItem componentItem = componentVO.toComponentItem();
    //            componentItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
    //                    .now()
    //                    .format(df));
    //
    //            List<String> componentIdList = new ArrayList<String>(1);
    //            componentIdList.add(componentVO
    //                    .getComponentSeq()
    //                    .toString());
    //
    //            // merger
    //            MokaPreviewTemplateMerger dtm =
    //                    (MokaPreviewTemplateMerger) appContext.getBean("previewWorkTemplateMerger", domainItem, principal.getName(), 0, componentIdList);
    //
    //            // 랜더링
    //            StringBuilder sb = dtm.merge(pageItem, componentItem, false);
    //            tpsLogger.success(ActionType.SELECT, true);
    //            writeResonse(response, sb.toString(), pageDto.getPageType());
    //        } catch (Exception e) {
    //            log.error("[FAIL TO MERGE] componentWorkSeq:{} {}", componentWorkSeq, e.getMessage());
    //            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
    //            throw new Exception(messageByLocale.get("tps.merge.error.component", request), e);
    //        }
    //    }

}
