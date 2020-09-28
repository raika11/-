package jmnet.moka.core.tms.mvc;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jmnet.moka.core.common.MokaConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.view.AbstractView;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MspDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.MergeItem;

/**
 * <pre>
 * 템플릿을 머징하여 브라우저로 보낸다
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 10. 오후 3:54:35
 * @author kspark
 */
public class DefaultMergeView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(DefaultMergeView.class);

    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;

    @Value("${tms.page.cache}")
    private boolean isPageCache;

    @Autowired
    private MspDomainTemplateMerger templateMerger;

    @Autowired(required = false)
    private CacheManager cacheManager;


    @Override
    protected boolean generatesDownloadContent() {
        return false;
    }

    /**
     * <pre>
     * http 머지 요청을 통해 수집된 정보를 취합하여 머지를 수행하여 결과를 반환한다.
     * </pre>
     * 
     * @param model
     * @param request
     * @param response
     * @throws IOException
     * @throws TemplateParseException
     * @throws NoHandlerFoundException
     * @throws TemplateMergeException
     * @see org.springframework.web.servlet.view.AbstractView#renderMergedOutputModel(java.util.Map,
     *      javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected final void renderMergedOutputModel(Map<String, Object> model,
            HttpServletRequest request, HttpServletResponse response) throws IOException,
            TemplateParseException, NoHandlerFoundException, TemplateMergeException {

        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);

        // debug 옵션
        mergeContext.getMergeOptions().setDebug(templateMergeDebug);
        long startTime = System.currentTimeMillis();

        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        String path = (String) mergeContext.get(MokaConstants.MERGE_PATH);
        String itemType = (String) mergeContext.get(MokaConstants.MERGE_ITEM_TYPE);
        boolean isPageItem = itemType.equals(MokaConstants.ITEM_PAGE);
        String itemId = (String) mergeContext.get(MokaConstants.MERGE_ITEM_ID);
        String cid = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_CID);
        HttpParamMap httpParamMap =
                (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
        String cacheType = KeyResolver.getCacheType(itemType);
        String cacheKey = null;
        if (itemType.equals(MokaConstants.ITEM_PAGE)) {
            cacheKey = KeyResolver.makePgItemCacheKey(domainId, itemId, httpParamMap);
        } else if (itemType.equals(MokaConstants.ITEM_CONTENT_SKIN)) {
            cacheKey = "";
        } else if (itemType.equals(MokaConstants.ITEM_COMPONENT)) {
            cacheKey = KeyResolver.makeCpItemCacheKey(domainId, itemId, null, cid, httpParamMap);
        } else if (itemType.equals(MokaConstants.ITEM_TEMPLATE)) {
            Object relCp = mergeContext.get(MokaConstants.ATTR_REL_CP);
            if (relCp == null) {
                if (httpParamMap != null) {
                    relCp = httpParamMap.get(MokaConstants.PARAM_REL_CP);
                }
            }
            cacheKey = KeyResolver.makeTpItemCacheKey(domainId, itemId, null, cid,
                    relCp == null ? null : relCp.toString(), httpParamMap);
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
        StringBuilder sb = null;
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
                        sb = templateMerger.merge(domainId, itemType, itemId, mergeContext);
                        writer.append(sb);
                        this.cacheManager.set(cacheType, cacheKey, sb.toString());
                    }
                }
            } else {
                sb = templateMerger.merge(domainId, itemType, itemId, mergeContext);
                writer.append(sb);
            }
        } catch (Exception e) {
            logger.error("Request:{}, Exception: {}", request.getRequestURI(), e.toString());
            throw e;
        } finally {
            writer.flush();
            writer.close();
        }

        long endTime = System.currentTimeMillis();
        logger.debug("Template Merge Completed: {}ms {} {}", endTime - startTime, path, cacheKey);

    }

}
