package jmnet.moka.core.tps.mvc.naverbulk.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkSearchDTO;
import jmnet.moka.core.tps.mvc.naverbulk.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.naverbulk.repository
 * ClassName : NaverBulkRepositorySupportImpl
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public class NaverBulkListRepositorySupportImpl extends QuerydslRepositorySupport implements NaverBulkListRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public NaverBulkListRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(ArticleList.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<ArticleList> findAllByClickartSeq(ArticlePK articlePK) {
        QArticleList qArticleList = QArticleList.articleList;
        JPQLQuery<ArticleList> query = from(qArticleList);
        query.where(qArticleList.id.clickartSeq.eq(articlePK.getClickartSeq()));


        QueryResults<ArticleList> list = query.fetchResults();

        return query.fetchResults().getResults();
    }
}
