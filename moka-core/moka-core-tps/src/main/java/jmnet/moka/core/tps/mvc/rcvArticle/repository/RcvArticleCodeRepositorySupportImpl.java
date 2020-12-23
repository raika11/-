/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.stream.Collectors;
import jmnet.moka.core.tps.mvc.articlesource.entity.QRcvCodeConv;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.QRcvArticleCode;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleCode;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * Description: 수신기사 분류코드 Repo Support Impl
 *
 * @author ssc
 * @since 2020-12-23
 */
public class RcvArticleCodeRepositorySupportImpl extends QuerydslRepositorySupport implements RcvArticleCodeRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public RcvArticleCodeRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(RcvArticleCode.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<String> findByRid(Long rid, String sourceCode) {
        QRcvCodeConv rcvCodeConv = QRcvCodeConv.rcvCodeConv;
        QRcvArticleCode rcvArticleCode = QRcvArticleCode.rcvArticleCode;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(rcvArticleCode.id.rid.eq(rid));

        BooleanBuilder onBuilder = new BooleanBuilder();
        onBuilder.and(rcvCodeConv.frCode.eq(rcvArticleCode.id.codeId));
        onBuilder.and(rcvCodeConv.articleSource.sourceCode.eq(sourceCode));

        List<String> returnList = queryFactory
                .select(rcvCodeConv.toCode)
                .from(rcvCodeConv)
                .innerJoin(rcvArticleCode)
                .on(onBuilder)
                .fetchJoin()
                .where(builder)
                .orderBy(rcvArticleCode.codeOrd.asc())
                .fetch()
                .stream()
                .collect(Collectors.toList());

        return returnList;
    }
}
