package jmnet.moka.core.tms.merge.element;

import java.io.IOException;

import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.template.parse.model.CpTemplateRoot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.template.parse.model.MokaTemplateRoot;

/**
 * <pre>
 * tp(템플릿) 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class TpMerger extends MokaAbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(TpMerger.class);

    public TpMerger(TemplateMerger<MergeItem> templateMerger)
            throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}
	
    public String makeCacheKey(TemplateElement element, MokaTemplateRoot templateRoot,
            MergeContext context) {
        String domainId = ((MokaTemplateMerger) this.templateMerger).getDomainId();
        String relCp = (String) context.get(MokaConstants.ATTR_REL_CP);
        return KeyResolver.makeTpItemCacheKey(domainId, element.getAttribute("id"),
                templateRoot.getPageIdForCache(context), templateRoot.getTotalIdForCache(context),
                relCp, templateRoot.getParamForCache(context, false));
    }
	
	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException  {
		

        TemplateRoot templateRoot = null;
        try {
            templateRoot = templateMerger.getParsedTemplate(MokaConstants.ITEM_TEMPLATE,
                    element.getAttribute(Constants.ATTR_ID));
        } catch (Exception e) {
            throw new TemplateMergeException("Child Template Merge Fail", element, e);
        }

        // ESI 처리
        if (this.addEsi(this.templateMerger, templateRoot, element, context, sb)) {
            return;
        }

        boolean isDebug = context.getMergeOptions().isDebug();
        boolean isWrapItem = context.getMergeOptions().isWrapItem();
        String indent = context.getCurrentIndent();

        MergeContext childContext = context.createChild();
        String relCp = element.getAttribute(MokaConstants.ATTR_REL_CP);

        String cacheKey = makeCacheKey(element, (MokaTemplateRoot) templateRoot, childContext);
        if (isDebug == false && this.appendCached(KeyResolver.CACHE_TP_MERGE, cacheKey, sb)) {
            return;
        }

        // relCp가 있을 경우 컴포넌트의 데이터를 로딩한다.
        if ( McpString.isNotEmpty(relCp)) {
            CpTemplateRoot cpTemplateRoot = null;
            try {
                cpTemplateRoot = (CpTemplateRoot) ((MokaTemplateMerger) this.templateMerger).getParsedTemplate(MokaConstants.ITEM_COMPONENT, relCp);
                // 컴포넌트에서 rowDataContext를 얻어온 context로 template을 merge한다.
                childContext = cpTemplateRoot.getRowDataContext(templateMerger, context);
            } catch (TemplateParseException | TemplateLoadException e) {
                logger.warn("relCp matched Component is not exists or has error : {}", e);
            }
            childContext.set(MokaConstants.ATTR_REL_CP, relCp);
        }

        StringBuilder tpSb = new StringBuilder(2048);
		String prevTailSpace = "";
		if ( element.getPrevious() != null) {
			prevTailSpace = element.getPrevious().getTailSpace();
		} 
		String childIndent = indent + prevTailSpace;
        childContext.set(Constants.CURRENT_INDENT, childIndent);
        childContext.set(Constants.PREV_HAS_TAIL_SPACE, prevTailSpace.equals("") ? false : true);
		try {
            if (isDebug)
                debug("START", element, childIndent, tpSb);
            if (isWrapItem)
                startWrapItem(element, indent, tpSb);
            templateRoot.merge(templateMerger, childContext, tpSb);
            if (isWrapItem)
                endWrapItem(element, indent, tpSb);
            if (isDebug)
                debug("END  ", element, childIndent, tpSb);
		} catch ( Exception e) {
			throw new TemplateMergeException("Child Template Merge Fail", element, e);
		}

        if (isDebug == false) {
            this.setCache(KeyResolver.CACHE_TP_MERGE, cacheKey, tpSb);
        }
        sb.append(tpSb);
	}
}
