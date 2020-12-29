package jmnet.moka.common.template.merge.element;

import java.io.IOException;
import java.util.List;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateText;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <pre>
 * preserve 엘리먼트를 머지한다. 태그에 포함된 내용을 그대로 유지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 12. 29. 오후 4:17:48
 * @author kspark
 */
public class PreserveMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(PreserveMerger.class);

	public PreserveMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}
	
	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {
		boolean isDebug = context.getMergeOptions().isDebug();
		String indent = context.getCurrentIndent();
		if ( isDebug ) debug ("PRESERVE-START", "preserve", indent, sb);
		try {
			List<TemplateNode> children = element.childNodes();
			if ( children == null || children.size() > 1) {
				logger.warn("{} has zeo or greater than one child", element.getNodeName() );
			} else {
				List<String> lines = ((TemplateText)children.get(0)).getLines();
				for ( String line : lines) {
					sb.append(line);
				}
			}
		} catch (Exception e) {
			throw new TemplateMergeException("PRESERVE merge Fail", element, e);
		}
		if ( isDebug ) debug ("PRESERVE-END", "script", indent, sb);

	}
}
