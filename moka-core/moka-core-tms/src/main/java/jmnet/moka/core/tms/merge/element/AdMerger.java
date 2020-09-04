package jmnet.moka.core.tms.merge.element;

import java.io.IOException;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MspTemplateMerger;
import jmnet.moka.core.tms.merge.item.AdItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.template.parse.model.MspTemplateRoot;

/**
 * <pre>
 * ad(광고) 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class AdMerger extends MspAbstractElementMerger {

    private static final Logger logger = LoggerFactory.getLogger(AdMerger.class);

    public AdMerger(TemplateMerger<MergeItem> templateMerger) throws IOException {
        super(templateMerger);
        logger.debug("{} is Created", this.getClass().getName());
    }

    public String makeCacheKey(TemplateElement element, MspTemplateRoot templateRoot,
            MergeContext context) {
        String domainId = ((MspTemplateMerger) this.templateMerger).getDomainId();
        return KeyResolver.makeAdItemCacheKey(domainId, element.getAttribute("id"));
    }

    @Override
    public void merge(TemplateElement element, MergeContext context, StringBuilder sb)
            throws TemplateMergeException {
        TemplateRoot templateRoot = null;
        try {
            templateRoot = templateMerger.getParsedTemplate(MspConstants.ITEM_AD,
                    element.getAttribute(Constants.ATTR_ID));
        } catch (Exception e) {
            throw new TemplateMergeException("Child Template Load Fail", element, e);
        }

        // 광고의 기간을 체크한다
        AdItem adItem = (AdItem) ((MspTemplateRoot) templateRoot).getItem();
        if (adItem.getBoolYN(ItemConstants.AD_USE_YN)) {
            String now = LocalDateTime.now().format(MspConstants.dtf);
            String start = adItem.getString(ItemConstants.AD_PERIOD_START_YMDT);
            if (start != null && now.compareTo(start) < 0) {
                sb.append("<!-- Before Ad Date -->");
                return;
            }
            String end = adItem.getString(ItemConstants.AD_PERIOD_END_YMDT);
            if (end != null && now.compareTo(end) > 0) {
                sb.append("<!-- After Ad Date -->");
                return;
            }
        }
        String cacheKey = makeCacheKey(element, (MspTemplateRoot) templateRoot, context);
        boolean isDebug = context.getMergeOptions().isDebug();
        if (isDebug == false && this.appendCached(KeyResolver.CACHE_AD_MERGE, cacheKey, sb)) {
            return;
        }

        StringBuilder adSb = new StringBuilder(2048);
        boolean isWrapItem = context.getMergeOptions().isWrapItem();
        String indent = context.getCurrentIndent();

        MergeContext childContext = context.createChild();
        String prevTailSpace = "";
        if (element.getPrevious() != null) {
            prevTailSpace = element.getPrevious().getTailSpace();
        }
        String childIndent = indent + prevTailSpace;
        childContext.set(Constants.CURRENT_INDENT, childIndent);
        childContext.set(Constants.PREV_HAS_TAIL_SPACE, prevTailSpace.equals("") ? false : true);

        if (isDebug)
            debug("START", element, childIndent, adSb);
        if (isWrapItem)
            startWrapItem(element, indent, adSb);
        templateRoot.merge(templateMerger, childContext, adSb);
        if (isWrapItem)
            endWrapItem(element, indent, adSb);
        if (isDebug)
            debug("END  ", element, childIndent, adSb);
        if (isDebug == false) {
            this.setCache(KeyResolver.CACHE_AD_MERGE, cacheKey, adSb);
        }
        sb.append(adSb);
    }
}
