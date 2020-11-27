/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.desking.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-27
 */
public class DeskingHistRepositorySupportImpl extends QuerydslRepositorySupport implements DeskingHistRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public DeskingHistRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(DeskingHist.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<DeskingHist> findAllDeskingHist(DeskingHistSearchDTO search) {
        //        QDeskingHist deskingHist = QDeskingHist.deskingHist;
        //        QComponentHist componentHist = QComponentHist.componentHist;
        //
        //        BooleanBuilder builder = new BooleanBuilder();
        //        builder.and(deskingHist.componentHist.eq(componentHist));
        //        builder.and(deskingHist.status.eq(search.getStatus()));
        //        builder.and(componentHist.seq.eq(search.getComponentSeq()));
        //
        //        JPQLQuery<DeskingHist> query = queryFactory.selectFrom(deskingHist);
        //        query = getQuerydsl().applyPagination(search.getPageable(), query);
        //        QueryResults<DeskingHist> list = query.innerJoin(componentHist)
        //                                              .fetchJoin()
        //                                              .where(builder)
        //                                              .groupBy(deskingHist.componentHistSeq, deskingHist.regDt, deskingHist.regId)
        //                                              .orderBy(deskingHist.componentHistSeq.desc())
        //                                              .fetchResults();
        //
        //        return new PageImpl<DeskingHist>(list.getResults(), search.getPageable(), list.getTotal());
        return null;
    }
}
