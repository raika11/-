package jmnet.moka.common.template.merge.element;

import static jmnet.moka.common.template.Constants.*;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
/**
 * <pre>
 * set 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class SetMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(SetMerger.class);

	public SetMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}

	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {
		boolean isDebug = context.getMergeOptions().isDebug();
		String indent = context.getCurrentIndent();
		try {
			String var = element.getAttribute(ATTR_VAR);
			String value = element.getAttribute(ATTR_VALUE);
			Object evalValue = this.templateMerger.getEvaluator().eval(value, context);
			context.set(var, evalValue);
			if (isDebug) debug("SET", "var= " + var + ", value= "+value, indent, sb);
		} catch ( Exception e) {
			throw new TemplateMergeException("Set Var Fail", element, e);
		}
	}
}
