package jmnet.moka.core.tms.template.parse.model;

import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.ArticlePageItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <pre>
 * 파싱된 템플릿 정보의 최상위 노드, DOM의 Root와 동일 개념, 기사본문뷰를 위한 페이지
 * 2020. 9. 4. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 4. 오후 6:20:25
 */
public class ApTemplateRoot extends MokaTemplateRoot {
    private static final Logger logger = LoggerFactory.getLogger(ApTemplateRoot.class);

    public ApTemplateRoot(ArticlePageItem item)
            throws TemplateParseException {
        super(item, ItemConstants.ARTICLE_PAGE_BODY);
    }

    @Override
    public void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
        this.templateRoot.merge(merger, context, sb);
    }
}
