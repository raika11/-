package jmnet.moka.core.tms.merge;

import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.ArticlePageItem;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.merge.item.TemplateItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.ReservedMap;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;
import jmnet.moka.core.tms.template.parse.model.TpTemplateRoot;
import org.apache.commons.jexl3.MapContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.env.Environment;

/**
 * <pre>
 * TPS에서 사용할 미리보기를 위한 템플릿머저를 생성한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 4. 오후 5:59:52
 */
public class MokaPreviewTemplateMerger extends MokaTemplateMerger {

    private static final Logger logger = LoggerFactory.getLogger(MokaPreviewTemplateMerger.class);
    private static Pattern PATTERN_BR = Pattern.compile("<br\\/?>(\\s|&nbsp;)*?<br\\/?>", Pattern.CASE_INSENSITIVE);
    protected final static MokaFunctions MOKA_FUNCTIONS = new MokaFunctions();
    private DomainItem domainItem;
    private DomainResolver domainResolver;
    private String regId;

    public MokaPreviewTemplateMerger(GenericApplicationContext appContext, DomainItem domainItem, DomainResolver domainResolver,
            AbstractTemplateLoader templateLoader, DataLoader dataLoader, DataLoader defaultDataLoader, boolean defaultApiHostPathUse) {
        this(appContext, domainItem, domainResolver, templateLoader, dataLoader, defaultDataLoader, defaultApiHostPathUse, null);
    }

    public MokaPreviewTemplateMerger(GenericApplicationContext appContext, DomainItem domainItem, DomainResolver domainResolver,
            AbstractTemplateLoader templateLoader, DataLoader dataLoader, DataLoader defaultDataLoader, boolean defaultApiHostPathUse, String regId) {
        super(appContext, domainItem.getItemId(), templateLoader, dataLoader, defaultDataLoader, defaultApiHostPathUse);
        this.domainResolver = domainResolver;
        this.domainItem = domainItem;
        this.regId = regId;
    }

    private void setBaseTag(String pagePath, MergeContext context, StringBuilder sb) {
        DomainItem domainItem = (DomainItem) context.get(MokaConstants.MERGE_CONTEXT_DOMAIN);
        if (context.has(MokaConstants.MERGE_CONTEXT_PAGE)) {
            PageItem pageItem = (PageItem) context.get(MokaConstants.MERGE_CONTEXT_PAGE);
            // html인 경우만 baseTag 처리
            if (!pageItem
                    .get(ItemConstants.PAGE_TYPE)
                    .equals("text/html")) {
                return;
            }
        }
        Environment env = this.appContext.getBean(Environment.class);
        String[] profiles = env.getActiveProfiles();
        String domainUrl = (profiles.length == 0 ? "http://" : "https://") + domainItem.get(ItemConstants.DOMAIN_URL) + "/" + pagePath;
        int firstMetaIndex = sb.indexOf("<meta");
        if (firstMetaIndex < 0) {
            firstMetaIndex = sb.indexOf("<META");
        }
        if (firstMetaIndex >= 0) {
            String baseTag = "<base href=\"" + domainUrl + "\"/>\r\n";
            sb.insert(firstMetaIndex, baseTag);
            logger.debug("Base Tag is set: {}", baseTag);
        }
    }

    private StringBuilder setHtmlWrap(String itemType, String itemId, StringBuilder sb) {
        StringWriter writer = new StringWriter();
        MapContext context = new MapContext();
        context.set(MokaConstants.HTML_WRAP_MERGE_ITEM_TYPE, itemType);
        context.set(MokaConstants.HTML_WRAP_MERGE_ITEM_ID, itemId);
        context.set(MokaConstants.HTML_WRAP_MERGE_CONTENT, sb);
        this.htmlWrap.evaluate(context, writer);
        return new StringBuilder(writer.toString());
    }

    private MergeContext createMergeContext(boolean preview) {
        MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
        // TMS의 PagePathResolver, MergeHandler에서 설정하는 context 정보를 추가한다.
        if (preview) {
            mergeContext
                    .getMergeOptions()
                    .setPreview(preview);
        }
        if (this.regId != null) {
            mergeContext.set(MokaConstants.MERGE_CONTEXT_REG_ID, this.regId);
        }
        mergeContext.set(MokaConstants.MERGE_CONTEXT_DOMAIN, this.domainItem);
        // 예약어를 설정한다.
        ReservedMap reservedMap = domainResolver.getReservedMap(domainId);
        if (reservedMap != null) {
            mergeContext.set(MokaConstants.MERGE_CONTEXT_RESERVED, reservedMap);
        }

        // Htttp 파라미터 설정
        HttpParamMap httpParamMap = new HttpParamMap();
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM, httpParamMap);

