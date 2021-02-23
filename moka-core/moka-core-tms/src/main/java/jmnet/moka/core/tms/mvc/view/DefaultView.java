package jmnet.moka.core.tms.mvc.view;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.view.AbstractView;

/**
 * <pre>
 * 템플릿을 머징하여 브라우저로 보낸다
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 10. 오후 3:54:35
 */
public class DefaultView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(DefaultView.class);

    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;

    @Value("${tms.page.cache}")
    private boolean isPageCache;

    @Autowired
    private MokaDomainTemplateMerger templateMerger;

    @Autowired(required = false)
    private CacheManager cacheManager;

    @Autowired
    private ActionLogger actionLogger;

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
     * @throws Exception 예외
     * @see org.springframework.web.servlet.view.AbstractView#renderMergedOutputModel(java.util.Map, javax.servlet.http.HttpServletRequest,
     * javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected final void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response)
            throws Exception {

        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);

        // debug 옵션
        mergeContext
                .getMergeOptions()
                .setDebug(templateMergeDebug);
        long startTime = System.currentTimeMillis();

        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        String path = (String) mergeContext.get(MokaConstants.MERGE_PATH);
        String itemType = (String) mergeContext.get(MokaConstants.MERGE_ITEM_TYPE);
        boolean isPageItem = itemType.equals(MokaConstants.ITEM_PAGE);
        String itemId = (String) mergeContext.get(MokaConstants.MERGE_ITEM_ID);
        String cid = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);
        HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
        String cacheType = KeyResolver.getCacheType(itemType);
        String cacheKey = null;
        switch (itemType) {
            case MokaConstants.ITEM_PAGE:
                cacheKey = KeyResolver.makePgItemCacheKey(domainId, itemId, httpParamMap);
                break;
            case MokaConstants.ITEM_CONTAINER:
                cacheKey = KeyResolver.makeCtItemCacheKey(domainId, itemId, null, null, httpParamMap);
                break;
            case MokaConstants.ITEM_COMPONENT:
                cacheKey = KeyResolver.makeCpItemCacheKey(domainId, itemId, null, cid, httpParamMap);
                break;
            case MokaConstants.ITEM_TEMPLATE:
                Object relCp = mergeContext.get(MokaConstants.ATTR_REL_CP);
                if (relCp == null) {
                    if (httpParamMap != null) {
                        relCp = httpParamMap.get(MokaConstants.PARAM_REL_CP);
                    }
                }
                cacheKey = KeyResolver.makeTpItemCacheKey(domainId, itemId, null, cid, relCp == null ? null : relCp.toString(), httpParamMap);
                break;
        }

        // content-type 설정 : PAGE에 설정된 content-type을 따르며, PAGE가 아니거나 없으면 text/html; charset=UTF-8로 설정 
        MergeItem item = (MergeItem) mergeContext.get(MokaConstants.MERGE_CONTEXT_ITEM);
        if (item != null && itemType.equals(MokaConstants.ITEM_PAGE)) {
            String pageType = item.getString(ItemConstants.PAGE_TYPE);
            if (McpString.isNotEmpty(pageType)) {
                response.setContentType(pageType + "; charset=UTF-8");
            } else {
                response.setContentType("text/html; charset=UTF-8");
            }
        } else {
            response.setContentType("text/html; charset=UTF-8");
        }

        PrintWriter writer = null;
        StringBuilder sb;
        try {
            writer = response.getWriter();
            // cache 확인          
            if (cacheManager != null) {
                String cachedItem = null;
                if (isPageItem) { // 페이지 캐시 여부에 따라
                    if (this.isPageCache) {
                        cachedItem = this.cacheManager.get(cacheType, cacheKey);
                    }
                    if (cachedItem == null) {
                        this.setCodesAndMenus(domainId, item, mergeContext);
                        sb = templateMerger.merge(domainId, itemType, itemId, mergeContext);
                        writer.append(sb);
                        if (this.isPageCache) {
                            this.cacheManager.set(cacheType, cacheKey, sb.toString());
                        }
                    } else {
                        writer.append(cachedItem);
                    }
                } else { // 페이지 이외의 아이템들
                    cachedItem = this.cacheManager.get(cacheType, cacheKey);
                    if (cachedItem != null) {
                        writer.append(cachedItem);
                    } else {
                        this.setCodesAndMenus(domainId, item, mergeContext);
                        sb = templateMerger.merge(domainId, itemType, itemId, mergeContext);
                        writer.append(sb);
                        this.cacheManager.set(cacheType, cacheKey, sb.toString());
                    }
                }
            } else {
                this.setCodesAndMenus(domainId, item, mergeContext);
                sb = templateMerger.merge(domainId, itemType, itemId, mergeContext);
                writer.append(sb);
            }
            actionLogger.success(HttpHelper.getRemoteAddr(request), ActionType.PAGE,
                    System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), path);
        } catch (Exception e) {
            logger.error("Request:{}, Exception: {}", request.getRequestURI(), e.toString());
            actionLogger.fail(HttpHelper.getRemoteAddr(request), ActionType.PAGE,
                    System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), path + " " + e.getMessage());
            throw e;
        } finally {
            if (writer != null) {
                writer.flush();
                writer.close();
            }
        }

        long endTime = System.currentTimeMillis();
        logger.debug("Template Merge Completed: {}ms {} {}", endTime - startTime, path, cacheKey);

    }

    private void setCodesAndMenus(String domainId, MergeItem item, MergeContext mergeContext)
            throws TemplateMergeException, TemplateParseException, DataLoadException {
        String category = item.getString(ItemConstants.PAGE_CATEGORY);
        if ( category == null) { // 페이지가 아닌 아이템에 파라미터로 들어올 경우
            HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
            category = httpParamMap.get(MokaConstants.PARAM_CATEGORY);
        }
//        if (category == null) {
//            return;
//        }
        DataLoader loader = this.templateMerger
                .getTemplateMerger(domainId)
                .getDataLoader();
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
}
