/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.desking.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.component.entity.QComponentHist;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;
import jmnet.moka.core.tps.mvc.desking.entity.QDeskingHist;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-27
 */
public class DeskingHistRepositorySupportImpl extends TpsQueryDslRepositorySupport implements DeskingHistRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public DeskingHistRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(DeskingHist.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<DeskingHist> findAllDeskingHist(Long componentHistSeq) {
        QDeskingHist deskingHist = QDeskingHist.deskingHist;
        QComponentHist componentHist = QComponentHist.componentHist;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(componentHist.seq.eq(componentHistSeq));

        JPQLQuery<DeskingHist> query = queryFactory
                .selectFrom(deskingHist)
                .innerJoin(deskingHist.componentHist, componentHist)
                .fetchJoin()
                .where(builder)
                .orderBy(deskingHist.contentOrd.asc(), deskingHist.relOrd.asc());

        return query.fetch();
    }

    //    @Override
    //    public boolean existsReserveDatasetSeq(Long datasetSeq) {
    //        QDeskingHist deskingHist = QDeskingHist.deskingHist;
    //
    //        BooleanBuilder builder = new BooleanBuilder();
    //        builder.and(deskingHist.datasetSeq.eq(datasetSeq));
    //        builder.and(deskingHist.approvalYn.eq(MokaConstants.NO));
    //        builder.and(deskingHist.status.eq(EditStatusCode.PUBLISH));
    //        builder.and(deskingHist.reserveDt.gt(new Date()));
    //
    //        return queryFactory
    //                .selectFrom(deskingHist)
    //                .fetchJoin()
    //                .where(builder)
    //                .fetchCount() > 0;
    //    }

}
