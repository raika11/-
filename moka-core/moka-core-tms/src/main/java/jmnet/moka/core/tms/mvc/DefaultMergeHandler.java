package jmnet.moka.core.tms.mvc;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
import jmnet.moka.core.common.MspConstants;
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
        MergeContext mergeContext = (MergeContext) request.getAttribute(MspConstants.MERGE_CONTEXT);

        if (request.getParameterMap().containsKey(MspConstants.PARAM_WRAP_ITEM)) {
			mergeContext.getMergeOptions().setWrapItem(true);
        }

        if (request.getParameterMap().containsKey(MspConstants.PARAM_MERGE_DEBUG)) {
            mergeContext.getMergeOptions().setDebug(true);
        }

        if (request.getParameter(MspConstants.PARAM_SHOW_ITEM) != null) {
            String showItem = request.getParameter(MspConstants.PARAM_SHOW_ITEM);
            if (showItem.length() > 2) {
                mergeContext.getMergeOptions().setShowItem(showItem.substring(0, 2));
                mergeContext.getMergeOptions().setShowItemId(showItem.substring(2));
                mergeContext.getMergeOptions().setWrapItem(true);
            }
        }

		// 도메인 정보를 설정한다.
        String domainId = (String) mergeContext.get(MspConstants.MERGE_DOMAIN_ID);
        DomainItem domainItem = domainResolver.getDomainInfoById(domainId);
        mergeContext.set(MspConstants.MERGE_CONTEXT_DOMAIN, domainItem);

        // 예약어를 설정한다.
        ReservedMap reservedMap = domainResolver.getReservedMap(domainId);
        if (reservedMap != null) {
            mergeContext.set(MspConstants.MERGE_CONTEXT_RESERVED, reservedMap);
		}

		// 페이지 정보를 설정한다.
        //        String path = (String) mergeContext.get(MspConstants.MERGE_PATH);
        String itemType = (String) mergeContext.get(MspConstants.MERGE_ITEM_TYPE);
        String itemId = (String) mergeContext.get(MspConstants.MERGE_ITEM_ID);
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
                            mergeContext.set(MspConstants.MERGE_PATH,
                                    item.getString(ItemConstants.PAGE_MOVE_URL));
                            mergeContext.set(MspConstants.MERGE_ITEM_TYPE, moveItem.getItemType());
                            mergeContext.set(MspConstants.MERGE_ITEM_ID, moveItem.getItemId());
                        } else {
                            if ((item = this.getErrorPageItem(domainId)) == null) { // 에러페이지가 없을 경우
                                return null;
                            }
                        }
                    }
                } else {
                    MergeItem pageItem = getPageItem(domainId, request);
                    if (pageItem != null) {
                        mergeContext.set(MspConstants.MERGE_CONTEXT_PAGE, pageItem);
                    }
                }
                mergeContext.set(MspConstants.MERGE_CONTEXT_ITEM, item);
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
        mergeContext.set(MspConstants.MERGE_CONTEXT_PARAM,
                this.httpParamFactory.creatHttpParamMap(request));

		model.addAttribute(MspConstants.MERGE_CONTEXT, mergeContext);
		return this.viewName;
	}
	
    private MergeItem getErrorPageItem(String domainId) {
        return getPageItem(domainId, MspConstants.TMS_ERROR_PAGE);
    }

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

    private MergeItem getPageItem(String domainId, HttpServletRequest request) {
        MergeItem item = null;
        try {
            String pageItemId = request.getParameter(MspConstants.PARAM_PAGE_ITEM_ID);
            if (pageItemId != null) {
                String itemType = MspConstants.ITEM_PAGE;
                String itemId = pageItemId;
                item = this.domainTemplateMerger.getItem(domainId, itemType, itemId);
                if (item == null) {
                    logger.error("PageItem not found : {} {} {}", itemType, pageItemId);
                    return null;
                }
            }
        } catch (TemplateParseException | TemplateLoadException | TemplateMergeException e) {
            return null;
        }
        return item;
    }


}
