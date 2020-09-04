package jmnet.moka.web.tms.mvc;

import java.io.IOException;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tms.merge.MspDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.HttpParamFactory;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;

public class CustomMergeHandler {
	private static final Logger logger = LoggerFactory.getLogger(CustomMergeHandler.class);
	
	@Value("${tms.merge.view.name}")
	private String viewName;

	@Value("${tms.http.param.page}")
	private String page;

    @Value("${tms.http.param.count}")
	private String count;

	@Value("${tms.http.param.sort}")
	private String sort;
		
	@Autowired
    private DomainResolver domainResolver;
	
    @Autowired
    private MspDomainTemplateMerger domainTemplateMerger;

    @Autowired
    private HttpParamFactory httpParamFactory;

    public String merge(HttpServletRequest request, HttpServletResponse response, Model model)
            throws IOException {
        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MspConstants.MERGE_CONTEXT);

        if (request.getParameterMap().containsKey("wrapItem"))
            mergeContext.getMergeOptions().setWrapItem(true);
        if (request.getParameter("showItem") != null)
            mergeContext.getMergeOptions().setShowItem(request.getParameter("showItem"));
        if (request.getParameter("showItemId") != null)
            mergeContext.getMergeOptions().setShowItemId(request.getParameter("showItemId"));

        // 도메인 정보를 설정한다.
        String domainId = (String) mergeContext.get(MspConstants.MERGE_DOMAIN_ID);
        Map<String, Object> domainInfo = domainResolver.getDomainInfoById(domainId);
        mergeContext.set(MspConstants.MERGE_CONTEXT_DOMAIN, domainInfo);

        // 코드정보를 설정한다.
        Map<String, String> domainCodeMapInfo = domainResolver.getReservedMap(domainId);
        if (domainCodeMapInfo != null) {
            mergeContext.set(MspConstants.MERGE_CONTEXT_RESERVED, domainCodeMapInfo);
        }

        // 페이지 정보를 설정한다.
        String path = (String) mergeContext.get(MspConstants.MERGE_PATH);
        String itemType = (String) mergeContext.get(MspConstants.MERGE_ITEM_TYPE);
        String itemId = (String) mergeContext.get(MspConstants.MERGE_ITEM_ID);

        try {
            MergeItem pageItem =
                    this.domainTemplateMerger.getItem(domainId, itemType, itemId);
            if (pageItem != null) {
                if (pageItem.containsKey(ItemConstants.PAGE_USE_YN)) {
                    boolean service = pageItem.getBool(ItemConstants.PAGE_USE_YN);
                    // 서비스 여부 적용
                    if (service == false) {
                        response.sendError(HttpStatus.NOT_FOUND.value());
                        return null;
                    }
                }
                mergeContext.set(MspConstants.MERGE_CONTEXT_PAGE, pageItem);
            } else {
                response.sendError(HttpStatus.NOT_FOUND.value());
                logger.error("PageInfo not found : {} {} {}", path, itemType, itemId);
                return null;
            }
        } catch (Exception e) {
            response.sendError(HttpStatus.NOT_FOUND.value());
            logger.error("PageInfo not found : {} {} {}", path, itemType, itemId, e);
            return null;
        }

        // Htttp 파라미터 설정    
        mergeContext.set(Constants.PARAM, this.httpParamFactory.creatHttpParamMap(request));

        model.addAttribute(MspConstants.MERGE_CONTEXT, mergeContext);
        return this.viewName;
    }

}
