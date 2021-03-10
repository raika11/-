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
 * Sitemap을  머징하여 브라우저로 보낸다
 * 2021. 02. 18. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2021. 02. 18. 오후 3:54:35
 */
public class SitemapView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(SitemapView.class);
    private static final int START_YEAR = 1965;
    private static final int START_MONTH = 9;
    private static final int START_DAY = 22;
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
        String itemType = (String) mergeContext.get(MokaConstants.MERGE_ITEM_TYPE);
        String itemId = (String) mergeContext.get(MokaConstants.MERGE_ITEM_ID);
        String sitemapType = (String) mergeContext.get(SitemapHandler.SITEMAP_TYPE);
        HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);

        // context 설정 : 년도 목록, 월목록, 일목록
        if (sitemapType.equals(SitemapHandler.SITEMAP_TYPE_INDEX)) {
            this.setYearList(mergeContext);
        } else if (sitemapType.equals(SitemapHandler.SITEMAP_TYPE_YEAR)) {
            this.setMonthList(mergeContext, httpParamMap);
        } else if (sitemapType.equals(SitemapHandler.SITEMAP_TYPE_DAY)) {
            this.setDayList(mergeContext, httpParamMap);
        }

        MergeItem item = this.domainTemplateMerger.getItem(domainId, itemType, itemId);
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

    private void setYearList(MergeContext mergeContext) {
        Calendar calendar = Calendar.getInstance();
        int currentYear = calendar.get(Calendar.YEAR);
        List<Map<String, Integer>> yearList = new ArrayList<>(64);
        for (int year = START_YEAR; year <= currentYear; year++) {
            yearList.add(Collections.singletonMap("year", year));
        }
        mergeContext.set("yearList", yearList);
    }

    private void setMonthList(MergeContext mergeContext, HttpParamMap httpParamMap) {
        String yearString = httpParamMap.get(SitemapHandler.PARAM_YEAR);
        int paramYear = Integer.parseInt(yearString);
        int startMonth = 1;
        int endMonth = 12;
        if (paramYear == START_YEAR) {
            startMonth = START_MONTH;
        }
        Calendar calendar = Calendar.getInstance();
        if (paramYear == calendar.get(Calendar.YEAR)) {
            endMonth = calendar.get(Calendar.MONTH) + 1;
        }
        List<Map<String, String>> monthList = new ArrayList<>(12);
        for (int month = startMonth; month <= endMonth; month++) {
            Map<String, String> map = new HashMap<>(1);
            map.put("zeroPadMonth", String.format("%02d", month));
            map.put("month", String.format("%d", month));
            if (paramYear == START_YEAR && month == START_MONTH) {
                map.put("startDay", String.format("%02d", START_DAY));
            } else {
                map.put("startDay", String.format("%02d", 1));
            }
            monthList.add(map);
        }
        mergeContext.set("year", paramYear);
        mergeContext.set("monthList", monthList);
    }

    private void setDayList(MergeContext mergeContext, HttpParamMap httpParamMap) {
        String yearString = httpParamMap.get(SitemapHandler.PARAM_YEAR);
        String monthString = httpParamMap.get(SitemapHandler.PARAM_MONTH);
        String dayString = httpParamMap.get(SitemapHandler.PARAM_DAY);
        int paramYear = Integer.parseInt(yearString);
        int paramMonth = Integer.parseInt(monthString);
        int paramDay = Integer.parseInt(dayString);
        Calendar calendar = Calendar.getInstance();
        int nowYear = calendar.get(Calendar.YEAR);
        int nowMonth = calendar.get(Calendar.MONTH) + 1;
        int nowDay = calendar.get(Calendar.DATE);
        calendar.set(paramYear, paramMonth - 1, 1);
        int startDay = 1;
        int endDay = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
        if (paramYear == START_YEAR && paramMonth == START_MONTH) {
            startDay = START_DAY;
        }
        if (paramYear == nowYear && paramMonth == nowMonth) {
            endDay = nowDay;
        }
        List<Map<String, String>> dayList = new ArrayList<>(32);
        for (int day = startDay; day <= endDay; day++) {
            Map<String, String> map = new HashMap<>(1);
            map.put("zeroPadDay", String.format("%02d", day));
            map.put("day", String.format("%d", day));
            map.put("select", paramDay == day ? "selected" : "");
            dayList.add(map);
        }
        mergeContext.set("year", paramYear);
        mergeContext.set("month", paramMonth);
        mergeContext.set("day", paramDay);
        mergeContext.set("dayList", dayList);
    }
}
