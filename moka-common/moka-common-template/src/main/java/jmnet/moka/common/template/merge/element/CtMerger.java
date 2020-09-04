package jmnet.moka.common.template.merge.element;

import static jmnet.moka.common.template.Constants.ATTR_ID;
import static jmnet.moka.common.template.Constants.CURRENT_INDENT;
import static jmnet.moka.common.template.Constants.ITEM_CONTAINER;
import static jmnet.moka.common.template.Constants.PREV_HAS_TAIL_SPACE;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateRoot;

/**
 * <pre>
 * ct(컨테이너) 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class CtMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(CtMerger.class);
	
	public CtMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}
	
	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {
		boolean isDebug = context.getMergeOptions().isDebug();
		boolean isWrapItem = context.getMergeOptions().isWrapItem();
		String indent = context.getCurrentIndent();
		
		MergeContext childContext = context.createChild();
		String prevTailSpace = "";
		if ( element.getPrevious() != null) {
			prevTailSpace = element.getPrevious().getTailSpace();
		} 
		String childIndent = indent + prevTailSpace;
		childContext.set(CURRENT_INDENT,  childIndent);
		childContext.set(PREV_HAS_TAIL_SPACE, prevTailSpace.equals("")? false: true);			
		
		try {
			TemplateRoot templateRoot = templateMerger.getParsedTemplate(ITEM_CONTAINER, element.getAttribute(ATTR_ID));
			
			if (isDebug) debug("START", element, childIndent, sb);
			if (isWrapItem) startWrapItem(element, indent, sb);
			templateRoot.merge(templateMerger, childContext, sb);
			if (isWrapItem) endWrapItem(element, indent, sb);
			if (isDebug) debug("END  ", element, childIndent, sb);
		} catch ( Exception e) {
			throw new TemplateMergeException("Child Template Merge Fail", element, e);
		}
	}
}
