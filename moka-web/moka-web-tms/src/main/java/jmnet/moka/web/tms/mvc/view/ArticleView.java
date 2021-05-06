package jmnet.moka.web.tms.mvc.view;

import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tms.merge.CacheHelper;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.MokaFunctions;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import org.infinispan.commons.util.concurrent.ConcurrentHashSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.view.AbstractView;

/**
 * <pre>
 * 기사를 머징하여 브라우저로 보낸다
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 10. 오후 3:54:35
 */
public class ArticleView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(ArticleView.class);
    private static Pattern PATTERN_BR = Pattern.compile("<br\\/?>(\\s|&nbsp;)*?<br\\/?>", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_BR_CONTAINS = Pattern.compile("(<br)", Pattern.CASE_INSENSITIVE);
    private static String START_P_TAG = "<p class=\"ac\">";
    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;
    @Value("${tms.page.cache}")
    private boolean isPageCache;
    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;
    @Autowired(required = false)
    private CacheManager cacheManager;
    @Autowired
    private ActionLogger actionLogger;
    private MokaFunctions functions = new MokaFunctions();

    private ConcurrentHashSet requestedSet = new ConcurrentHashSet();

    @Override
    protected boolean generatesDownloadContent() {
        return false;
    }

    /**
     * <pre>
     * http 머지 요청을 통해 수집된 정보를 취합하여 머지를 수행하여 결과를 반환한다.
     * </pre>
     *
     * @param model    모델
     * @param request  http 요청
     * @param response http 응답
     * @see AbstractView#renderMergedOutputModel(Map, HttpServletRequest, HttpServletResponse)
     */
    @Override
    protected final void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) {

        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) model.get(MokaConstants.MERGE_CONTEXT);

        // debug 옵션
        mergeContext
                .getMergeOptions()
                .setDebug(templateMergeDebug);
        long startTime = System.currentTimeMillis();

        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        String path = (String) mergeContext.get(MokaConstants.MERGE_PATH);
        String articleId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);
        MokaTemplateMerger templateMerger = null;
        PrintWriter writer = null;

        String cacheType = CacheHelper.CACHE_ARTICLE_MERGE;
        String cacheKey = CacheHelper.makeArticleCacheKey(domainId, articleId);

        String cached = null;
        // 캐시된 경우
        if (this.cacheManager != null) {
            cached = this.cacheManager.get(cacheType, cacheKey);
            if (cached != null) { // cache가 있을 경우
                writeArticle(request, response, cached);
                actionLogger.success(HttpHelper.getRemoteAddr(request), ActionType.ARTICLE,
                        System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), articleId);
                return;
            }
        }
        // 캐시되지 않은 경우 request collapsing
        if ( !this.requestedSet.contains(cacheKey)) {
            try {
                this.requestedSet.add(cacheKey);
                templateMerger = this.domainTemplateMerger.getTemplateMerger(domainId);
                DataLoader loader = templateMerger.getDataLoader();
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("totalId", articleId);
                // 기사정보 조회
                JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.ARTICLE, paramMap, true);
                Map<String, Object> articleInfo = (Map<String, Object>)jsonResult.get("article");
                this.convertContent(articleInfo);
                this.setEPaper(articleInfo,mergeContext);
                this.brToPTag(articleInfo,true);
                mergeContext.set("article", articleInfo);
                this.setCodesAndMenus(loader, articleInfo, mergeContext);
                StringBuilder sb =
                        templateMerger.merge(MokaConstants.ITEM_ARTICLE_PAGE, this.getArticlePageId(templateMerger, domainId, articleInfo), mergeContext);
                if (this.cacheManager != null) {
                    this.cacheManager.set(cacheType, cacheKey, sb.toString());
                }
                writeArticle(request, response, sb.toString());
                actionLogger.success(HttpHelper.getRemoteAddr(request), ActionType.ARTICLE,
                        System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), articleId);
            } catch (TemplateMergeException | TemplateParseException | DataLoadException e) {
                e.printStackTrace();
                actionLogger.fail(HttpHelper.getRemoteAddr(request), ActionType.ARTICLE,
                        System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), articleId + " " + e.getMessage());
            } finally {
                this.requestedSet.remove(cacheKey);
            }
        } else {
            int retryCount = 0;
            while (cached == null && retryCount < 20) {
                cached = this.cacheManager.get(cacheType, cacheKey);
                try {
                    Thread
                            .currentThread()
                            .sleep(100);
                } catch (InterruptedException e) {
                    logger.error("request Collapse fail: {}",e);
                }
                retryCount++;
            }
            if ( cached != null) {
                writeArticle(request, response, cached);
                actionLogger.success(HttpHelper.getRemoteAddr(request), ActionType.ARTICLE, System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), articleId);
            } else {
                actionLogger.fail(HttpHelper.getRemoteAddr(request), ActionType.ARTICLE,
                        System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), articleId + " request collapsing failed" );
            }
        }
    }

    private void writeArticle(HttpServletRequest request, HttpServletResponse response, String content) {
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = null;
        try {
            writer = response.getWriter();
            writer.append(content);
        } catch (Exception e) {
            logger.error("Request:{}, Exception: {}", request.getRequestURI(), e.toString());
        } finally {
            if (writer != null) {
                writer.flush();
                writer.close();
            }
        }
    }


    private void brToPTag(Map<String, Object> articleInfo, boolean line) {

        String rtn = (String) articleInfo.get("ART_CONTENT");

        /* 텍스트 기사처리 */
        if (Pattern.compile("(<br)", Pattern.CASE_INSENSITIVE).matcher(rtn).groupCount() <= 0) {
            rtn = rtn.replaceAll("\\r", "");
            rtn = rtn.replace("\n", "<br/>\n");
            rtn = ("<p class=\"ac\">" + rtn +"</p>");

            articleInfo.put("ART_CONTENT", rtn);
            return;
        }


        /*1 사전정리*/
        rtn = rtn.replaceAll("(?i)^(\\s|&nbsp;)*\\s*","");                  /* 줄 시작 공백제거 */
        rtn = McpString.trimStart(rtn, ' ');                                                     /* 문서 시작 공백제거 */
        rtn = McpString.trimEnd(rtn, ' ');                                                       /* 문서 끝 공백제거 */
        //[2021.04.30제외]전체처리와 중복 //rtn = rtn.replaceAll("(<[^>]*)([\\n]+)([^>]+>)", "$1 $3");   /*태그사이 줄바꿈 제거*/
        rtn = rtn.replace("\n", "").replace("\r", "");    /*줄바꿈 제거*/
        rtn = rtn.replaceAll("(?i)<hr([^>]*)*>", "<br />"); /*hr 미사용으로 제거 23233186*/

        rtn = rtn.replaceAll("(?i)<br[^>]*>", "<br />");                    /*br 태그규격화*/

        rtn = rtn.replaceAll("(?i)>\\s*(\\s|&nbsp;)*\\s*<", "><");          /*태그와 태그 사이 공백정리*/
        rtn = rtn.replaceAll("(?i)(\\s|&nbsp;)*\\s*<br />", "<br />");      /*줄뒤 공백제거*/
        rtn = rtn.replaceAll("(<br \\/>)*<\\/", "</");                         /*태그내부 br정리*/
        //rtn=Regex.Replace(rtn, @"<div([^<]*)<br \/>([^<]*)<\/div>", "<div$1<br/>--$2</div>", RegexOptions.IgnoreCase);    /*div 안쪽 br정리*/


        /*2 div(파티클)와 br(텍스트열)을 줄(라인피드)단위로 정리 */
        rtn = rtn.replaceAll("(?i)<br \\/><div", "<br />\n<div");
        rtn = rtn.replaceAll("(?i)<br \\/>", "\n<br />");
        rtn = rtn.replaceAll("(?i)<\\/div>\n*", "</div>");

        /////* div 뒤의 텍스트가 붙어 있는 경우 처리 by kspark */
        ////converted = converted.replaceAll("(?i)<\\/div>([^<]+)", "</div>\n<br />$1");

        /*3 P 태그 묶음 처리*/
        /*div 태그와 텍스트 분리*/
        rtn = rtn.replaceAll("(?i)<br />", "<p class=\"ac\">");
        rtn = rtn.replaceAll("\n", "</p>\n");
        rtn = rtn.replaceAll("(?i)<\\/div><p class=\"ac\">", "</div>\n<p class=\"ac\">");   /*파티클 위 줄바꿈처리*/
        rtn = rtn.replaceAll("(?i)div>([^<\n]+)", "div>\n<p class=\"ac\">$1");  /*파티클뒤에 텍스트가 바로오는 경우*/
        rtn = rtn.replaceAll("(?i)div><(b |b>|strong|a )", "div>\n<p class=\"ac\"><$1");    /*2021.05.04 파티클뒤에 b/a/strong 등 태그가 오는 경우-23234689*/

        if(rtn.endsWith("<p class=\"ac\">")) { rtn += "</p>"; }
        if(rtn.startsWith("<b>")) { rtn = "<p class=\"ac\">" + rtn; }
        if(rtn.startsWith("<strong>")) { rtn = "<p class=\"ac\">" + rtn; }
        if(rtn.startsWith("<a ")) { rtn = "<p class=\"ac\">" + rtn; }
        if(rtn.endsWith("<p class=\"ac\">")) { rtn+="</p>"; }

        /*닫는 p로 시작하는 경우 - 태그, 개행, 공백 삭제 */
        if ( rtn.startsWith("</p>")) {
            rtn = rtn.substring(4);
            rtn = McpString.trimStart(rtn, ' ');
            rtn = McpString.trimStart(rtn, '\n');
            rtn = McpString.trimStart(rtn, ' ');
            rtn = McpString.trimStart(rtn, '\n');
        }

        /*닫는 p 없는 경우 */
        if(!rtn.endsWith("</p>")&&!rtn.endsWith("</div>")) { rtn=rtn+"</p>"; }

        /*5 시작태그 없는 경우 처리*/
        rtn = rtn.replaceAll("^(\\s)*([^<])", "<p class=\"ac\">");
        rtn = rtn.replaceAll("(?i)<\\/div><(b|strong|span)>", "</div><p class=\"ac\"><$1>");

        rtn = rtn.replaceAll("(?i)<p class=\"ac\">((\\s|&nbsp;)*\\s*)</p>", "<p class=\"ac\"></p>"); /* 공백줄 삭제 */
        /*6 2줄바꿈 문단 처리*/
        if ( line ) { // 문단 사이에 p태그를 없애는 경우
            rtn = rtn.replaceAll("(?i)</p>\n<p class=\"ac\">([^<])>", "<br  />$1");
            rtn = rtn.replaceAll("(?i)<p class=\"ac\"><br  />", "<p class=\"ac\">");
            rtn = rtn.replaceAll("(?i)</p>\n<p class=\"ac\"></p>", "</p>");
            rtn = rtn.replaceAll("(?i)\n<p class=\"ac\"></p>\n<p class=\"ac\"></p>", "\n<p class=\"ac\"></p>");
        }

        /*7 기사 끝 공백 라인 제거 23234322*/
        //rtn = rtn.replaceAll("\n<p class=\"ac\"></p>", ""); /* 공백줄 전체 삭제 */
        while (rtn.endsWith("\n<p class=\"ac\"></p>")) { rtn = rtn.substring(0, rtn.length() - "\n<p class=\"ac\"></p>".length()); }

        articleInfo.put("ART_CONTENT", rtn);
    }


    private void convertContent(Map<String, Object> articleInfo) {
        String originalContent = (String) articleInfo.get("ART_CONTENT");

        // 기본 , 일반 텍스트
        String convertedContent = originalContent
                .replaceAll("(?i)<div class=\"dim\".+?>.*?<\\/div>", "")
                .replaceAll("(?i)<br.*?\\/?>", "<br>")
                .replaceAll("\n", "<br>")
                .trim();

        //인용구
        convertedContent = convertedContent.replaceAll("(?i)<div class=\"tag_quotation\">(.*?)</div>", "<div class=\"ab_quot\"><p>$1</p></div>");

        // 인터뷰
        convertedContent = convertedContent.replaceAll("(?i)<div class=\"tag_question\">(.*?)</div>", "<dt>$1</dt>");
        convertedContent = convertedContent.replaceAll("(?i)<div class=\"tag_answer\">(.*?)</div>", "<dd>$1</dd>");
        convertedContent = convertedContent.replaceAll("(?i)<div class=\"tag_interview\">(.*?)</div>", "<div class=\"ab_qa\"><dl>$1</dl></div>");

        // 세로선박스 텍스트
        // 위아래선박스 텍스트
        // 박스기사

        // 서브 타이틀
        Object subTitleObj = articleInfo.get("ART_SUB_TITLE");
        if (McpString.isNotEmpty(subTitleObj)) {
            convertedContent = insertSubTitle(convertedContent, (String)subTitleObj);
        }

        articleInfo.put("ART_CONTENT", convertedContent);
    }

    private String insertSubTitle(String content, String subTitle) {
        Matcher matcher = PATTERN_BR.matcher(content);
        if (matcher.find()) { // 첫번째에 다음에 추가
            StringBuffer sb = new StringBuffer(content.length());
            matcher.appendReplacement(sb, "$0<div class=\"ab_subtitle\"><p>" + subTitle + "</p></div>");
            matcher.appendTail(sb);
            content = sb.toString();
        }
        return content;
    }

    private void setEPaper(Map<String, Object> articleInfo, MergeContext mergeContext) {
        Object source = articleInfo.get("source");
        if ( source == null || ((Map)source).size() ==0) {return;}
        Map<String,Object> soruceMap = (Map<String,Object>)source;
        Object typeSetting = articleInfo.get("typeSetting");
        if ( typeSetting == null || ((Map)typeSetting).size() ==0) {return;}
        Map<String,Object> typeSettingMap = (Map<String,Object>)typeSetting;
        String nowHour = McpDate
                .nowStr()
                .substring(0, 13);
        // 오전 06시 이후 링크 노출
        Object serviceTimeObj = articleInfo
                .get("SERVICE_DAYTIME");
        if ( serviceTimeObj instanceof JSONResult && ((JSONResult)serviceTimeObj).isEmpty()) {
            return;
        } else if ( serviceTimeObj == null){
            return;
        }
        String serviceTime = ((String)serviceTimeObj).substring(0, 11) + "06";
        if (nowHour.compareTo(serviceTime) <= 0) {
            return;
        }
        String sourceCode = soruceMap
                .get("SOURCE_CODE")
                .toString();
        String title = null;
        String link = null;
        String pressMyun = typeSettingMap
                .get("PRESS_MYUN")
                .toString();
        String pressCategory = typeSettingMap
                .get("PRESS_CATEGORY")
                .toString()
                .trim();
        if (pressCategory == null || pressCategory.length() == 0) {
            return;
        }
        if (sourceCode.equals("1")) { // 중앙일보일 경우
            if (pressCategory.equals("A")) {
                title = "종합 " + pressMyun + "면";
            } else if (pressCategory.equals("E")) {
                title = "경제 " + pressMyun + "면";
            } else {
                title = pressMyun + "면";
            }
            link = "https://www.joins.com/v2?mseq=11&tid=" + articleInfo
                    .get("TOTAL_ID")
                    .toString();
        } else if (sourceCode.equals("61")) { // 중앙선데이일 경우
            title = typeSettingMap
                    .get("PRESS_NUMBER")
                    .toString() + "호 " + pressMyun + "면";
            link = "https://www.joins.com/v2?mseq=12&tid=" + articleInfo
                    .get("TOTAL_ID")
                    .toString();
        }
        // 앱에 대한 처리
        if (mergeContext.has(MokaConstants.MERGE_CONTEXT_HEADER)) {
            Map<String, String> headerMap = (Map<String, String>) mergeContext.get(MokaConstants.MERGE_CONTEXT_HEADER);
            String userAgent = headerMap.get("User-Agent");
            if (userAgent != null && userAgent.equalsIgnoreCase("joongangilbo")) {
                try {
                    link = "joongang://open/browser?url=" + URLEncoder.encode(link, "UTF-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
        }
        Map<String, String> epaper = new HashMap<String, String>();
        epaper.put("title", title);
        epaper.put("link", link);
        articleInfo.put("epaper", epaper);
    }

    private void setCodesAndMenus(DataLoader loader, Map<String, Object> articleInfo, MergeContext mergeContext)
            throws DataLoadException {
        // TODO 키워드 조건으로 Category를 결정한다.
        // 리셋코리아 ( ResetKorea ), e글중심 (Opinion,eTextCenter)이면 카테고리 변경 (테이블로 관리)
        // 키워드와 카테고리를 매핑하는 DPS API필요

        String masterCode = functions.joinColumn((List<Map<String, Object>>) articleInfo.get("codes"), "MASTER_CODE");
        String serviceCode = functions.joinColumn((List<Map<String, Object>>) articleInfo.get("codes"), "SERVICE_CODE");
        String sourceCode = (String) ((Map<String, Object>) articleInfo.get("source")).get("SOURCE_CODE");
        Map<String, Object> codesParam = new HashMap<>();
        codesParam.put(MokaConstants.CATEGORY_MASTER_CODE_LIST, masterCode);
        codesParam.put(MokaConstants.CATEGORY_SERVICE_CODE_LIST, serviceCode);
        codesParam.put(MokaConstants.CATEGORY_SOURCE_CODE_LIST, sourceCode);
        JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.MENU_CODES, codesParam, true);
        Map<String, Object> map = jsonResult.getData();
        Map codes = (Map) map.get(MokaConstants.MERGE_CONTEXT_CODES);
        Map menus = (Map) map.get(MokaConstants.MERGE_CONTEXT_MENUS);
        mergeContext.set(MokaConstants.PARAM_CATEGORY, MokaConstants.MERGE_CONTEXT_CATEGORY);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_CODES, codes);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_MENUS, menus);

        // cache로 설정할 category를 추가한다.
        if (codes != null) {
            HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
            httpParamMap.put(MokaConstants.MERGE_CONTEXT_CATEGORY, (String) codes.get(MokaConstants.MERGE_CONTEXT_CATEGORY));
        }
    }

    /**
     * 기사페이지 정보를 가져온다.
     * @param templateMerger
     * @param domainId
     * @param articleInfo
     * @return
     * @throws DataLoadException
     */
    private String getArticlePageId(MokaTemplateMerger templateMerger, String domainId, Map<String, Object> articleInfo)
            throws DataLoadException {
        String articleType =  (String)articleInfo.get("ART_TYPE");
        return templateMerger.getArticlePageId(domainId, articleType);
    }


}
