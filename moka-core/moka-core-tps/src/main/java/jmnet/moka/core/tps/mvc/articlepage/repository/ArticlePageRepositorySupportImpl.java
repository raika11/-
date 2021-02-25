/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.articlepage.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageSearchDTO;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import jmnet.moka.core.tps.mvc.articlepage.entity.QArticlePage;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * Description: 기사페이지 RepositorySupportImpl
 *
 * @author ohtah
 * @since 2020. 11. 14.
 */
public class ArticlePageRepositorySupportImpl extends TpsQueryDslRepositorySupport implements ArticlePageRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ArticlePageRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(ArticlePage.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<ArticlePage> findList(ArticlePageSearchDTO search, Pageable pageable) {
        QArticlePage articlePage = QArticlePage.articlePage;
        QDomain domain = QDomain.domain;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(articlePage.domain.domainId.eq(search.getDomainId()));

        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("artPageSeq")) {
                builder.and(articlePage.artPageSeq.eq(Long.parseLong(keyword)));
            } else if (searchType.equals("artPageName")) {
                builder.and(articlePage.artPageName.contains(keyword));
            } else if (searchType.equals("artPageBody")) {
                builder.and(articlePage.artPageBody.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                builder.and(articlePage.artPageSeq
                        .like('%' + keyword + '%')
                        .or(articlePage.artPageName.contains(keyword))
                        .or(articlePage.artPageBody.contains(keyword)));
            }
        }

        JPQLQuery<ArticlePage> query = queryFactory.selectFrom(articlePage);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<ArticlePage> list = query
                .innerJoin(articlePage.domain, domain)
                .fetchJoin()
                .where(builder)
                .fetchResults();

        return new PageImpl<ArticlePage>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    public Long countByArtType(String domainId, String artType, Long exclude_artPageSeq) {
        QArticlePage articlePage = QArticlePage.articlePage;
        QDomain domain = QDomain.domain;

        BooleanBuilder builder = new BooleanBuilder();

        // WHERE 조건
        builder.and(articlePage.domain.domainId.eq(domainId));
        builder.and(articlePage.artType.eq(artType));

        if (exclude_artPageSeq != null && exclude_artPageSeq > 0) {
            builder.and(articlePage.artPageSeq.ne(exclude_artPageSeq));
        }

        JPQLQuery<ArticlePage> query = queryFactory.selectFrom(articlePage);
        return query
                .innerJoin(articlePage.domain, domain)
                .where(builder)
                .fetchCount();
    }
}
