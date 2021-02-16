package jmnet.moka.core.tms.merge;

import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.ArticlePageItem;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.ReservedMap;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;
import org.apache.commons.jexl3.MapContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;

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
        String domainUrl = "http://" + domainItem.get(ItemConstants.DOMAIN_URL) + "/" + pagePath;
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

    public StringBuilder merge(PageItem pageItem, MergeItem wrapItem, boolean mergePage)
            throws TemplateMergeException, TemplateParseException, DataLoadException {
        return this.merge(pageItem, wrapItem, mergePage, false, true, true);    // 하이라이트 스크립트 제거, html wrap소스 추가
    }

    public StringBuilder merge(PageItem pageItem, MergeItem wrapItem, boolean mergePage, boolean highlight, boolean htmlWrap, boolean baseTag)
            throws TemplateMergeException, TemplateParseException, DataLoadException {
        MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
        // TMS의 PagePathResolver, MergeHandler에서 설정하는 context 정보를 추가한다.
        mergeContext
                .getMergeOptions()
                .setPreview(true);
        if (this.regId != null) {
            mergeContext.set(MokaConstants.MERGE_CONTEXT_REG_ID, this.regId);
        }
        mergeContext.set(MokaConstants.MERGE_CONTEXT_DOMAIN, this.domainItem);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PAGE, pageItem);
        mergeContext.set(MokaConstants.MERGE_PATH, pageItem.get(ItemConstants.PAGE_URL));

        // 예약어를 설정한다.
        ReservedMap reservedMap = domainResolver.getReservedMap(domainId);
        if (reservedMap != null) {
            mergeContext.set(MokaConstants.MERGE_CONTEXT_RESERVED, reservedMap);
        }

        // Htttp 파라미터 설정
        HttpParamMap httpParamMap = new HttpParamMap();
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM, httpParamMap);
        // 카테고리 설정
        httpParamMap.put(MokaConstants.MERGE_CONTEXT_CATEGORY, pageItem.getString(ItemConstants.PAGE_CATEGORY));
        this.setCodesAndMenus(pageItem.getString(ItemConstants.PAGE_DOMAIN_ID), pageItem, mergeContext);
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
        JSONResult jsonResult = loader.getJSONResult("menu.category", paramMap, true);
        Map<String, Object> map = jsonResult.getData(); // 서비스 사용 코드들
        Map codes = (Map) map.get(MokaConstants.MERGE_CONTEXT_CODES);
        Map menus = (Map) map.get(MokaConstants.MERGE_CONTEXT_MENUS);
        mergeContext.set(MokaConstants.PARAM_CATEGORY, MokaConstants.MERGE_CONTEXT_CATEGORY);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_CODES, codes);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_MENUS, menus);
    }

    public StringBuilder merge(ArticlePageItem articlePageItem, Long totalId)
            throws TemplateMergeException, DataLoadException, TemplateParseException {
        MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
        // TMS의 PagePathResolver, MergeHandler에서 설정하는 context 정보를 추가한다.
        mergeContext
                .getMergeOptions()
                .setPreview(true);
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

        DataLoader loader = this.getDataLoader();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("totalId", totalId.toString());
        JSONResult jsonResult = loader.getJSONResult("article", paramMap, true);
        Map<String, Object> articleInfo = rebuildInfo(jsonResult);
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

    private Map<String, Object> rebuildInfo(JSONResult jsonResult) {
        Map<String, Object> article = new HashMap<>();
        article.put("basic", jsonResult.getDataListFirst("BASIC"));
        article.put("content", jsonResult.getDataList("CONTENT"));
        article.put("reporter", jsonResult.getDataList("REPORTER"));
        article.put("meta", jsonResult.getDataList("META"));
        article.put("mastercode", jsonResult.getDataList("MASTERCODE"));
        article.put("servicemap", jsonResult.getDataList("SERVICEMAP"));
        article.put("keyword", jsonResult.getDataList("KEYWORD"));
        article.put("clickcnt", jsonResult.getDataList("CLICKCNT"));
        article.put("multi", jsonResult.getDataList("MULTI"));
        return article;
    }

    private void setCodesAndMenus(DataLoader loader, Map<String, Object> articleInfo, MergeContext mergeContext)
            throws DataLoadException {
        String masterCode = MOKA_FUNCTIONS.joinColumn((List<Map<String, Object>>) articleInfo.get("mastercode"), "MASTER_CODE");
        String serviceCode = MOKA_FUNCTIONS.joinColumn((List<Map<String, Object>>) articleInfo.get("servicemap"), "SERVICE_CODE");
        String sourceCode = (String) ((Map<String, Object>) articleInfo.get("basic")).get("SOURCE_CODE");
        Map<String, Object> codesParam = new HashMap<>();
        codesParam.put(MokaConstants.MASTER_CODE_LIST, masterCode);
        codesParam.put(MokaConstants.SERVICE_CODE_LIST, serviceCode);
        codesParam.put(MokaConstants.SOURCE_CODE_LIST, sourceCode);
        JSONResult jsonResult = loader.getJSONResult("menu.codes", codesParam, true);
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
        MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
        // TMS의 PagePathResolver, MergeHandler에서 설정하는 context 정보를 추가한다.
        mergeContext
                .getMergeOptions()
                .setPreview(true);
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

        DataLoader loader = this.getDataLoader();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("rid", rid.toString());
        JSONResult jsonResult = loader.getJSONResult("rcvArticle", paramMap, true);
        Map<String, Object> articleInfo = rebuildInfoRcv(jsonResult, categoryList, reporterList, tagList);
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
        Map<String, Object> article = new HashMap<>();
        article.put("basic", jsonResult.getDataListFirst("BASIC"));
        article.put("content", jsonResult.getDataList("CONTENT"));
        //        article.put("reporter", jsonResult.getDataList("REPORTER"));
        //        article.put("meta", jsonResult.getDataList("META"));
        //        article.put("mastercode", jsonResult.getDataList("MASTERCODE"));
        article.put("servicemap", jsonResult.getDataList("SERVICEMAP"));
        //        article.put("keyword", jsonResult.getDataList("KEYWORD"));
        //        article.put("clickcnt", jsonResult.getDataList("CLICKCNT"));
        article.put("multi", jsonResult.getDataList("MULTI"));

        article.put("reporter", reporterList);
        article.put("mastercode", categoryList);
        article.put("keyword", tagList);

        return article;
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
        MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
        // TMS의 PagePathResolver, MergeHandler에서 설정하는 context 정보를 추가한다.
        mergeContext
                .getMergeOptions()
                .setPreview(true);
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

        DataLoader loader = this.getDataLoader();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("totalId", totalId.toString());
        JSONResult jsonResult = loader.getJSONResult("article", paramMap, true);
        Map<String, Object> articleInfo = rebuildInfoArticle(jsonResult, categoryList, reporterList, tagList, title, subTitle, content);
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

    private Map<String, Object> rebuildInfoArticle(JSONResult jsonResult, List<Map<String, Object>> categoryList,
            List<Map<String, Object>> reporterList, List<Map<String, Object>> tagList, String title, String subTitle, String content) {
        Map<String, Object> article = new HashMap<>();
        //        article.put("basic", jsonResult.getDataListFirst("BASIC"));
        //        article.put("content", jsonResult.getDataList("CONTENT"));
        //        article.put("reporter", jsonResult.getDataList("REPORTER"));
        //        article.put("meta", jsonResult.getDataList("META"));
        //        article.put("mastercode", jsonResult.getDataList("MASTERCODE"));
        article.put("servicemap", jsonResult.getDataList("SERVICEMAP"));
        //        article.put("keyword", jsonResult.getDataList("KEYWORD"));
        //        article.put("clickcnt", jsonResult.getDataList("CLICKCNT"));
        article.put("multi", jsonResult.getDataList("MULTI"));

        Map<String, Object> basicJson = jsonResult.getDataListFirst("BASIC");
        basicJson.replace("ART_TITLE", title);
        basicJson.replace("ART_SUB_TITLE", subTitle);
        article.put("basic", basicJson);
        Map<String, Object> contentJson = jsonResult.getDataListFirst("CONTENT");
        contentJson.replace("ART_CONTENT", content);
        article.put("content", contentJson);
        article.put("reporter", reporterList);
        article.put("mastercode", categoryList);
        article.put("keyword", tagList);

        return article;
    }
}
