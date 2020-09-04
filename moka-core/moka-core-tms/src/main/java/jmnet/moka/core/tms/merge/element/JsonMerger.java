package jmnet.moka.core.tms.merge.element;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.merge.element.AbstractElementMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.core.tms.merge.item.MergeItem;

/**
 * <pre>
 * ad(광고) 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class JsonMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(JsonMerger.class);

    public JsonMerger(TemplateMerger<MergeItem> templateMerger)
            throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}

	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException  {
		boolean isDebug = context.getMergeOptions().isDebug();
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
			if (isDebug) debug("START", element, childIndent, sb);
            String api = element.getAttribute("api");
            if (api != null) {
                // 토큰(${var}) 포함시 evaluation
                api = this.templateMerger.getEvaluator().evalTemplate(api,
                            childContext);
                DataLoader dataLoader = this.templateMerger.getDataLoader();
                sb.append(dataLoader.getRawData(api, null, true));
            } else {
                String url = element.getAttribute("url");
                // 토큰(${var}) 포함시 evaluation
                url = this.templateMerger.getEvaluator().evalTemplate(url,
                            childContext);
                DataLoader dataLoader = this.templateMerger.getDataLoader();
                sb.append(dataLoader.getRawData(url, null, false));
            }
			if (isDebug) debug("END  ", element, childIndent, sb);
		} catch ( Exception e) {
			throw new TemplateMergeException("Child Template Merge Fail", element, e);
		}
	}
}
