/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tms.merge.element;

import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.TemplateElementBuilder;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.merge.item.AdItem;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.template.parse.model.MokaTemplateRoot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.annotation.Validated;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * <pre>
 * zone 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class ZoneMerger extends MokaAbstractElementMerger {

    private static final Logger logger = LoggerFactory.getLogger(ZoneMerger.class);

    public ZoneMerger(TemplateMerger<MergeItem> templateMerger) throws IOException {
        super(templateMerger);
        logger.debug("{} is Created", this.getClass().getName());
    }

    @Validated
    public String makeCacheKey(TemplateElement element, MokaTemplateRoot templateRoot,
            MergeContext context) {
        String domainId = ((MokaTemplateMerger) this.templateMerger).getDomainId();
        return KeyResolver.makeAdItemCacheKey(domainId, element.getAttribute("id"));
    }

    @Override
    public void merge(TemplateElement element, MergeContext context, StringBuilder sb)
            throws TemplateMergeException {

        String relCp = element.getAttribute(MokaConstants.ATTR_REL_CP);
        String match = element.getAttribute(MokaConstants.ATTR_MATCH);
        MokaTemplateRoot cpTemplateRoot = null;
        try {
            cpTemplateRoot = (MokaTemplateRoot)templateMerger.getParsedTemplate(MokaConstants.ITEM_COMPONENT,
                    relCp);
        } catch (Exception e) {
            throw new TemplateMergeException("related Component Load Fail", element, e);
        }
        ComponentItem componentItem = (ComponentItem)cpTemplateRoot.getItem();
        String matchZone = componentItem.getString(ItemConstants.COMPONENT_MATCH_ZONE);

        String cacheKey = makeCacheKey(element, (MokaTemplateRoot) cpTemplateRoot, context);
        boolean isDebug = context.getMergeOptions().isDebug();
        if (isDebug == false && this.appendCached(KeyResolver.CACHE_AD_MERGE, cacheKey, sb)) {
            return;
        }

        StringBuilder zoneSb = new StringBuilder(2048);
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
            debug("START", element, childIndent, zoneSb);
        if (isWrapItem)
            startWrapItem(element, indent, zoneSb);
        if ( matchZone.equals(match)) {
            // 동적인 zone엘리먼트 정보로 동적 cp엘리먼트 생성
            TemplateElement dynamicCp = TemplateElementBuilder.createDynamicTemplateElement(
                    element.getTemplateRoot(),element.getPrevious(), Constants.EL_CP, relCp);
            dynamicCp.merge(this.templateMerger,childContext,sb);
        }
        if (isWrapItem)
            endWrapItem(element, indent, zoneSb);
        if (isDebug)
            debug("END  ", element, childIndent, zoneSb);
        if (isDebug == false) {
//            this.setCache(KeyResolver.CACHE_AD_MERGE, cacheKey, zoneSb);
        }
        sb.append(zoneSb);
    }
}
