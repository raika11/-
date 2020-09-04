package jmnet.moka.core.tms.merge.element;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.merge.element.AbstractElementMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.core.tms.merge.item.MergeItem;

/**
 * <pre>
 * body(기사 본문) 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class BodyMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(BodyMerger.class);

    public BodyMerger(TemplateMerger<MergeItem> templateMerger)
            throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}


	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {

	}
}
