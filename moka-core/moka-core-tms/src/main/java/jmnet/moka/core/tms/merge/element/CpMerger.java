package jmnet.moka.core.tms.merge.element;

import java.io.IOException;
import java.time.LocalDateTime;

import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.template.parse.model.MokaTemplateRoot;

/**
 * <pre>
 * cp(컴포넌트) 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class CpMerger extends MokaAbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(CpMerger.class);

    public CpMerger(TemplateMerger<MergeItem> templateMerger)
            throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}

    public String makeCacheKey(TemplateElement element, MokaTemplateRoot templateRoot,
            MergeContext context) {
        String domainId = ((MokaTemplateMerger) this.templateMerger).getDomainId();
        return KeyResolver.makeCpItemCacheKey(domainId, element.getAttribute("id"),
                templateRoot.getPageIdForCache(context), templateRoot.getTotalIdForCache(context),
                templateRoot.getParamForCache(context, true));
    }

	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {

        MokaTemplateRoot templateRoot = null;
        try {
            templateRoot =
                    (MokaTemplateRoot) templateMerger.getParsedTemplate(MokaConstants.ITEM_COMPONENT,
                    element.getAttribute(Constants.ATTR_ID));
            MergeItem item = templateRoot.getItem();
            if (item.getBoolYN(ItemConstants.COMPONENT_PERIOD_YN)) {
                String now =
                        LocalDateTime.now().format(MokaConstants.dtf);
                if (now.compareTo(item.getString(ItemConstants.COMPONENT_PERIOD_START_YMDT)) < 0) {
                    sb.append("<!-- Before Component Date -->");
                    return;
                }
                if (now.compareTo(item.getString(ItemConstants.COMPONENT_PERIOD_END_YMDT)) > 0) {
                    sb.append("<!-- After Component Date -->");
                    return;
                }
            }

        } catch (Exception e) {
            throw new TemplateMergeException("Child Template Load Fail", element, e);
        }

        // ESI 처리
        if (this.addEsi(this.templateMerger, templateRoot, element, context, sb)) {
            return;
        }

        String cacheKey = makeCacheKey(element, (MokaTemplateRoot) templateRoot, context);
        boolean isDebug = context.getMergeOptions().isDebug();
        if (isDebug == false && this.appendCached(KeyResolver.CACHE_CP_MERGE, cacheKey, sb)) {
            return;
        }

        StringBuilder cpSb = new StringBuilder(2048);
		boolean isWrapItem = context.getMergeOptions().isWrapItem();
		String indent = context.getCurrentIndent();
		
		MergeContext childContext = context.createChild();
		String prevTailSpace = "";
		if ( element.getPrevious() != null) {
			prevTailSpace = element.getPrevious().getTailSpace();
		} 
		String childIndent = indent + prevTailSpace;
        childContext.set(Constants.CURRENT_INDENT, childIndent);
        childContext.set(Constants.PREV_HAS_TAIL_SPACE, prevTailSpace.equals("") ? false : true);
		
		try {
            if (isDebug)
                debug("START", element, childIndent, cpSb);
            if (isWrapItem)
                startWrapItem(element, indent, cpSb);
            templateRoot.merge(templateMerger, childContext, cpSb);
            if (isWrapItem)
                endWrapItem(element, indent, cpSb);
            if (isDebug)
                debug("END  ", element, childIndent, cpSb);
		} catch ( Exception e) {
			throw new TemplateMergeException("Child Template Merge Fail", element, e);
		}

        if (isDebug == false) {
            this.setCache(KeyResolver.CACHE_CP_MERGE, cacheKey, cpSb);
        }
        sb.append(cpSb);
	}
}
