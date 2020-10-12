/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tms.mvc;

import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.ReservedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * <pre>
 * 기사(article)에 대한 http 머지 요청을 처리하기 위한 전처리 과정을 수행한다.
 * 서비스여부, 도메인정보 설정, 
 * 2020. 10. 12. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 10. 12. 오후 2:17:12
 * @author kspark
 */
public class ArticleHandler {
	private static final Logger logger = LoggerFactory.getLogger(ArticleHandler.class);
	
	@Value("${tms.merge.article.view.name}")
	private String articleViewName;
		
	@Autowired
    private HttpParamFactory httpParamFactory;

    @Autowired
    private DomainResolver domainResolver;
	
    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;
	
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

		// Htttp 파라미터 설정
        HttpParamMap httpParamMap = this.httpParamFactory.creatHttpParamMap(request);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM,httpParamMap);

        String articleId = (String)mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);

		model.addAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
		return this.articleViewName;
	}

	private void getArticle(String articleId) {

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

}
