package jmnet.moka.common.template.merge.element;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateText;

/**
 * <pre>
 * tp(템플릿) 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class ScriptMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(ScriptMerger.class);
	
	public ScriptMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}
	
	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {
		boolean isDebug = context.getMergeOptions().isDebug();
		String indent = context.getCurrentIndent();
		if ( isDebug ) debug ("EXECUTE-START", "script", indent, sb);
		try {
			List<TemplateNode> children = element.childNodes();
			if ( children == null || children.size() > 1) {
				logger.warn("{} has zeo or greater than one child", element.getNodeName() );
			} else {
				List<String> lines = ((TemplateText)children.get(0)).getLines();
				if ( lines == null || lines.size() > 1) {
					logger.warn("{}'s child has zeo or greater than one lines", element.getNodeName() );
				} else {
					String scriptText = lines.get(0);
					templateMerger.getEvaluator().executeScript(scriptText, context);
				}
			}
		} catch (Exception e) {
			throw new TemplateMergeException("Script Evaluation Fail", element, e);
		}
		if ( isDebug ) debug ("EXECUTE-END", "script", indent, sb);

	}
}
