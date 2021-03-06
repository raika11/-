package jmnet.moka.core.tms.merge.element;

import java.io.IOException;
import java.text.MessageFormat;
import java.time.LocalDateTime;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.CacheHelper;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.mvc.abtest.AbTest;
import jmnet.moka.core.tms.template.parse.model.MokaTemplateRoot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <pre>
 * cp(컴포넌트) 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 4. 오후 4:17:48
 */
public class CpMerger extends MokaAbstractElementMerger {

    private static final Logger logger = LoggerFactory.getLogger(CpMerger.class);
    private static final String ABTEST_START = "\n<abTestStart jnt=\"{0}\" cpId=\"{1}\"></abTestStart>\n";
    private static final String ABTEST_END = "\n<abTestEnd jnt=\"{0}\" cpId=\"{1}\"></abTestEnd>\n";
    private static final String ABTEST_TEMPLATE_START = "\n<template cpId=\"{0}\">\n";
    private static final String ABTEST_TEMPLATE_END = "\n</template>\n";

    public CpMerger(TemplateMerger<MergeItem> templateMerger)
            throws IOException {
        super(templateMerger);
        logger.debug("{} is Created", this
                .getClass()
                .getName());
    }

    public String makeCacheKey(TemplateElement element, MokaTemplateRoot templateRoot, MergeContext mergeContext) {
        String domainId = ((MokaTemplateMerger) this.templateMerger).getDomainId();
        return CacheHelper.makeCpItemCacheKey(domainId, element.getAttribute("id"), templateRoot.getPageIdForCache(mergeContext),
                templateRoot.getTotalIdForCache(mergeContext), templateRoot.getParamForCache(mergeContext, true), mergeContext);
    }

    @Override
    public void merge(TemplateElement element, MergeContext context, StringBuilder sb)
            throws TemplateMergeException {

        MokaTemplateRoot templateRoot = null;
        try {
            templateRoot = (MokaTemplateRoot) templateMerger.getParsedTemplate(MokaConstants.ITEM_COMPONENT, element.getAttribute(Constants.ATTR_ID));
            MergeItem item = templateRoot.getItem();
            if (item.getBoolYN(ItemConstants.COMPONENT_PERIOD_YN)) {
                String now = LocalDateTime
                        .now()
                        .format(MokaConstants.dtf);
                if (now.compareTo(item.getString(ItemConstants.COMPONENT_PERIOD_START_YMDT)) < 0) {
                    sb.append("<!-- Before Component Date -->");
                    return;
                }
                if (now.compareTo(item.getString(ItemConstants.COMPONENT_PERIOD_END_YMDT)) > 0) {
                    sb.append("<!-- After Component Date -->");
                    return;
                }
            }
            // VIEW_YN처리
            if (!item.getBoolYN(ItemConstants.COMPONENT_VIEW_YN)) {
                sb
                        .append("<!-- Component ")
                        .append(element.getAttribute(Constants.ATTR_ID))
                        .append("ViewYn=false -->");
                return;
            }
        } catch (Exception e) {
            throw new TemplateMergeException("Child Template Load Fail", element, e);
        }

        // ESI 처리
        if (this.addEsi(this.templateMerger, templateRoot, element, context, sb)) {
            return;
        }

        String cacheKey = makeCacheKey(element, (MokaTemplateRoot) templateRoot, context);
        boolean isDebug = context
                .getMergeOptions()
                .isDebug();
        if (isDebug == false && this.appendCached(CacheHelper.CACHE_CP_MERGE, cacheKey, sb)) {
            return;
        }

        StringBuilder cpSb = new StringBuilder(2048);
        boolean isWrapItem = context
                .getMergeOptions()
                .isWrapItem();
        String indent = context.getCurrentIndent();

        MergeContext childContext = context.createChild();
        String prevTailSpace = "";
        if (element.getPrevious() != null) {
            prevTailSpace = element
                    .getPrevious()
                    .getTailSpace();
        }
        String childIndent = indent + prevTailSpace;
        childContext.set(Constants.CURRENT_INDENT, childIndent);
        childContext.set(Constants.PREV_HAS_TAIL_SPACE, prevTailSpace.equals("") ? false : true);

        try {
            if (isDebug) {
                debug("START", element, childIndent, cpSb);
            }
            if (isWrapItem) {
                startWrapItem(element, indent, cpSb);
            }
            // AB 테스트 여부 확인
            AbTest abTest =
                    this.abTestResolver.getAbTest(((MokaTemplateMerger) this.templateMerger).getDomainId(), element.getAttribute(Constants.ATTR_ID));
            if (abTest == null) {
                templateRoot.merge(templateMerger, childContext, cpSb);
            } else {
                String abTestPreview = (String) context.get(MokaConstants.MERGE_CONTEXT_ABTEST_PREVIEW);
                // TODO 성능을 위해 제거 필요
                if ( abTestPreview == null) { // http 파라메터에서도 확인한다.
                    HttpParamMap httpParamMap = (HttpParamMap)context.get(MokaConstants.MERGE_CONTEXT_PARAM);
                    if ( httpParamMap.containsKey(MokaConstants.MERGE_CONTEXT_ABTEST_PREVIEW)) {
                        abTestPreview = httpParamMap.get(MokaConstants.MERGE_CONTEXT_ABTEST_PREVIEW);
                    }
                }
                if (McpString.isEmpty(abTestPreview)) {
                    cpSb.append(MessageFormat.format(ABTEST_START, abTest.getId(), abTest.getComponentId()));
                }
                if (McpString.isEmpty(abTestPreview) || abTestPreview.equals("A")) { // preview가 아니거나 A이면 표시
                    templateRoot.merge(templateMerger, childContext, cpSb);
                }
                if (McpString.isEmpty(abTestPreview)) {
                    cpSb.append(MessageFormat.format(ABTEST_TEMPLATE_START, abTest.getId()));
                }
                // B안 표시시 테스트정보로 Rendering
                childContext.set(MokaConstants.MERGE_CONTEXT_ABTEST, abTest);
                if (McpString.isEmpty(abTestPreview) || abTestPreview.equals("B")) {
                    templateRoot.merge(templateMerger, childContext, cpSb);
                }
                if (McpString.isEmpty(abTestPreview)) {
                    cpSb.append(ABTEST_TEMPLATE_END);
                    cpSb.append(MessageFormat.format(ABTEST_END, abTest.getId(), abTest.getComponentId()));
                }
            }
            if (isWrapItem) {
                endWrapItem(element, indent, cpSb);
            }
            if (isDebug) {
                debug("END  ", element, childIndent, cpSb);
            }
        } catch (Exception e) {
            throw new TemplateMergeException("Child Template Merge Fail", element, e);
        }

        if (isDebug == false) {
            this.setCache(CacheHelper.CACHE_CP_MERGE, cacheKey, cpSb);
        }
        sb.append(cpSb);
    }
}
