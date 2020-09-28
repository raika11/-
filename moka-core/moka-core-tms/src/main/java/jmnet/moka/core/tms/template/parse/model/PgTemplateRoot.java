package jmnet.moka.core.tms.template.parse.model;

import jmnet.moka.core.common.MokaConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.PageItem;

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
public class PgTemplateRoot extends MspTemplateRoot {
    private static final Logger logger = LoggerFactory.getLogger(PgTemplateRoot.class);

    public PgTemplateRoot(PageItem item) throws TemplateParseException {
        super(item, ItemConstants.PAGE_BODY);
    }

    @Override
    public void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
        context.set(MokaConstants.MERGE_CONTEXT_PAGE, this.item);
        // 2020-08-25 mte:data가 사용하는 부분보다 앞서 있다면 필요시 마다 로딩해도 문제가 없다.
        //        this.preloadData((MspTemplateMerger) merger, this.templateRoot, context);
        this.templateRoot.merge(merger, context, sb);
    }

    //    private void preloadData(MspTemplateMerger merger, TemplateRoot templateRoot,
    //            MergeContext context) {
    //        logger.trace("Merge entered : {} {}", this.item.getItemType(), this.item.getItemId());
    //        for (TemplateNode child : templateRoot.childNodes()) {
    //            String componentId = null;
    //            CpTemplateRoot cpTemplateRoot = null;
    //            try {
    //                if (child.getNodeName().equals(Constants.EL_CP)) { // child 컴포넌트 데이터로드
    //                    componentId = ((TemplateElement) child).getAttribute(Constants.ATTR_ID);
    //                    cpTemplateRoot = (CpTemplateRoot) merger
    //                            .getParsedTemplate(Constants.ITEM_COMPONENT,
    //                            componentId);
    //                    loadComponentData(merger, cpTemplateRoot, context);
    //                } else if (child.getNodeName().equals(Constants.EL_DATA)) { // child mte:data 데이터로드
    //                    DataMerger dataMerger =
    //                            (DataMerger) merger.getElementMerger(child.getNodeName());
    //                    dataMerger.loadData((TemplateElement) child, context);
    //                } else if (child.getNodeName().equals(Constants.EL_CT)) { // child 컨테이너의 child 컴포넌트 데이터 로드
    //                    TemplateRoot containerRoot = merger.getParsedTemplate(Constants.ITEM_CONTAINER,
    //                            ((TemplateElement) child).getAttribute(Constants.ATTR_ID));
    //                    for (TemplateNode ctChild : containerRoot.childNodes()) {
    //                        if (ctChild.getNodeName().equals(Constants.EL_CP)) {
    //                            componentId =
    //                                    ((TemplateElement) ctChild).getAttribute(Constants.ATTR_ID);
    //                            cpTemplateRoot = (CpTemplateRoot) merger
    //                                    .getParsedTemplate(MspConstants.ITEM_COMPONENT, componentId);
    //                            loadComponentData(merger, cpTemplateRoot, context);
    //                        }
    //                    }
    //                }
    //            } catch (TemplateLoadException | TemplateParseException | TemplateMergeException e) {
    //                logger.warn("DataLoad Fail: {} {} {} - component : {}", merger.getDomainId(),
    //                        templateRoot.getItemType(), templateRoot.getId(), componentId);
    //            }
    //        }
    //    }
    //
    //    private void loadComponentData(MspTemplateMerger merger, CpTemplateRoot cpTemplateRoot,
    //            MergeContext context) {
    //        String componentId = cpTemplateRoot.getId();
    //        try {
    //            cpTemplateRoot.loadData(merger, context);
    //        } catch (DataLoadException | ParseException | TemplateParseException
    //                | TemplateLoadException e) {
    //            logger.error("DataLoad Fail: {} {} {} - component : {}", merger.getDomainId(),
    //                    templateRoot.getItemType(), templateRoot.getId(), componentId, e);
    //        }
    //    }

}
