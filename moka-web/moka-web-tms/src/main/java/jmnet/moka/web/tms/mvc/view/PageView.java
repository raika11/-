package jmnet.moka.web.tms.mvc.view;

import java.io.PrintWriter;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tms.merge.CacheHelper;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import org.infinispan.commons.util.concurrent.ConcurrentHashSet;
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
public class PageView extends MokaAbstractView {
    private static final Logger logger = LoggerFactory.getLogger(PageView.class);

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

    private ConcurrentHashSet requestedSet = new ConcurrentHashSet();

    /**
     * <pre>
     * http 머지 요청을 통해 수집된 정보를 취합하여 머지를 수행하여 결과를 반환한다.
     * </pre>
     *
     * @param model    모델
     * @param request  http 요청
     * @param response http 응답
     * @throws Exception 예외
     * @see AbstractView#renderMergedOutputModel(Map, HttpServletRequest,
     * HttpServletResponse)
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
        String articleId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);
        HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
        String cacheType = CacheHelper.getCacheType(itemType);
        String cacheKey = null;
        switch (itemType) {
            case MokaConstants.ITEM_PAGE:
                cacheKey = CacheHelper.makePgItemCacheKey(domainId, itemId, mergeContext);
                break;
            case MokaConstants.ITEM_CONTAINER:
                cacheKey = CacheHelper.makeCtItemCacheKey(domainId, itemId, null, null, httpParamMap, mergeContext);
                break;
            case MokaConstants.ITEM_COMPONENT:
                cacheKey = CacheHelper.makeCpItemCacheKey(domainId, itemId, null, articleId, httpParamMap, mergeContext);
                break;
            case MokaConstants.ITEM_TEMPLATE:
                Object relCp = mergeContext.get(MokaConstants.ATTR_REL_CP);
                if (relCp == null) {
                    if (httpParamMap != null) {
                        relCp = httpParamMap.get(MokaConstants.PARAM_REL_CP);
                    }
                }
                cacheKey = CacheHelper.makeTpItemCacheKey(domainId, itemId, null, articleId, relCp == null ? null : relCp.toString(), httpParamMap, mergeContext);
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
                        if (!this.requestedSet.contains(cacheKey)) {
                            try {
                                this.requestedSet.add(cacheKey);
                                this.setCodesAndMenus(this.templateMerger, domainId, item, mergeContext);
                                sb = templateMerger.merge(domainId, itemType, itemId, mergeContext);
                                writer.append(sb);
                                if (this.isPageCache) {
                                    this.cacheManager.set(cacheType, cacheKey, sb.toString());
                                }
                            } catch ( Exception e) {
                                logger.error("request Collapse fail: {}",e);
                            } finally {
                                this.requestedSet.remove(cacheKey);
                            }
                        } else {
                            int retryCount = 0;
                            while (cachedItem == null && retryCount < 20) {
                                cachedItem = this.cacheManager.get(cacheType, cacheKey);
                                try {
                                    Thread
                                            .currentThread()
                                            .sleep(100);
                                } catch (InterruptedException e) {
                                    logger.error("request Collapse fail: {}",e);
                                }
                                retryCount++;
                            }
                        }
                    } else {
                        writer.append(cachedItem);
                    }
                } else { // 페이지 이외의 아이템들
                    cachedItem = this.cacheManager.get(cacheType, cacheKey);
                    if (cachedItem != null) {
                        writer.append(cachedItem);
                    } else {
                        this.setCodesAndMenus(this.templateMerger, domainId, item, mergeContext);
                        sb = templateMerger.merge(domainId, itemType, itemId, mergeContext);
                        writer.append(sb);
                        this.cacheManager.set(cacheType, cacheKey, sb.toString());
                    }
                }
            } else {
                this.setCodesAndMenus(this.templateMerger, domainId, item, mergeContext);
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
}
