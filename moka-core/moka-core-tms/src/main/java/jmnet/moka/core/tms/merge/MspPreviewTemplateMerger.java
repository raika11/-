package jmnet.moka.core.tms.merge;

import java.io.IOException;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import org.apache.commons.jexl3.MapContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.loader.TemplateLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.ReservedMap;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;

/**
 * <pre>
 * TPS에서 사용할 미리보기를 위한 템플릿머저를 생성한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 5:59:52
 * @author kspark
 */
public class MspPreviewTemplateMerger extends MspTemplateMerger {

    private static final Logger logger = LoggerFactory.getLogger(MspPreviewTemplateMerger.class);
    private DomainItem domainItem;
    private DomainResolver domainResolver;
    private String workerId;
    private Long editionSeq;

    public MspPreviewTemplateMerger(GenericApplicationContext appContext, DomainItem domainItem,
            DomainResolver domainResolver, AbstractTemplateLoader templateLoader,
            DataLoader dataLoader, TemplateLoader<MergeItem> assistantTemplateLoader)
            throws IOException {
        this(appContext, domainItem, domainResolver, templateLoader, dataLoader,
                assistantTemplateLoader, null, null);
    }

    public MspPreviewTemplateMerger(GenericApplicationContext appContext, DomainItem domainItem,
            DomainResolver domainResolver, AbstractTemplateLoader templateLoader,
            DataLoader dataLoader, TemplateLoader<MergeItem> assistantTemplateLoader,
            String workerId, Long editionSeq) throws IOException {
        super(appContext, domainItem.getItemId(), templateLoader, dataLoader,
                assistantTemplateLoader);
        this.domainResolver = domainResolver;
        this.domainItem = domainItem;
        this.workerId = workerId;
        this.editionSeq = editionSeq;
    }

    private void setBaseTag(String pagePath, MergeContext context, StringBuilder sb) {
        DomainItem domainItem = (DomainItem) context.get(MspConstants.MERGE_CONTEXT_DOMAIN);
        PageItem pageItem = (PageItem) context.get(MspConstants.MERGE_CONTEXT_PAGE);
        // html인 경우만 baseTag 처리
        if (pageItem.get(ItemConstants.PAGE_TYPE).equals("text/html") == false) {
            return;
        }
        String domainUrl = "http://" + domainItem.get(ItemConstants.DOMAIN_URL) + "/" + pagePath;
        int firstMetaIndex = sb.indexOf("<meta");
        if (firstMetaIndex < 0) {
            firstMetaIndex = sb.indexOf("<META");
        }
        if (firstMetaIndex >= 0) {
            String baseTag = "<base href=\"" + domainUrl + "\"/>\r\n";
            sb.insert(firstMetaIndex, baseTag);
            logger.debug("Base Tag is set: {}", baseTag);
        }
    }

    private StringBuilder setHtmlWrap(String itemType, String itemId, StringBuilder sb) {
        StringWriter writer = new StringWriter();
        MapContext context = new MapContext();
        context.set(MspConstants.HTML_WRAP_MERGE_ITEM_TYPE, itemType);
        context.set(MspConstants.HTML_WRAP_MERGE_ITEM_ID, itemId);
        context.set(MspConstants.HTML_WRAP_MERGE_CONTENT, sb);
        this.htmlWrap.evaluate(context, writer);
        return new StringBuilder(writer.toString());
    }

    public StringBuilder merge(PageItem pageItem, MergeItem wrapItem, boolean mergePage)
            throws TemplateMergeException, UnsupportedEncodingException, IOException,
            TemplateParseException {
    	return this.merge(pageItem, wrapItem, mergePage, true, false, true);	// 컴포넌트 미리보기 리소스 추가, 하이라이트 스크립트 제거, html wrap소스 추가
    }
            
    public StringBuilder merge(PageItem pageItem, MergeItem wrapItem, boolean mergePage, boolean resource, boolean highlight, boolean htmlWrap)
            throws TemplateMergeException, UnsupportedEncodingException, IOException,
            TemplateParseException {
        MergeContext mergeContext = new MergeContext();
        // TMS의 PagePathResolver, MergeHandler에서 설정하는 context 정보를 추가한다.
        mergeContext.getMergeOptions().setPreview(true);
        if (this.workerId != null) {
            mergeContext.set(MspConstants.MERGE_CONTEXT_WORKER_ID, this.workerId);
            mergeContext.set(MspConstants.MERGE_CONTEXT_EDITION_SEQ, this.editionSeq);
        }
        mergeContext.set(MspConstants.MERGE_CONTEXT_DOMAIN, this.domainItem);
        mergeContext.set(MspConstants.MERGE_CONTEXT_PAGE, pageItem);
        mergeContext.set(MspConstants.MERGE_PATH, pageItem.get(ItemConstants.PAGE_URL));

        // 예약어를 설정한다.
        ReservedMap reservedMap = domainResolver.getReservedMap(domainId);
        if (reservedMap != null) {
            mergeContext.set(MspConstants.MERGE_CONTEXT_RESERVED, reservedMap);
        }

        // Htttp 파라미터 설정
        mergeContext.set(MspConstants.MERGE_CONTEXT_PARAM, new HttpParamMap());
        String itemType = pageItem.getItemType();
        String itemId = pageItem.getItemId();

        // PageItem 설정
        this.setItem(itemType, itemId, pageItem);

        if (wrapItem != null) {
            if (mergePage) { // page를 머지하고, wrapItem을 highlight
                mergeContext.getMergeOptions().setWrapItem(true);
                mergeContext.getMergeOptions().setShowItem(wrapItem.getItemType());
                mergeContext.getMergeOptions().setShowItemId(wrapItem.getItemId());
                this.setItem(wrapItem.getItemType(), wrapItem.getItemId(), wrapItem);
            } else { // wrapItem을 머지
                itemType = wrapItem.getItemType();
                itemId = wrapItem.getItemId();
                this.setItem(itemType, itemId, wrapItem);
                if (wrapItem instanceof ComponentItem) { // 미리보기 리소스 추가
                    mergeContext.getMergeOptions().setPreviewResource(resource);
                }
            }
        } else {
            if (mergePage) {
                // page를 머지
            } else {
                // wrapItem이 null 이므로 불가능함
                throw new TemplateMergeException("MergeItem is null");
            }
        }

        StringBuilder sb = super.merge(itemType, itemId, mergeContext);

        // 시스템 기본 (tms.merge.highlight.only 프로퍼티)
        if(highlight) {
        	addShowItemStyle(sb, mergeContext);
        }
        
        // 강제로 설정
        // addShowItemStyle(sb, mergeContext, true);

        // 편집컴포넌트 미리보기일 경우 html 태그를 감싸준다.
        if (mergeContext.getMergeOptions().isPreview() && this.workerId != null && htmlWrap) {
            sb = setHtmlWrap(itemType, itemId, sb);
        }

        // base 태그 처리
        setBaseTag(itemType, mergeContext, sb);
        return sb;
    }

}
