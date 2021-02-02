package jmnet.moka.core.tps.mvc.merge.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
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
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageDTO;
import jmnet.moka.core.tps.mvc.merge.service.MergeService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicUpdateDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
@Api(tags = {"미리보기 API"})
public class PreviewController extends AbstractCommonController {

    private final MergeService mergeService;

    public PreviewController(MergeService mergeService) {
        this.mergeService = mergeService;
    }

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
    public void perviewPage(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam(hidden = true) HttpServletResponse response,
            @Valid PageDTO pageDto)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {

        try {
            String html = mergeService.getMergePage(pageDto);
            writeResonse(response, html, pageDto.getPageType());
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] pageSeq: {} {}", pageDto.getPageSeq(), e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            String html = "<script>alert('" + messageByLocale.get("tps.merge.error.page", request) + "');window.close();</script>";
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
            //            throw new Exception(messageByLocale.get("tps.merge.error.page", request), e);
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
    public void perviewDeskingPage(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam(hidden = true) HttpServletResponse response,
            @ApiParam("페이지SEQ(필수)") Long pageSeq, @ApiParam("편집영역 일련번호(필수)") Long areaSeq, @ApiParam(hidden = true) Principal principal)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {
        try {
            String pageType = TpsConstants.PAGE_TYPE_HTML;
            String html = mergeService.getMergePageWork(pageSeq, areaSeq, principal.getName(), pageType);
            tpsLogger.success(ActionType.SELECT, true);
            writeResonse(response, html, pageType);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] pageSeq: {} {}", pageSeq, e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            String html = "<script>alert('" + messageByLocale.get("tps.merge.error.page", request) + "');window.close();</script>";
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
            //            throw new Exception(messageByLocale.get("tps.merge.error.page", request), e);
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
    public void getPreviewArea(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam(hidden = true) HttpServletResponse response,
            @ApiParam("편집영역 일련번호(필수)") Long areaSeq, @ApiParam(hidden = true) Principal principal)
            throws Exception {
        try {
            String html = mergeService.getMergeAreaWork(areaSeq, principal.getName());
            tpsLogger.success(ActionType.SELECT, true);
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] areaSeq: {} {}", areaSeq, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            String html = "<script>alert('" + messageByLocale.get("tps.merge.error.area", request) + "');window.close();</script>";
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
            //            throw new Exception(messageByLocale.get("tps.merge.error.area", request), e);
        }
    }

    /**
     * 기사페이지 미리보기
     *
     * @param request        요청
     * @param articlePageDto 기사페이지
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
    @PostMapping("/article-page")
    public void perviewArticlePage(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam(hidden = true) HttpServletResponse response,
            @Valid ArticlePageDTO articlePageDto, @ApiParam("서비스기사아이디(필수)") Long totalId)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {

        try {
            String html = mergeService.getMergeArticlePage(articlePageDto, totalId);
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] artPageSeq: {} {}", articlePageDto.getArtPageSeq(), e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            String html = "<script>alert('" + messageByLocale.get("tps.merge.error.article-page", request) + "');window.close();</script>";
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
            //            throw new Exception(messageByLocale.get("tps.merge.error.article-page", request), e);
        }
    }

    /**
     * 수신기사페이지 미리보기
     *
     * @param request   요청
     * @param response  결과
     * @param rid       수신기사키
     * @param updateDto 수신기사 수정정보
     * @throws InvalidDataException         페이지정보오류
     * @throws NoDataException              도메인,페이지 정보 없음 오류
     * @throws IOException                  입출력오류
     * @throws Exception                    기타오류
     * @throws TemplateMergeException       tems 머징오류
     * @throws UnsupportedEncodingException 인코딩오류
     * @throws TemplateParseException       tems 문법오류
     * @throws TemplateLoadException        tems 로딩오류
     */
    @PostMapping("/rcv-article/{rid}")
    public void perviewRcvArticle(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam(hidden = true) HttpServletResponse response,
            @ApiParam("수신기사아이디(필수)") @PathVariable("rid") Long rid, @ApiParam("수정할 정보(기자목록,분류코드목록,태그목록)") @Valid RcvArticleBasicUpdateDTO updateDto,
            @ApiParam("서비스플랫폼(P/M)") String servicePlatform)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {

        try {
            String html = mergeService.getMergeRcvArticle(rid, updateDto, servicePlatform);
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] rid: {} {}", rid, e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            String html = "<script>alert('" + messageByLocale.get("tps.rcv-article.error.preview", request) + "');window.close();</script>";
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
            //            throw new Exception(messageByLocale.get("tps.merge.error.article-page", request), e);
        }
    }

    /**
     * 등록기사 수정정보로 미리보기
     *
     * @param request         요청
     * @param response        결과
     * @param totalId         기사키
     * @param updateDto       수정정보
     * @param servicePlatform 서비스플랫폼(P/M)
     * @param artType         기사타입
     * @throws InvalidDataException         페이지정보오류
     * @throws NoDataException              도메인,페이지 정보 없음 오류
     * @throws IOException                  입출력오류
     * @throws Exception                    기타오류
     * @throws TemplateMergeException       tems 머징오류
     * @throws UnsupportedEncodingException 인코딩오류
     * @throws TemplateParseException       tems 문법오류
     * @throws TemplateLoadException        tems 로딩오류
     */
    @PostMapping("/article/update/{totalId}")
    public void perviewUpdateArticle(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam(hidden = true) HttpServletResponse response,
            @ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") Long totalId,
            @ApiParam("수정할 정보(제목,본문,기자목록,분류코드목록,태그목록)") @Valid ArticleBasicUpdateDTO updateDto, @ApiParam("서비스플랫폼(P/M)") String servicePlatform,
            @ApiParam("기사유형") String artType)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {

        try {
            String html = mergeService.getMergeUpdateArticle(totalId, updateDto, servicePlatform, artType);
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] totalId: {} {}", totalId, e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            String html = "<script>alert('" + messageByLocale.get("tps.article.error.preview", request) + "');window.close();</script>";
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
            //            throw new Exception(messageByLocale.get("tps.merge.error.article-page", request), e);
        }
    }

    /**
     * 등록기사 미리보기
     *
     * @param request         요청
     * @param response        결과
     * @param totalId         기사키
     * @param servicePlatform 서비스플랫폼(P/M)
     * @param artType         기사타입
     * @throws InvalidDataException         페이지정보오류
     * @throws NoDataException              도메인,페이지 정보 없음 오류
     * @throws IOException                  입출력오류
     * @throws Exception                    기타오류
     * @throws TemplateMergeException       tems 머징오류
     * @throws UnsupportedEncodingException 인코딩오류
     * @throws TemplateParseException       tems 문법오류
     * @throws TemplateLoadException        tems 로딩오류
     */
    @PostMapping("/article/{totalId}")
    public void perviewArticle(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam(hidden = true) HttpServletResponse response,
            @ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") Long totalId, @ApiParam("서비스플랫폼(P/M)") String servicePlatform,
            @ApiParam("기사유형") String artType)
            throws InvalidDataException, NoDataException, IOException, Exception, TemplateMergeException, UnsupportedEncodingException,
            TemplateParseException, TemplateLoadException {

        try {
            String html = mergeService.getMergeArticle(totalId, servicePlatform, artType);
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] totalId: {} {}", totalId, e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            String html = "<script>alert('" + messageByLocale.get("tps.article.error.preview", request) + "');window.close();</script>";
            writeResonse(response, html, TpsConstants.PAGE_TYPE_HTML);
            //            throw new Exception(messageByLocale.get("tps.merge.error.article-page", request), e);
        }
    }
}
