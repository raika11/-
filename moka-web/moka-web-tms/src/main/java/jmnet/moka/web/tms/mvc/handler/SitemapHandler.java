package jmnet.moka.web.tms.mvc.handler;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.mvc.HttpParamFactory;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.mvc.handler.AbstractHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.method.HandlerMethod;

/**
 * <pre>
 * Sitemap에 대한 http 머지 요청을 처리하기 위한 전처리 과정을 수행한다.
 * 2021. 02. 17. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2021. 02. 17. 오후 2:17:12
 */
public class SitemapHandler extends AbstractHandler {
    public static final String SITEMAP_TYPE = "sitemapType";
    public static final String SITEMAP_TYPE_INDEX = "index";
    public static final String SITEMAP_TYPE_YEAR = "year";
    public static final String SITEMAP_TYPE_DAY = "day";
    public static final String PARAM_YEAR = "year";
    public static final String PARAM_MONTH = "month";
    public static final String PARAM_DAY = "day";
    private static final Logger logger = LoggerFactory.getLogger(SitemapHandler.class);
    private final MokaDomainTemplateMerger domainTemplateMerger;
    @Autowired
    private HttpParamFactory httpParamFactory;

    public SitemapHandler(@Autowired MokaDomainTemplateMerger domainTemplateMerger) {
        this.domainTemplateMerger = domainTemplateMerger;
        this.handlerMethod = new HandlerMethod(this, this.findMethod(SitemapHandler.class));
    }

    @Override
    public HandlerMethod resolvable(HttpServletRequest request, String requestPath, List<String> pathList, String domainId) {
        // case-insensitive URI 처리
        if (requestPath
                .toLowerCase()
                .startsWith(MokaConstants.MERGE_SITEMAP_PREFIX)) {
            // 사이트맵 처리 : /sitemap(case insensitive)/index
            // 사이트맵 처리 : /sitemap(case insensitive)/index/{year}
            // 사이트맵 처리 : /sitemap(case insensitive)/index/{year}/{month}/{day}

            // 머지 옵션설정
            MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
            mergeContext.set(MokaConstants.MERGE_START_TIME, request.getAttribute(MokaConstants.MERGE_START_TIME));
            mergeContext.set(MokaConstants.MERGE_DOMAIN_ID, domainId);
            mergeContext.set(MokaConstants.MERGE_PATH, requestPath);
            // Http 파라미터 설정
            HttpParamMap httpParamMap = this.httpParamFactory.creatHttpParamMap(request);
            mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM, httpParamMap);

            mergeContext.set(MokaConstants.MERGE_ITEM_TYPE, MokaConstants.ITEM_PAGE);
            if (pathList.size() == 2) { // 연도 목록
                mergeContext.set(SITEMAP_TYPE, SITEMAP_TYPE_INDEX);
                mergeContext.set(MokaConstants.MERGE_ITEM_ID, "103");
            } else if (pathList.size() == 3) { // 월목록
                mergeContext.set(SITEMAP_TYPE, SITEMAP_TYPE_YEAR);
                mergeContext.set(MokaConstants.MERGE_ITEM_ID, "105");
                httpParamMap.put(PARAM_YEAR, pathList.get(2));
            } else if (pathList.size() == 5) { // 일별 기사
                mergeContext.set(SITEMAP_TYPE, SITEMAP_TYPE_DAY);
                mergeContext.set(MokaConstants.MERGE_ITEM_ID, "109");
                httpParamMap.put(PARAM_YEAR, pathList.get(2));
                httpParamMap.put(PARAM_MONTH, pathList.get(3));
                httpParamMap.put(PARAM_DAY, pathList.get(4));
            }

            request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
            return this.handlerMethod;
        }
        return null;
    }

    public String merge(HttpServletRequest request, HttpServletResponse response, Model model) {
        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);
        model.addAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
        return this.viewName;
    }

}
