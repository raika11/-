package jmnet.moka.core.tps.mvc.bulk.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticle;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticlePK;
import jmnet.moka.core.tps.mvc.bulk.entity.QBulkArticle;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.naverbulk.repository
 * ClassName : BulkRepositorySupportImpl
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public class BulkArticleRepositorySupportImpl extends QuerydslRepositorySupport implements BulkArticleRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public BulkArticleRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(BulkArticle.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<BulkArticle> findAllByBulkartSeq(BulkArticlePK bulkArticlePK) {
        QBulkArticle qArticleList = QBulkArticle.bulkArticle;
        JPQLQuery<BulkArticle> query = from(qArticleList);
        query.where(qArticleList.id.bulkartSeq.eq(bulkArticlePK.getBulkartSeq()));


        QueryResults<BulkArticle> list = query.fetchResults();

        return query
                .fetchResults()
                .getResults();
    }
}
