package jmnet.moka.core.tms.merge.element;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MspTemplateMerger;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.template.parse.model.MspTemplateRoot;

/**
 * <pre>
 * ct(컨테이너) 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class CtMerger extends MspAbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(CtMerger.class);

    public CtMerger(TemplateMerger<MergeItem> templateMerger)
            throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}
	
    public String makeCacheKey(TemplateElement element, MspTemplateRoot templateRoot,
            MergeContext context) {
        String domainId = ((MspTemplateMerger) this.templateMerger).getDomainId();

        return KeyResolver.makeCtItemCacheKey(domainId, element.getAttribute("id"),
                templateRoot.getPageIdForCache(context), templateRoot.getCidForCache(context),
                templateRoot.getParamForCache(context, false));
    }

	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {
        TemplateRoot templateRoot = null;
        try {
            templateRoot = templateMerger.getParsedTemplate(Constants.ITEM_CONTAINER,
                    element.getAttribute(Constants.ATTR_ID));
        } catch (Exception e) {
            throw new TemplateMergeException("Child Template Load Fail", element, e);
        }
        // ESI 처리
        if (this.addEsi(this.templateMerger, templateRoot, element, context, sb)) {
            return;
        }
        String cacheKey = makeCacheKey(element, (MspTemplateRoot) templateRoot, context);
        boolean isDebug = context.getMergeOptions().isDebug();
        if (isDebug == false && this.appendCached(KeyResolver.CACHE_CT_MERGE, cacheKey, sb)) {
            return;
        }

        StringBuilder ctSb = new StringBuilder(2048);
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
                debug("START", element, childIndent, ctSb);
            if (isWrapItem)
                startWrapItem(element, indent, ctSb);
            templateRoot.merge(templateMerger, childContext, ctSb);
            if (isWrapItem)
                endWrapItem(element, indent, ctSb);
            if (isDebug)
                debug("END  ", element, childIndent, ctSb);
		} catch ( Exception e) {
			throw new TemplateMergeException("Child Template Merge Fail", element, e);
		}
        if (isDebug == false) {
            this.setCache(KeyResolver.CACHE_CT_MERGE, cacheKey, ctSb);
        }
        sb.append(ctSb);
	}
}
