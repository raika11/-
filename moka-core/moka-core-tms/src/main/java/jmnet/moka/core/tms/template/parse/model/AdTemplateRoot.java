package jmnet.moka.core.tms.template.parse.model;

import jmnet.moka.core.common.MokaConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.AdItem;

/**
 * 
 * <pre>
 * 파싱된 템플릿 정보의 최상위 노드, DOM의 Root와 동일 개념
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 6:20:25
 * @author kspark
 */
public class AdTemplateRoot extends MokaTemplateRoot {
    private static final Logger logger = LoggerFactory.getLogger(AdTemplateRoot.class);

    public AdTemplateRoot(AdItem item)
            throws TemplateParseException {
        super(item, ItemConstants.AD_BODY);

        this.setHasBodyToken();
    }

    @Override
    public void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
        logger.trace("Merge entered : {} {}", this.item.getItemType(), this.item.getItemId());
        context.set(MokaConstants.MERGE_CONTEXT_AD, this.item);
        this.templateRoot.merge(merger, context, sb);
    }

}
