package jmnet.moka.core.tps.mvc.article.repository;

import com.querydsl.core.BooleanBuilder;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.article.entity.ArticleClickcnt;
import jmnet.moka.core.tps.mvc.article.entity.QArticleClickcnt;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.article.repository
 * ClassName : ArticleClickcntRepositorySupportImpl
 * Created : 2021-01-12 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-12 08:59
 */
public class ArticleClickcntRepositorySupportImpl extends TpsQueryDslRepositorySupport implements ArticleClickcntRepositorySupport {
    public ArticleClickcntRepositorySupportImpl() {
        super(ArticleClickcnt.class);
    }


    @Override
    public long updateReplyCnt(Long totalId, int cnt) {
        QArticleClickcnt qArticleClickcnt = QArticleClickcnt.articleClickcnt;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qArticleClickcnt.totalId.eq(totalId));
        return update(qArticleClickcnt)
                .set(qArticleClickcnt.replyCnt, qArticleClickcnt.replyCnt.add(cnt))
                .where(builder)
                .execute();
    }
}
