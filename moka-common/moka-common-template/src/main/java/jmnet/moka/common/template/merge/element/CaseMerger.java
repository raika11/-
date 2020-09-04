package jmnet.moka.common.template.merge.element;

import static jmnet.moka.common.template.Constants.*;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;/**
 * <pre>
 * case 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class CaseMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(CaseMerger.class);

	public CaseMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}

	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {
		boolean isDebug = context.getMergeOptions().isDebug();
		String indent = context.getCurrentIndent();
		
		if (isDebug) debug ("START", element, indent, sb);
		
		if ( templateMerger.getEvaluator().evalBool(element.getAttribute(ATTR_IF), context)) {
			for ( TemplateNode node : element.childNodes()) {
				node.merge(templateMerger, context, sb);
			}
		} else {
			if (isDebug) debug ("NOT MATCH", element, indent, sb);
		}
		
		if (isDebug) debug ("END  ", element, indent, sb);
	}
}
