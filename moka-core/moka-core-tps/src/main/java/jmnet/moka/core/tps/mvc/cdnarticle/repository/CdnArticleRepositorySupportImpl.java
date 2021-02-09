/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.cdnarticle.dto.CdnArticleSearchDTO;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.QCdnArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * Description: CDN기사 repository support impl
 *
 * @author ssc
 * @since 2021-01-19
 */
public class CdnArticleRepositorySupportImpl extends TpsQueryDslRepositorySupport implements CdnArticleRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public CdnArticleRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(CdnArticle.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<CdnArticle> findList(CdnArticleSearchDTO search, Pageable pageable) {
        QCdnArticle article = QCdnArticle.cdnArticle;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("totalId")) {
                builder.and(article.totalId.eq(Long.parseLong(keyword)));
            } else if (searchType.equals("title")) {
                builder.and(article.title.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                builder.and(article.totalId
                        .like('%' + keyword + '%')
                        .or(article.title.contains(keyword)));
            }
        }

        JPQLQuery<CdnArticle> query = queryFactory.selectFrom(article);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<CdnArticle> list = query
                .where(builder)
                .fetchResults();

        return new PageImpl<CdnArticle>(list.getResults(), pageable, list.getTotal());
    }
}
