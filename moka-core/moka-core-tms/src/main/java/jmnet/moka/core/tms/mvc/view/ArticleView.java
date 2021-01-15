package jmnet.moka.core.tms.mvc.view;

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
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.MokaFunctions;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.mvc.HttpParamMap;
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
    private static Pattern PATTERN_BR = Pattern.compile("<br\\/?>(\\s|&nbsp;)*?<br\\/?>", Pattern.CASE_INSENSITIVE);

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
        mergeContext.getMergeOptions()
                    .setDebug(templateMergeDebug);
        long startTime = System.currentTimeMillis();

        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        String path = (String) mergeContext.get(MokaConstants.MERGE_PATH);
        String articleId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);

        MokaTemplateMerger templateMerger = null;
        PrintWriter writer = null;

        String cacheType = KeyResolver.CACHE_ARTICLE_MERGE;
        String cacheKey = KeyResolver.makeArticleCacheKey(domainId, articleId);

        try {
            String cached = null;
            if ( this.cacheManager != null) {
                cached = this.cacheManager.get(cacheType, cacheKey);
                if ( cached != null) { // cache가 있을 경우
                    writeArticle(request, response, cached);
                    actionLogger.success(HttpHelper.getRemoteAddr(request), ActionType.ARTICLE,
                            System.currentTimeMillis() - (long)mergeContext.get(MokaConstants.MERGE_START_TIME),
                            articleId);
                    return;
                }
            }
            templateMerger = this.domainTemplateMerger.getTemplateMerger(domainId);
            DataLoader loader = templateMerger.getDataLoader();
            Map<String,Object> paramMap = new HashMap<>();
            paramMap.put("totalId",articleId);
            JSONResult jsonResult = loader.getJSONResult("article",paramMap,true);
            Map<String,Object> articleInfo = rebuildInfo(jsonResult, mergeContext);
            mergeContext.set("article",articleInfo);
            this.setCodesAndMenus(loader, articleInfo, mergeContext);
            StringBuilder sb = templateMerger.merge(MokaConstants.ITEM_ARTICLE_PAGE,
                        this.getArticlePageId(templateMerger, domainId, articleInfo), mergeContext);
            this.cacheManager.set(cacheType, cacheKey, sb.toString());
            writeArticle(request, response, sb.toString());
            actionLogger.success(HttpHelper.getRemoteAddr(request), ActionType.ARTICLE,
                    System.currentTimeMillis() - (long)mergeContext.get(MokaConstants.MERGE_START_TIME),
                    articleId);
        } catch (TemplateMergeException | TemplateParseException | DataLoadException e) {
            e.printStackTrace();
            actionLogger.fail(HttpHelper.getRemoteAddr(request), ActionType.ARTICLE,
                    System.currentTimeMillis() - (long)mergeContext.get(MokaConstants.MERGE_START_TIME),
                    articleId +" "+ e.getMessage());
        }
    }

    private void writeArticle(HttpServletRequest request,HttpServletResponse response, String content) {
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

    private Map<String,Object> rebuildInfo(JSONResult jsonResult, MergeContext mergeContext) {
        Map<String,Object> article = new HashMap<>();
        article.put("basic",jsonResult.getDataListFirst("BASIC"));
        article.put("content",jsonResult.getDataList("CONTENT"));
        article.put("reporter",jsonResult.getDataList("REPORTER"));
        article.put("meta",jsonResult.getDataList("META"));
        article.put("mastercode",jsonResult.getDataList("MASTERCODE"));
        article.put("servicemap",jsonResult.getDataList("SERVICEMAP"));
        article.put("keyword",jsonResult.getDataList("KEYWORD"));
        article.put("clickcnt",jsonResult.getDataList("CLICKCNT"));
        article.put("multi",jsonResult.getDataList("MULTI"));
        article.put("meta_fb",jsonResult.getDataListFirst("META_FB"));
        article.put("meta_tw",jsonResult.getDataListFirst("META_TW"));
        article.put("meta_ja",jsonResult.getDataListFirst("META_JA"));
        this.insertSubTitle(article);
        this.setEPaper(article, mergeContext);
        return article;
    }

    private void insertSubTitle(Map<String,Object> articleInfo) {
        List contentList = (List)articleInfo.get("content");
        Map contentMap = (Map)contentList.get(0);
        String content = (String)contentMap.get("ART_CONTENT");
        Map basicMap = (Map)articleInfo.get("basic");
        Object subTitleObj = basicMap.get("ART_SUB_TITLE");
        if ( subTitleObj == null) {
            return ;
        }
        Matcher matcher = PATTERN_BR.matcher(content);
        if (matcher.find()) { // 첫번째에 다음에 추가
            StringBuffer sb = new StringBuffer(content.length());
            matcher.appendReplacement(sb,"$0<div class=\"ab_subtitle\"><p>" + (String)subTitleObj + "</p></div>");
            matcher.appendTail(sb);
            content = sb.toString();
            contentMap.put("ART_CONTENT",content);
        }
    }

    private void setEPaper(Map<String,Object> article, MergeContext mergeContext) {
        Object basic = article.get("basic");
        if ( basic == null || ((Map)basic).size() == 0 ) return;
        Map basicMap = (Map)basic;
        String nowHour = McpDate.nowStr().substring(0,13);
        // 오전 06시 이후 링크 노출
        String serviceTime = basicMap.get("SERVICE_DAYTIME").toString().substring(0,11) + "06";
        if ( nowHour.compareTo(serviceTime) <= 0) return;
        String sourceCode = basicMap.get("SOURCE_CODE").toString();
        String title = null;
        String link = null;
        String pressMyun = basicMap.get("PRESS_MYUN").toString();
        String pressCategory = basicMap.get("PRESS_CATEGORY").toString().trim();
        if ( pressCategory == null || pressCategory.length() == 0) return;
        if ( sourceCode.equals("1")) { // 중앙일보일 경우
            if ( pressCategory.equals("A")) {
                title = "종합 " + pressMyun +"면";
            } else if ( pressCategory.equals("E")) {
                title = "경제 " + pressMyun +"면";
            } else {
                title = pressMyun +"면";
            }
            link = "https://www.joins.com/v2?mseq=11&tid="+basicMap.get("TOTAL_ID").toString();
        } else if (sourceCode.equals("61")) { // 중앙선데이일 경우
            title = basicMap.get("PRESS_NUMBER").toString() +"호 " + pressMyun +"면";
            link = "https://www.joins.com/v2?mseq=12&tid="+basicMap.get("TOTAL_ID").toString();
        }
        // 앱에 대한 처리
        if (mergeContext.has(MokaConstants.MERGE_CONTEXT_HEADER)) {
            Map<String,String> headerMap = (Map<String,String>)mergeContext.get(MokaConstants.MERGE_CONTEXT_HEADER);
            String userAgent = headerMap.get("User-Agent");
            if ( userAgent != null && userAgent.equalsIgnoreCase("joongangilbo")) {
                try {
                    link = "joongang://open/browser?url=" + URLEncoder.encode(link,"UTF-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
        }
        Map<String,String> epaper = new HashMap<String,String>();
        epaper.put("title",title);
        epaper.put("link",link);
        article.put("epaper",epaper);
    }

    private void setCodesAndMenus(DataLoader loader, Map<String,Object> articleInfo, MergeContext mergeContext)
            throws DataLoadException {
        // TODO 키워드 조건으로 Category를 결정한다.
        // 리셋코리아 ( ResetKorea ), e글중심 (Opinion,eTextCenter)이면 카테고리 변경 (테이블로 관리)
        // 키워드와 카테고리를 매핑하는 DPS API필요

        String masterCode = functions.joinColumn((List<Map<String, Object>>)articleInfo.get("mastercode"),"MASTER_CODE");
        String serviceCode = functions.joinColumn((List<Map<String, Object>>)articleInfo.get("servicemap"),"SERVICE_CODE");
        String sourceCode = (String)((Map<String,Object>)articleInfo.get("basic")).get("SOURCE_CODE");
        Map<String,Object> codesParam = new HashMap<>();
        codesParam.put(MokaConstants.MASTER_CODE_LIST, masterCode);
        codesParam.put(MokaConstants.SERVICE_CODE_LIST, serviceCode);
        codesParam.put(MokaConstants.SOURCE_CODE_LIST, sourceCode);
        JSONResult jsonResult = loader.getJSONResult("menu.codes",codesParam,true);
        Map<String, Object> map = jsonResult.getData();
        Map codes = (Map)map.get(MokaConstants.MERGE_CONTEXT_CODES);
        Map menus = (Map)map.get(MokaConstants.MERGE_CONTEXT_MENUS);
        mergeContext.set(MokaConstants.PARAM_CATEGORY,MokaConstants.MERGE_CONTEXT_CATEGORY);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_CODES,codes);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_MENUS,menus);

        // cache로 설정할 category를 추가한다.
        if ( codes != null) {
            HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
            httpParamMap.put(MokaConstants.MERGE_CONTEXT_CATEGORY, (String) codes.get(MokaConstants.MERGE_CONTEXT_CATEGORY));
        }
    }

    private String getArticlePageId(MokaTemplateMerger templateMerger, String domainId, Map<String,Object> articleInfo)
            throws DataLoadException {
        Map<String,Object> basic = (Map<String,Object>)articleInfo.get("basic");
        String articleType = (String)basic.get("ART_TYPE");
        return templateMerger.getArticlePageId(domainId, articleType);
    }
}
