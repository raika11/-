package jmnet.moka.core.tms.template.parse.model;

import jmnet.moka.core.common.MokaConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.TemplateParser;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.common.template.parse.model.TemplateToken;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;

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
public abstract class MokaTemplateRoot extends TemplateRoot {
    private static final Logger logger = LoggerFactory.getLogger(MokaTemplateRoot.class);
    protected MergeItem item;
    protected boolean hasBodyToken = true;
    protected boolean hasParamToken = true;
    protected boolean hasSectionMenuToken = true;
    protected boolean hasPageToken = true;
    protected boolean hasPagingElement = true;


    public MokaTemplateRoot(MergeItem item, String templateColumn)
            throws TemplateParseException {
        //  templateRoot가 null이며, lineNumber도 0이다.
        super(item.getItemType(), item.getItemId());
        this.item = item;
        if (templateColumn != null) { // 템플릿 내용이 없는 아이템은 제외
            this.templateRoot =
                    TemplateParser.parse(item.getItemType(), super.getId(),
                            item.getString(templateColumn));
        }
        logger.trace("{} is created: {}", this.getClass().getSimpleName(), item.getItemId());
    }

    @Override
    public abstract void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb);

    private boolean hasToken(String prefix) {
        for (TemplateNode node : this.templateRoot.childNodes()) {
            if (node.getNodeType() == Constants.TYPE_TOKEN) {
                TemplateToken token = (TemplateToken) node;
                if (token.getText().startsWith(prefix + ".")) {
                    return true;
                }
            }
        }
        return false;
    }

    public void setHasPagingElement() {
        for (TemplateNode node : this.templateRoot.childNodes()) {
            if (node.getNodeName().equals(Constants.EL_PAGING)) {
                this.hasPagingElement = true;
                return;
            }
        }
        this.hasPagingElement = false;
    }

    public boolean hasPagingElement() {
        return this.hasPagingElement;
    }

    public MergeItem getItem() {
        return this.item;
    }

    public void setHasBodyToken() {
        this.hasBodyToken = hasToken(MokaConstants.MERGE_CONTEXT_BODY);
    }

    public void setHasParamToken() {
        this.hasParamToken = hasToken(MokaConstants.MERGE_CONTEXT_PARAM);
    }

    public void setHasPageToken() {
        this.hasPageToken = hasToken(MokaConstants.MERGE_CONTEXT_PAGE);
    }

    public void setHashSectionMenuToken() { this.hasSectionMenuToken = hasToken(MokaConstants.MERGE_CONTEXT_SECTION_MENU);}

    public boolean hasBodyToken() {
        return this.hasBodyToken;
    }

    public boolean hasParamToken() {
        return this.hasParamToken;
    }

    public boolean hasSectionMenuToken() {
        return this.hasSectionMenuToken;
    }

    public boolean hasPageToken() {
        return this.hasPageToken;
    }

    public String getCidForCache(MergeContext context) {
        if (hasBodyToken()) {
            return (String) context.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);
        } else {
            return null;
        }
    }

    public HttpParamMap getParamForCache(MergeContext context, boolean isComponent) {
        if (isComponent) {
            return (HttpParamMap) context.get(MokaConstants.MERGE_CONTEXT_PARAM);
        } else {
            if (hasParamToken() || hasPagingElement() || hasSectionMenuToken()) {
                return (HttpParamMap) context.get(MokaConstants.MERGE_CONTEXT_PARAM);
            } else {
                return KeyResolver.EMPTY_MAP;
            }
        }
    }

    public String getPageIdForCache(MergeContext context) {
        if (hasPageToken()) {
            PageItem pageItem = (PageItem) context.get(MokaConstants.MERGE_CONTEXT_PAGE);
            if (pageItem != null) {
                return pageItem.getItemId();
            }
            return null;
        } else {
            return null;
        }
    }

}
