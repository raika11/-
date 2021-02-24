/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.rcvarticle.entity.RcvArticleCode;

/**
 * Description: 수신기사 분류코드 Repo Support Impl
 *
 * @author ssc
 * @since 2020-12-23
 */
public class RcvArticleCodeRepositorySupportImpl extends TpsQueryDslRepositorySupport implements RcvArticleCodeRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public RcvArticleCodeRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(RcvArticleCode.class);
        this.queryFactory = queryFactory;
    }

    //    @Override
    //    public List<String> findByRid(Long rid, String sourceCode) {
    //        QRcvCodeConv rcvCodeConv = QRcvCodeConv.rcvCodeConv;
    //        QRcvArticleCode rcvArticleCode = QRcvArticleCode.rcvArticleCode;
    //
    //        BooleanBuilder builder = new BooleanBuilder();
    //        builder.and(rcvArticleCode.id.rid.eq(rid));
    //
    //        BooleanBuilder onBuilder = new BooleanBuilder();
    //        onBuilder.and(rcvCodeConv.frCode.eq(rcvArticleCode.id.codeId));
    //        onBuilder.and(rcvCodeConv.articleSource.sourceCode.eq(sourceCode));
    //
    //        List<String> returnList = queryFactory
    //                .select(rcvCodeConv.toCode)
    //                .from(rcvCodeConv)
    //                .innerJoin(rcvArticleCode)
    //                .on(onBuilder)
    //                .fetchJoin()
    //                .where(builder)
    //                .orderBy(rcvArticleCode.codeOrd.asc())
    //                .fetch()
    //                .stream()
    //                .collect(Collectors.toList());
    //
    //        return returnList;
    //    }
}
