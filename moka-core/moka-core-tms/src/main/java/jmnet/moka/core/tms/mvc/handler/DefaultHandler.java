package jmnet.moka.core.tms.mvc.handler;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.mvc.HttpParamFactory;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.ReservedMap;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.method.HandlerMethod;

/**
 * <pre>
 * http 머지 요청을 처리하기 위한 전처리 과정을 수행한다.
 * 서비스여부, 도메인정보 설정,
 * 2020. 3. 20. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2020. 3. 20. 오후 4:06:12
 */
public class DefaultHandler extends AbstractHandler {
    private static final Logger logger = LoggerFactory.getLogger(DefaultHandler.class);

    @Autowired
    private HttpParamFactory httpParamFactory;

    @Autowired
    private DomainResolver domainResolver;

    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;

    private List<String> mergeItemList;

    public DefaultHandler() {
        this.handlerMethod = new HandlerMethod(this, this.findMethod(DefaultHandler.class));
        String[] partialMergeItems =
                {MokaConstants.ITEM_PAGE, MokaConstants.ITEM_COMPONENT, MokaConstants.ITEM_CONTAINER, MokaConstants.ITEM_TEMPLATE};
        this.mergeItemList = Arrays.asList(partialMergeItems);
    }

    @Override
    public HandlerMethod resolvable(HttpServletRequest request, String requestPath, List<String> pathList, String domainId)
            throws Exception {
        if (requestPath.startsWith("/_")) {
            // _CP, _TP, _CT 머지
            if (isMergableItem(request, domainId, requestPath, pathList)) {
                return this.handlerMethod;
            }
        }
        // 템플릿 아이템이 존재할 경우 domainId, 템플릿 아이템 타입, 경로를 설정한다.
        try {
            String itemKey = this.domainTemplateMerger.getItemKey(domainId, requestPath);
            MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
            this.setDeviceType(request, mergeContext);
            mergeContext.set(MokaConstants.MERGE_DOMAIN_ID, domainId);
            if (itemKey != null) {
                // 머지 옵션설정
                mergeContext.set(MokaConstants.MERGE_PATH, requestPath);
                mergeContext.set(MokaConstants.MERGE_ITEM_TYPE, KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_TYPE));
                mergeContext.set(MokaConstants.MERGE_ITEM_ID, KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_ID));
                request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);

            } else {
                // command일 경우 CommandController가 처리하도록 한다.
                if ( requestPath.startsWith(MokaConstants.MERGE_COMMAND_PREFIX)) {
                    return null;
                }
                // 에러페이지로 보낸다
                itemKey = this.domainTemplateMerger.getItemKey(domainId, MokaConstants.TMS_ERROR_PAGE);

                if (itemKey == null) { // 에러페이지가 존재하지 않을 경우 시스템 에러페이지로 처리
                    return null;
                }
                mergeContext.set(MokaConstants.MERGE_PATH, MokaConstants.TMS_ERROR_PAGE);
                mergeContext.set(MokaConstants.MERGE_ITEM_TYPE, KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_TYPE));
                mergeContext.set(MokaConstants.MERGE_ITEM_ID, KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_ID));
                request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
            }
            return this.handlerMethod;
        } catch (TemplateMergeException e) {
            logger.warn("Page Item not found: {} {}", domainId, requestPath);
        }
        return null;
    }


    private boolean isMergableItem(HttpServletRequest request, String domainId, String requestPath, List<String> pathList) {
        try {
            String itemType = pathList
                    .get(0)
                    .substring(1); // _제거
            if (!this.mergeItemList.contains(itemType)) {
                return false;
            }

            String itemId = pathList.get(1);
            if (this.domainTemplateMerger.getItem(domainId, itemType, itemId) != null) {
                // 머지 옵션설정
                MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
                this.setDeviceType(request, mergeContext);
                mergeContext.set(MokaConstants.MERGE_DOMAIN_ID, domainId);
                mergeContext.set(MokaConstants.MERGE_PATH, requestPath);
                mergeContext.set(MokaConstants.MERGE_ITEM_TYPE, itemType);
                mergeContext.set(MokaConstants.MERGE_ITEM_ID, itemId);
                request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
                return true;
            } else {
                logger.warn("MergeItem Find Fail: {} {} {}", domainId, itemType, itemId);
                return false;
            }
        } catch (TemplateLoadException | TemplateParseException | TemplateMergeException e) {
            logger.error("MergeItem Find Fail: {} {}", domainId, requestPath, e);
            return false;
        }
    }

    public String merge(HttpServletRequest request, HttpServletResponse response, Model model) {
        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);

        if (request
                .getParameterMap()
                .containsKey(MokaConstants.PARAM_WRAP_ITEM)) {
            mergeContext
                    .getMergeOptions()
                    .setWrapItem(true);
        }

        if (request
                .getParameterMap()
                .containsKey(MokaConstants.PARAM_MERGE_DEBUG)) {
            mergeContext
                    .getMergeOptions()
                    .setDebug(true);
        }

        if (request.getParameter(MokaConstants.PARAM_SHOW_ITEM) != null) {
            String showItem = request.getParameter(MokaConstants.PARAM_SHOW_ITEM);
            if (showItem.length() > 2) {
                mergeContext
                        .getMergeOptions()
                        .setShowItem(showItem.substring(0, 2));
                mergeContext
                        .getMergeOptions()
                        .setShowItemId(showItem.substring(2));
                mergeContext
                        .getMergeOptions()
                        .setWrapItem(true);
            }
        }

        // 도메인 정보를 설정한다.
        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        DomainItem domainItem = domainResolver.getDomainInfoById(domainId);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_DOMAIN, domainItem);

        // 예약어를 설정한다.
        ReservedMap reservedMap = domainResolver.getReservedMap(domainId);
        if (reservedMap != null) {
            mergeContext.set(MokaConstants.MERGE_CONTEXT_RESERVED, reservedMap);
        }

        // 페이지 정보를 설정한다.
        String itemType = (String) mergeContext.get(MokaConstants.MERGE_ITEM_TYPE);
        String itemId = (String) mergeContext.get(MokaConstants.MERGE_ITEM_ID);
        MergeItem item;
        try {
            item = this.domainTemplateMerger.getItem(domainId, itemType, itemId);
            if (item != null) {
                if (item instanceof PageItem) {
                    // 페이지 이동 - MOVE_YN='Y' 일 경우 MOVE_URL 사용
                    if (item
                            .getString(ItemConstants.PAGE_MOVE_YN)
                            .equalsIgnoreCase("Y")) {
                        MergeItem moveItem = this.getPageItem(domainId, item.getString(ItemConstants.PAGE_MOVE_URL));
                        if (moveItem != null) {
                            mergeContext.set(MokaConstants.MERGE_PATH, item.getString(ItemConstants.PAGE_MOVE_URL));
                            mergeContext.set(MokaConstants.MERGE_ITEM_TYPE, moveItem.getItemType());
                            mergeContext.set(MokaConstants.MERGE_ITEM_ID, moveItem.getItemId());
                        } else {
                            if ((item = this.getErrorPageItem(domainId)) == null) { // 에러페이지가 없을 경우
                                return null;
                            }
                        }
                    }
                } else {
                    // MokaConstants.PARAM_PAGE_ITEM_ID 파라미터에 pageItem id가 있을 경우 pageItem 정보 추가
                    MergeItem pageItem = getPageItem(domainId, request);
                    if (pageItem != null) {
                        mergeContext.set(MokaConstants.MERGE_CONTEXT_PAGE, pageItem);
                    }
                }
                mergeContext.set(MokaConstants.MERGE_CONTEXT_ITEM, item);
            } else {
                if ((item = this.getErrorPageItem(domainId)) == null) { // 에러페이지가 없을 경우
                    return null;
                }
            }
        } catch (Exception e) {
            if ((item = this.getErrorPageItem(domainId)) == null) { // 에러페이지가 없을 경우
                return null;
            }
        }

        // Http 파라미터 설정
        HttpParamMap httpParamMap = this.httpParamFactory.creatHttpParamMap(request);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM, httpParamMap);

        // Path Parameter 방식 URI에 대한 처리: 마지막 경로를 파라미터로 넣어준다.
        if (item instanceof PageItem) {
            // cache로 설정할 category를 추가한다.
            httpParamMap.put(MokaConstants.MERGE_CONTEXT_CATEGORY, item.getString(ItemConstants.PAGE_CATEGORY));
            // 경로 파라미터 처리
            processPathParam(mergeContext, (PageItem) item, httpParamMap);
        }

        // Http 헤더 설정
        mergeContext.set(MokaConstants.MERGE_CONTEXT_HEADER, HttpHelper.getHeaderMap(request));
        // Http 쿠기 설정
        mergeContext.set(MokaConstants.MERGE_CONTEXT_COOKIE, HttpHelper.getCookieMap(request));

        Map<String,String> cookieMap = HttpHelper.getCookieMap(request);
        if ( !cookieMap.containsKey("moka_width") && !((String) mergeContext.get(MokaConstants.MERGE_PATH)).equals("/responsive/js")) {
            mergeContext.set(MokaConstants.MERGE_ITEM_TYPE, MokaConstants.ITEM_PAGE);
            mergeContext.set(MokaConstants.MERGE_ITEM_ID, "80");
        }

        model.addAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
        return this.viewName;
    }

    /**
     * 경로 파라미터를 처리한다.
     * @param mergeContext 컨텍스트
     * @param pageItem 페이지 아이템
     * @param httpParamMap 파라미터 맵
     */
    private void processPathParam(MergeContext mergeContext, PageItem pageItem, HttpParamMap httpParamMap) {
        String urlParam = pageItem.getString(ItemConstants.PAGE_URL_PARAM);
        if (McpString.isNotEmpty(urlParam)) {
            String paramName = urlParam;
            String paramValue = null;
            if (urlParam.contains(",")) { // default 파라미터가 있는 경우
                String[] param = urlParam.split(",");
                paramName = param[0];
                paramValue = param[1];
            }
            String mergePath = (String) mergeContext.get(MokaConstants.MERGE_PATH);
            String noPathParamUrl = pageItem
                    .getString(ItemConstants.PAGE_URL)
                    .replace(AbstractTemplateLoader.PATH_PARAM_PREFIX, "");
            if (!mergePath.equalsIgnoreCase(noPathParamUrl)) { // 경로 파라미터가 있을 경우
                int length = mergePath.length();
                int lastSlashIndex = mergePath.lastIndexOf("/");
                if (lastSlashIndex > 0 && lastSlashIndex < length) {
                    paramValue = mergePath.substring(lastSlashIndex + 1, length);
                }
            }
            if (paramValue != null) { // default값이나 PathParam이 있을 경우만 추가
                httpParamMap.put(paramName, paramValue);
            }
        }
    }

    private MergeItem getErrorPageItem(String domainId) {
        return getPageItem(domainId, MokaConstants.TMS_ERROR_PAGE);
    }

    /**
     * URI에 해당하는 PageItem을 반환한다.
     *
     * @param domainId 도메인 Id
     * @param uri      request uri
     * @return pageItem
     */
    private MergeItem getPageItem(String domainId, String uri) {
        MergeItem item = null;
        try {
            String itemKey = this.domainTemplateMerger.getItemKey(domainId, uri);
            if (itemKey != null) {
                String itemType = KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_TYPE);
                String itemId = KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_ID);
                item = this.domainTemplateMerger.getItem(domainId, itemType, itemId);
                if (item == null) {
                    logger.error("PageItem not found : {} {} {}", uri, itemType, itemId);
                    return null;
                }
            }
        } catch (TemplateParseException | TemplateLoadException | TemplateMergeException e) {
            return null;
        }
        return item;
    }

    /**
     * MokaConstants.PARAM_PAGE_ITEM_ID에 선언된 파라메터명으로 pageItem을 반환한다.
     *
     * @param domainId 도메인 ID
     * @param request  http 요청
     * @return pageItem
     */
    private MergeItem getPageItem(String domainId, HttpServletRequest request) {
        MergeItem item = null;
        try {
            String pageItemId = request.getParameter(MokaConstants.PARAM_PAGE_ITEM_ID);
            if (pageItemId != null) {
                String itemType = MokaConstants.ITEM_PAGE;
                item = this.domainTemplateMerger.getItem(domainId, itemType, pageItemId);
                if (item == null) {
                    logger.error("PageItem not found : {} {}", itemType, pageItemId);
                    return null;
                }
            }
        } catch (TemplateParseException | TemplateLoadException | TemplateMergeException e) {
            return null;
        }
        return item;
    }

}
