package jmnet.moka.common.template.merge.element;

import static jmnet.moka.common.template.Constants.ATTR_IF;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.Constants;
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
public class ChooseMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(ChooseMerger.class);

	public ChooseMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}

	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {
		boolean isDebug = context.getMergeOptions().isDebug();
		String indent = context.getCurrentIndent();
		
		if (isDebug) debug ("START", element, indent, sb);
        for (TemplateNode node : element.childNodes()) {
            if (node.getNodeName().equals(Constants.EL_OTHERWISE)) {
                // OtherwiseMerger를 별도로 만들지 않기 위해 
                if (isDebug)
                    debug("START", (TemplateElement) node, indent, sb);
                for (TemplateNode childNode : node.childNodes()) {
                    childNode.merge(templateMerger, context, sb);
                }
                if (isDebug)
                    debug("END  ", (TemplateElement) node, indent, sb);
            } else if (node.getNodeName().equals(Constants.EL_CASE)) {
                if (templateMerger.getEvaluator()
                        .evalBool(((TemplateElement) node).getAttribute(ATTR_IF),
                        context)) {
                    node.merge(templateMerger, context, sb);
                    break;
                }
            } else {
                // mte:case와 mte:otherwise외에는 머지하지 않는다.
            }
        }
		if (isDebug) debug ("END  ", element, indent, sb);
	}
}