        return mergeContext;
    }

    private MergeContext createMergeContext(PageItem pageItem, boolean preview)
            throws TemplateParseException, DataLoadException, TemplateMergeException {
        MergeContext mergeContext = createMergeContext(true);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PAGE, pageItem);
        mergeContext.set(MokaConstants.MERGE_PATH, pageItem.get(ItemConstants.PAGE_URL));

        // 카테고리 설정
        HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
        String category = pageItem.getString(ItemConstants.PAGE_CATEGORY);
        if (category != null) {
            httpParamMap.put(MokaConstants.MERGE_CONTEXT_CATEGORY, pageItem.getString(ItemConstants.PAGE_CATEGORY));
        }
        this.setCodesAndMenus(pageItem.getString(ItemConstants.PAGE_DOMAIN_ID), pageItem, mergeContext);
        return mergeContext;
    }

    public StringBuilder merge(String pageItemId)
            throws TemplateMergeException, TemplateParseException, DataLoadException, TemplateLoadException {
        PageItem pageItem = (PageItem) this.templateLoader.getItem(MokaConstants.ITEM_PAGE, pageItemId);
        MergeContext mergeContext = createMergeContext(pageItem, false);
        return super.merge(MokaConstants.ITEM_PAGE, pageItemId, mergeContext);
    }

    public String mergePreviewResource(String temsSource, String content)
            throws TemplateMergeException {
        StringBuilder sb;
        try {
            TemplateItem templateItem = new TemplateItem();
            templateItem.put(ItemConstants.TEMPLATE_ID, "temp");
            templateItem.put(ItemConstants.TEMPLATE_BODY, temsSource);
            TemplateRoot templateRoot = new TpTemplateRoot(templateItem);
            sb = new StringBuilder(templateRoot.getTemplateSize() * 2);
            MergeContext mergeContext = createMergeContext(false);
            mergeContext.set(MokaConstants.SYSTEM_AREA, content);
            templateRoot.merge(this, mergeContext, sb);
        } catch (Exception e) {
            throw new TemplateMergeException("Template Merge Fail : temporary merge", e);
        }
        return sb == null ? "" : sb.toString();
    }

    public StringBuilder merge(PageItem pageItem, MergeItem wrapItem, boolean mergePage)
            throws TemplateMergeException, TemplateParseException, DataLoadException {
        return this.merge(pageItem, wrapItem, mergePage, false, true, true);    // 하이라이트 스크립트 제거, html wrap소스 추가
    }

    public StringBuilder merge(PageItem pageItem, MergeItem wrapItem, boolean mergePage, boolean highlight, boolean htmlWrap, boolean baseTag)
            throws TemplateMergeException, TemplateParseException, DataLoadException {

        MergeContext mergeContext = createMergeContext(pageItem, true);
        String itemType = pageItem.getItemType();
        String itemId = pageItem.getItemId();
        // PageItem 설정
        this.setItem(itemType, itemId, pageItem);

        if (wrapItem != null) {
            if (mergePage) { // page를 머지하고, wrapItem을 highlight
                mergeContext
                        .getMergeOptions()
                        .setWrapItem(true);
                mergeContext
                        .getMergeOptions()
                        .setShowItem(wrapItem.getItemType());
                mergeContext
                        .getMergeOptions()
                        .setShowItemId(wrapItem.getItemId());
                this.setItem(wrapItem.getItemType(), wrapItem.getItemId(), wrapItem);
            } else { // wrapItem을 머지
                itemType = wrapItem.getItemType();
                itemId = wrapItem.getItemId();
                this.setItem(itemType, itemId, wrapItem);
            }
        } else {
            if (mergePage) {
                // page를 머지
            } else {
                // wrapItem이 null 이므로 불가능함
                throw new TemplateMergeException("MergeItem is null");
            }
        }

        StringBuilder sb = super.merge(itemType, itemId, mergeContext);

        // 시스템 기본 (tms.merge.highlight.only 프로퍼티)
        if (highlight) {
            addShowItemStyle(sb, mergeContext);
        }

        // 강제로 설정
        // addShowItemStyle(sb, mergeContext, true);

        // 편집컴포넌트 미리보기일 경우 html 태그를 감싸준다.
        if (mergeContext
                .getMergeOptions()
                .isPreview() && this.regId != null && htmlWrap) {
            sb = setHtmlWrap(itemType, itemId, sb);
        }

        // base 태그 처리
        if (baseTag) {
            setBaseTag(itemType, mergeContext, sb);
        }
        return sb;
    }

    private void setCodesAndMenus(String domainId, MergeItem item, MergeContext mergeContext)
            throws TemplateMergeException, TemplateParseException, DataLoadException {
        String category = item.getString(ItemConstants.PAGE_CATEGORY);
        if (category == null) {
            return;
        }
        DataLoader loader = this.getDataLoader();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(MokaConstants.PARAM_CATEGORY, category);
        JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.MENU_CATEGORY, paramMap, true);
        Map<String, Object> map = jsonResult.getData(); // 서비스 사용 코드들
        Map codes = (Map) map.get(MokaConstants.MERGE_CONTEXT_CODES);
        Map menus = (Map) map.get(MokaConstants.MERGE_CONTEXT_MENUS);
        mergeContext.set(MokaConstants.PARAM_CATEGORY, MokaConstants.MERGE_CONTEXT_CATEGORY);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_CODES, codes);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_MENUS, menus);
    }

    /**
     * 기사페이지 미리보기
     *
     * @param articlePageItem
     * @param totalId
     * @return
     * @throws TemplateMergeException
     * @throws DataLoadException
     * @throws TemplateParseException
     */
    public StringBuilder merge(ArticlePageItem articlePageItem, Long totalId)
            throws TemplateMergeException, DataLoadException, TemplateParseException {
        MergeContext mergeContext = createMergeContext(true);

        DataLoader loader = this.getDataLoader();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("totalId", totalId.toString());
        JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.ARTICLE, paramMap, true);
        Map<String, Object> articleInfo = (Map<String, Object>) jsonResult.get("article");
        this.insertSubTitle(articleInfo);
        this.setEPaper(articleInfo, mergeContext);
        mergeContext.set("article", articleInfo);
        mergeContext.set(MokaConstants.MERGE_PATH, "/article/" + totalId.toString());
        this.setCodesAndMenus(loader, articleInfo, mergeContext);
        String itemType = articlePageItem.getItemType();
        String itemId = articlePageItem.getItemId();

        // ArticlePageItem 설정
        this.setItem(itemType, itemId, articlePageItem);

        StringBuilder sb = super.merge(itemType, itemId, mergeContext);

        // base 태그 처리
        setBaseTag(itemType, mergeContext, sb);
        return sb;
    }

    private void insertSubTitle(Map<String, Object> articleInfo) {
        String content = (String) articleInfo.get("ART_CONTENT");
        Object subTitleObj = articleInfo.get("ART_SUB_TITLE");
        if (subTitleObj == null) {
            return;
        }
        Matcher matcher = PATTERN_BR.matcher(content);
        if (matcher.find()) { // 첫번째에 다음에 추가
            StringBuffer sb = new StringBuffer(content.length());
            matcher.appendReplacement(sb, "$0<div class=\"ab_subtitle\"><p>" + (String) subTitleObj + "</p></div>");
            matcher.appendTail(sb);
            content = sb.toString();
            articleInfo.put("ART_CONTENT", content);
        }
    }

    private void setEPaper(Map<String, Object> articleInfo, MergeContext mergeContext) {
        Object source = articleInfo.get("source");
        if (source == null || ((Map) source).size() == 0) {
            return;
        }
        Map<String, Object> soruceMap = (Map<String, Object>) source;
        Object typeSetting = articleInfo.get("typeSetting");
        if (typeSetting == null || ((Map) typeSetting).size() == 0) {
            return;
        }
        Map<String, Object> typeSettingMap = (Map<String, Object>) typeSetting;
        String nowHour = McpDate
                .nowStr()
                .substring(0, 13);
        // 오전 06시 이후 링크 노출
        Object serviceTimeObj = articleInfo.get("SERVICE_DAYTIME");
        if (serviceTimeObj instanceof JSONResult && ((JSONResult) serviceTimeObj).isEmpty()) {
            return;
        } else if (serviceTimeObj == null) {
            return;
        }
        String serviceTime = ((String) serviceTimeObj).substring(0, 11) + "06";
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
            String pressNumber = McpString.defaultValue(typeSettingMap.get("PRESS_NUMBER"), "");
            title = pressNumber + "호 " + pressMyun + "면";
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
        String masterCode = MOKA_FUNCTIONS.joinColumn((List<Map<String, Object>>) articleInfo.get("codes"), "MASTER_CODE");
        String serviceCode = MOKA_FUNCTIONS.joinColumn((List<Map<String, Object>>) articleInfo.get("codes"), "SERVICE_CODE");
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
     * 등록기사 미리보기
     *
     * @param articlePageItem 기사페이지아이템
     * @param totalId         기사키
     * @param categoryList    분류목록
     * @param reporterList    기자목록
     * @param tagList         태그목록
     * @param title           제목
     * @param content         본문
     * @return
     * @throws TemplateMergeException
     * @throws DataLoadException
     * @throws TemplateParseException
     */
    public StringBuilder mergeArticle(ArticlePageItem articlePageItem, Long totalId, List<Map<String, Object>> categoryList,
            List<Map<String, Object>> reporterList, List<Map<String, Object>> tagList, String title, String subTitle, String content)
            throws TemplateMergeException, DataLoadException, TemplateParseException {
        MergeContext mergeContext = createMergeContext(true);

        DataLoader loader = this.getDataLoader();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("totalId", totalId.toString());
        JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.ARTICLE_PREVIEW, paramMap, true);

        // 기사정보 변경
        Map<String, Object> articleInfo = rebuildInfoArticle(jsonResult, categoryList, reporterList, tagList, title, subTitle, content);

        this.insertSubTitle(articleInfo);
        this.setEPaper(articleInfo, mergeContext);
        mergeContext.set("article", articleInfo);
        mergeContext.set(MokaConstants.MERGE_PATH, "/article/" + totalId.toString());
        this.setCodesAndMenus(loader, articleInfo, mergeContext);
        String itemType = articlePageItem.getItemType();
        String itemId = articlePageItem.getItemId();

        // ArticlePageItem 설정
        this.setItem(itemType, itemId, articlePageItem);

        StringBuilder sb = super.merge(itemType, itemId, mergeContext);

        // base 태그 처리
        setBaseTag(itemType, mergeContext, sb);
        return sb;
    }

    // 기사정보 변경
    private Map<String, Object> rebuildInfoArticle(JSONResult jsonResult, List<Map<String, Object>> categoryList,
            List<Map<String, Object>> reporterList, List<Map<String, Object>> tagList, String title, String subTitle, String content) {
        Map<String, Object> articleInfo = (Map<String, Object>) jsonResult.get("article");
        articleInfo.put("codes", categoryList); // 분류변경
        articleInfo.put("reporters", reporterList); // 기자변경
        articleInfo.put("keywords", tagList);   // 태그변경
        articleInfo.put("ART_TITLE", title);    // 제목변경
        articleInfo.put("ART_SUB_TITLE", subTitle); // 부제목변경
        articleInfo.put("ART_CONTENT", content);    // 본문변경
        return articleInfo;
    }

    /**
     * 수신기사 미리보기
     *
     * @param articlePageItem 기사페이지아이템
     * @param rid             수신기사키
     * @param categoryList    분류목록
     * @param reporterList    기자목록
     * @param tagList         태그목록
     * @return
     * @throws TemplateMergeException
     * @throws DataLoadException
     * @throws TemplateParseException
     */
    public StringBuilder mergeRcv(ArticlePageItem articlePageItem, Long rid, List<Map<String, Object>> categoryList,
            List<Map<String, Object>> reporterList, List<Map<String, Object>> tagList)
            throws TemplateMergeException, DataLoadException, TemplateParseException {
        MergeContext mergeContext = createMergeContext(true);

        // Htttp 파라미터 설정
        HttpParamMap httpParamMap = new HttpParamMap();
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM, httpParamMap);

        DataLoader loader = this.getDataLoader();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("rid", rid.toString());
        JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.RARTICLE_PREVIEW, paramMap, true);

        // 기사정보 변경
        Map<String, Object> articleInfo = rebuildInfoRcv(jsonResult, categoryList, reporterList, tagList);

        this.insertSubTitle(articleInfo);
        this.setEPaper(articleInfo, mergeContext);
        mergeContext.set("article", articleInfo);
        mergeContext.set(MokaConstants.MERGE_PATH, "/article/" + rid.toString());
        this.setCodesAndMenus(loader, articleInfo, mergeContext);
        String itemType = articlePageItem.getItemType();
        String itemId = articlePageItem.getItemId();

        // ArticlePageItem 설정
        this.setItem(itemType, itemId, articlePageItem);

        StringBuilder sb = super.merge(itemType, itemId, mergeContext);

        // base 태그 처리
        setBaseTag(itemType, mergeContext, sb);
        return sb;
    }

    private Map<String, Object> rebuildInfoRcv(JSONResult jsonResult, List<Map<String, Object>> categoryList, List<Map<String, Object>> reporterList,
            List<Map<String, Object>> tagList) {
        Map<String, Object> articleInfo = (Map<String, Object>) jsonResult.get("article");
        articleInfo.put("codes", categoryList); // 분류변경
        articleInfo.put("reporters", reporterList); // 기자변경
        articleInfo.put("keywords", tagList);   // 태그변경
        return articleInfo;
    }

}
