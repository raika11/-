package jmnet.moka.common.template.merge.element;

import static jmnet.moka.common.template.Constants.ATTR_SEPARATOR;
import static jmnet.moka.common.template.Constants.ATTR_TOKEN;
import static jmnet.moka.common.template.Constants.ATTR_VALUE;
import static jmnet.moka.common.template.Constants.LOOP_COUNT;
import static jmnet.moka.common.template.Constants.LOOP_INDEX;
import static jmnet.moka.common.template.Constants.LOOP_START;
import static jmnet.moka.common.template.Constants.SPLIT_TOKEN;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;

/**
 * <pre>
 * loop 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class SplitMerger extends AbstractElementMerger{

	private static final Logger logger = LoggerFactory.getLogger(SplitMerger.class);
    private static final String SPECIAL_REGEX_CHARS = "[{}()\\[\\].+*?^$\\\\|]";
	public SplitMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}

	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException  {
		String indent = context.getCurrentIndent();
		
        String token = element.getAttribute(ATTR_TOKEN);
        String value = element.getAttribute(ATTR_VALUE);
        String separator = ",";
        if (element.getAttribute(ATTR_SEPARATOR) != null) {
            separator = element.getAttribute(ATTR_SEPARATOR);
            if (SPECIAL_REGEX_CHARS.contains(separator)) {
                separator = "\\" + separator;
            }
        }

        String concated = "";
        if (token != null && token.length() > 0) {
            concated = (String) context.get(token);
            if ( concated == null || concated.length() == 0) {
                return; 
            }
        } else if ( value != null && value.length() > 0) {
            concated = value;
        } else {
            return ;
        }

        String[] splitted = concated.split(separator);

		// 1-base index를 사용함
        int start = 1, count = splitted.length + 1;
		
		boolean isDebug = context.getMergeOptions().isDebug();
		
		MergeContext childContext = context.createRowDataChild();
		childContext.set(LOOP_START, start);
		childContext.set(LOOP_COUNT, count);
		
		if (isDebug) debug("START", element, indent, sb);

        for (int i = start; i < count; i++) {
            childContext.set(LOOP_INDEX, i);
            childContext.set(SPLIT_TOKEN, splitted[i - 1]);
            if (isDebug)
                debug("START", "SPLIT index=" + i, indent + "\t", sb);
            for (TemplateNode node : element.childNodes()) {
                node.merge(templateMerger, childContext, sb);
			}
            if (isDebug)
                debug("END  ", "SPLIT index=" + i, indent + "\t", sb);
        }
		if (isDebug) debug("END  ", element, indent, sb);
	}
}
