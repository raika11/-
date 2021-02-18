/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleJiSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.QRcvArticleJiXml;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleJiXml;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-02-18
 */
public class RcvArticleJiXmlRepositorySupportImpl extends TpsQueryDslRepositorySupport implements RcvArticleJiXmlRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public RcvArticleJiXmlRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(RcvArticleJiXml.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<RcvArticleJiXml> findList(RcvArticleJiSearchDTO search) {
        QRcvArticleJiXml rcvArticleJiXml = QRcvArticleJiXml.rcvArticleJiXml;

        BooleanBuilder builder = new BooleanBuilder();

        if (McpString.isNotEmpty(search.getSourceCode()) && !TpsConstants.SEARCH_TYPE_ALL.equals(search.getSourceCode())) {
            builder.and(rcvArticleJiXml.id.sourceCode.eq(search.getSection()));
        }

        if (McpString.isNotEmpty(search.getSection()) && !TpsConstants.SEARCH_TYPE_ALL.equals(search.getSection())) {
            builder.and(rcvArticleJiXml.id.section.eq(search.getSection()));
        }

        if (search.getPressDate() != null) {
            String pressDate = McpDate.dateStr(search.getPressDate(), "yyyy-MM-dd");
            builder.and(rcvArticleJiXml.pressDate.eq(pressDate));
        }

        if (search.getHo() != null) {
            builder.and(rcvArticleJiXml.id.ho.eq(search.getHo()));
        }

        if (McpString.isNotEmpty(search.getMyun()) && !TpsConstants.SEARCH_TYPE_ALL.equals(search.getMyun())) {
            builder.and(rcvArticleJiXml.id.myun.eq(search.getMyun()));
        }

        if (McpString.isNotEmpty(search.getRevision()) && !TpsConstants.SEARCH_TYPE_ALL.equals(search.getRevision())) {
            builder.and(rcvArticleJiXml.id.revision.eq(search.getRevision()));
        }

        JPQLQuery<RcvArticleJiXml> query = queryFactory.selectFrom(rcvArticleJiXml);
        query = getQuerydsl().applyPagination(search.getPageable(), query);
        QueryResults<RcvArticleJiXml> list = query
                .where(builder)
                .orderBy(rcvArticleJiXml.pressDate.desc(), rcvArticleJiXml.id.section.asc(), rcvArticleJiXml.id.myun.asc(),
                        rcvArticleJiXml.id.pan.desc(), rcvArticleJiXml.id.revision.asc())
                .fetchResults();

        return new PageImpl<RcvArticleJiXml>(list.getResults(), search.getPageable(), list.getTotal());
    }
}
