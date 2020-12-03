/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.article.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.article.entity.QArticleSource;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-13
 */
public class ArticleSourceRepositorySupportImpl extends QuerydslRepositorySupport implements ArticleSourceRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ArticleSourceRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(ArticleSource.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<ArticleSource> findAllSourceByDesking(String[] deskingSourceList) {
        QArticleSource articleSource = QArticleSource.articleSource;

        BooleanBuilder builder = new BooleanBuilder();

        if (deskingSourceList.length > 0) {
            for (String source : deskingSourceList) {
                builder.or(articleSource.sourceCode.eq(source));
            }
        }
        builder.and(articleSource.joongangUse.eq(MokaConstants.YES));
        //        builder.or(articleSource.sourceCode.in(deskingSourceList));

        JPQLQuery<ArticleSource> query = queryFactory.selectFrom(articleSource)
                                                     .where(builder);
        QueryResults<ArticleSource> list = query.fetchResults();
        return query.fetchResults()
                    .getResults();
    }
}
