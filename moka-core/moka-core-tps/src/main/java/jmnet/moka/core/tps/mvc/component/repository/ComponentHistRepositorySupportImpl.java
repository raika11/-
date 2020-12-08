/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.component.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.component.entity.QComponentHist;
import jmnet.moka.core.tps.mvc.dataset.entity.QDataset;
import jmnet.moka.core.tps.mvc.editform.entity.QEditFormPart;
import jmnet.moka.core.tps.mvc.template.entity.QTemplate;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-19
 */
public class ComponentHistRepositorySupportImpl extends QuerydslRepositorySupport implements ComponentHistRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ComponentHistRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(ComponentHist.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<ComponentHist> findLastHist(Long componentSeq, String dataType) {
        QComponentHist componentHist = QComponentHist.componentHist;
        QTemplate template = QTemplate.template;
        QDataset dataset = QDataset.dataset;
        QEditFormPart editFormPart = QEditFormPart.editFormPart;

        BooleanBuilder builder = new BooleanBuilder();

        builder.and(componentHist.componentSeq.eq(componentSeq));
        builder.and(componentHist.dataType.eq(dataType));
        builder.and(componentHist.approvalYn.eq(MokaConstants.YES));
        builder.and(componentHist.status.eq(EditStatusCode.PUBLISH));

        JPQLQuery<ComponentHist> query = queryFactory
                .selectFrom(componentHist)
                .leftJoin(componentHist.template, template)
                .fetchJoin()
                .leftJoin(componentHist.dataset, dataset)
                .fetchJoin()
                .leftJoin(componentHist.editFormPart, editFormPart)
                .fetchJoin()
                .where(builder)
                .limit(1)
                .orderBy(componentHist.seq.desc());

        return query.fetch();
    }

    //    @Override
    //    public boolean existsReserveComponentSeq(Long componentSeq) {
    //        QComponentHist componentHist = QComponentHist.componentHist;
    //        QTemplate template = QTemplate.template;
    //        QDataset dataset = QDataset.dataset;
    //        QEditFormPart editFormPart = QEditFormPart.editFormPart;
    //
    //        BooleanBuilder builder = new BooleanBuilder();
    //
    //        builder.and(componentHist.componentSeq.eq(componentSeq));
    //        builder.and(componentHist.approvalYn.eq(MokaConstants.NO));
    //        builder.and(componentHist.status.eq(EditStatusCode.PUBLISH));
    //        builder.and(componentHist.reserveDt.gt(new Date()));
    //
    //        return queryFactory
    //                .selectFrom(componentHist)
    //                .leftJoin(componentHist.template, template)
    //                .fetchJoin()
    //                .leftJoin(componentHist.dataset, dataset)
    //                .fetchJoin()
    //                .leftJoin(componentHist.editFormPart, editFormPart)
    //                .fetchJoin()
    //                .where(builder)
    //                .fetchCount() > 0;
    //    }
}
