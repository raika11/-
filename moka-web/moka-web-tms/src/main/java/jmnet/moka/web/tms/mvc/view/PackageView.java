package jmnet.moka.web.tms.mvc.view;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
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
import jmnet.moka.web.tms.mvc.handler.SitemapHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.view.AbstractView;

/**
 * <pre>
 * Package(issue, series, topic)을  머징하여 브라우저로 보낸다
 * 2021. 03. 31. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2021. 03. 31. 오전 8:20:35
 */
public class PackageView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(PackageView.class);
    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;
    @Value("${tms.page.cache}")
    private boolean isPageCache;
    @Value("${package.issue.home.url}")
    private String issueHomeUrl;
    @Value("${package.series.home.url}")
    private String seriesHomeUrl;
    @Value("${package.topic.home.url}")
    private String topicHomeUrl;
    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;
    @Autowired(required = false)
    private CacheManager cacheManager;
    @Autowired
    private ActionLogger actionLogger;

    private static final String PACKAGE_TYPE_ISSUE = "issue";
    private static final String PACKAGE_TYPE_SERIES = "series";
    private static final String PACKAGE_TYPE_TOPIC = "topic";

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
     * @see AbstractView#renderMergedOutputModel(Map, HttpServletRequest, HttpServletResponse)
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
        String packageType = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_PACKAGE_TYPE);
        String packageId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_PACKAGE_ID);
        HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);

        // 홈(이슈, 시리즈, 토픽) url로 pageItem 조회
        String homeUrl = this.issueHomeUrl;
        if (packageType.equals(PACKAGE_TYPE_SERIES)) {
            homeUrl = this.seriesHomeUrl;
        } else if (packageType.equals(PACKAGE_TYPE_TOPIC)) {
            homeUrl = topicHomeUrl;
        }
        String itemKey = this.domainTemplateMerger.getItemKey(domainId, homeUrl);
        String itemType = KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_TYPE);
        String itemId = KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_ID);
        MergeItem item = this.domainTemplateMerger.getItem(domainId, itemType, itemId);

        // 이슈, 시리즈, 토픽에 필요한 데이터를 설정한다.

        response.setContentType("text/html; charset=UTF-8");

        PrintWriter writer = null;
        StringBuilder sb;
        try {
            writer = response.getWriter();
            this.setCodesAndMenus(domainId, item, mergeContext);
            sb = domainTemplateMerger.merge(domainId, itemType, itemId, mergeContext);
            writer.append(sb);
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
        logger.debug("Template Merge Completed: {}ms {}", endTime - startTime, path);

    }

    private void setCodesAndMenus(String domainId, MergeItem item, MergeContext mergeContext)
            throws TemplateMergeException, TemplateParseException, DataLoadException {
        String category = item.getString(ItemConstants.PAGE_CATEGORY);
        if (category == null) {
            return;
        }
        DataLoader loader = this.domainTemplateMerger
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
