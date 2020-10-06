package jmnet.moka.core.tms.mvc;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MspDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.ReservedMap;

/**
 * <pre>
 * http 머지 요청을 처리하기 위한 전처리 과정을 수행한다.
 * 서비스여부, 도메인정보 설정, 
 * 2020. 3. 20. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 3. 20. 오후 4:06:12
 * @author kspark
 */
public class DefaultMergeHandler {
	private static final Logger logger = LoggerFactory.getLogger(DefaultMergeHandler.class);
	
	@Value("${tms.merge.view.name}")
	private String viewName;
		
	@Autowired
    private HttpParamFactory httpParamFactory;

    @Autowired
    private DomainResolver domainResolver;
	
    @Autowired
    private MspDomainTemplateMerger domainTemplateMerger;
	
	public String merge(HttpServletRequest request, HttpServletResponse response, Model model) throws IOException {
        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);

        if (request.getParameterMap().containsKey(MokaConstants.PARAM_WRAP_ITEM)) {
			mergeContext.getMergeOptions().setWrapItem(true);
        }

        if (request.getParameterMap().containsKey(MokaConstants.PARAM_MERGE_DEBUG)) {
            mergeContext.getMergeOptions().setDebug(true);
        }

        if (request.getParameter(MokaConstants.PARAM_SHOW_ITEM) != null) {
            String showItem = request.getParameter(MokaConstants.PARAM_SHOW_ITEM);
            if (showItem.length() > 2) {
                mergeContext.getMergeOptions().setShowItem(showItem.substring(0, 2));
                mergeContext.getMergeOptions().setShowItemId(showItem.substring(2));
                mergeContext.getMergeOptions().setWrapItem(true);
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
        MergeItem item = null;
        try {
            item = this.domainTemplateMerger.getItem(domainId, itemType, itemId);
            if (item != null) {
                if (item instanceof PageItem) {
                    // 페이지 이동 - MOVE_YN='Y' 일 경우 MOVE_URL 사용
                    if (item.getString(ItemConstants.PAGE_MOVE_YN).equalsIgnoreCase("Y")) {
                        MergeItem moveItem = this.getPageItem(domainId,
                                item.getString(ItemConstants.PAGE_MOVE_URL));
                        if (moveItem != null) {
                            mergeContext.set(MokaConstants.MERGE_PATH,
                                    item.getString(ItemConstants.PAGE_MOVE_URL));
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

		// Htttp 파라미터 설정
        HttpParamMap httpParamMap = this.httpParamFactory.creatHttpParamMap(request);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM,httpParamMap);

        // REST 방식 URI에 대한 처리: 마지막 경로를 파라미터로 넣어준다.
        if (item instanceof PageItem) {
            String paramName = item.getString(ItemConstants.PAGE_URL_PARAM);
            if (McpString.isNotEmpty(paramName)) {
                String mergePath = (String) mergeContext.get(MokaConstants.MERGE_PATH);
                int lastSlashIndex = mergePath.lastIndexOf("/");
                if ( lastSlashIndex > 0 && lastSlashIndex < mergePath.length()) {
                    String paramValue = mergePath.substring(lastSlashIndex+1,mergePath.length());
                    httpParamMap.put(paramName,paramValue);
                } else {
                    return null;
                }
            }
        }

		model.addAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
		return this.viewName;
	}
	
    private MergeItem getErrorPageItem(String domainId) {
        return getPageItem(domainId, MokaConstants.TMS_ERROR_PAGE);
    }

    /**
     * URI에 해당하는 PageItem을 반환한다.
     * @param domainId 도메인 Id
     * @param uri request uri
     * @return pageItem
     */
    private MergeItem getPageItem(String domainId, String uri) {
        MergeItem item = null;
        try {
            String itemKey =
                    this.domainTemplateMerger.getItemKey(domainId, uri);
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
     * @param domainId 도메인 ID
     * @param request http 요청
     * @return pageItem
     */
    private MergeItem getPageItem(String domainId, HttpServletRequest request) {
        MergeItem item = null;
        try {
            String pageItemId = request.getParameter(MokaConstants.PARAM_PAGE_ITEM_ID);
            if (pageItemId != null) {
                String itemType = MokaConstants.ITEM_PAGE;
                String itemId = pageItemId;
                item = this.domainTemplateMerger.getItem(domainId, itemType, itemId);
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
