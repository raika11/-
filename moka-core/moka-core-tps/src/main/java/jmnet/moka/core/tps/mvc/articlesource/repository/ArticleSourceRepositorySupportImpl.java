/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.ArticleSourceUseTypeCode;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.articlesource.entity.QArticleSource;
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

        JPQLQuery<ArticleSource> query = queryFactory
                .selectFrom(articleSource)
                .where(builder);
        QueryResults<ArticleSource> list = query.fetchResults();
        return query
                .fetchResults()
                .getResults();
    }

    @Override
    public List<ArticleSource> findAllUsedSource(ArticleSourceUseTypeCode useTypeCode) {
        QArticleSource articleSource = QArticleSource.articleSource;

        JPQLQuery<ArticleSource> query = from(articleSource);
        switch (useTypeCode) {
            case BULK:
                query.where(articleSource.bulkFlag.eq(MokaConstants.YES));
                break;
            case CONSALES:
                query.where(articleSource.consalesUse.eq(MokaConstants.YES));
                break;
            case JOONGANG:
                query.where(articleSource.joongangUse.eq(MokaConstants.YES));
                break;
            case JSTORE:
                query.where(articleSource.jstoreUse.eq(MokaConstants.YES));
                break;
            case RCV:
                query.where(articleSource.rcvUsedYn.eq(MokaConstants.YES));
                break;
            case SOCIAL:
                query.where(articleSource.socialUse.eq(MokaConstants.YES));
                break;
            default:
        }

        QueryResults<ArticleSource> list = query.fetchResults();
        return query
                .fetchResults()
                .getResults();
    }
}