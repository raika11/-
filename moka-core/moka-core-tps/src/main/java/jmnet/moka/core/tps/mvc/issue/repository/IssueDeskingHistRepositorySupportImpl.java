/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.issue.entity.IssueDeskingHist;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.entity.QIssueDeskingHist;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.issue.repository
 * ClassName : IssueDeskingRepositorySupportImpl
 * Created : 2021-03-19
 * </pre>
 *
 * @author ssc
 * @since 2021-03-19 오후 4:23
 */
public class IssueDeskingHistRepositorySupportImpl extends TpsQueryDslRepositorySupport implements IssueDeskingHistRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public IssueDeskingHistRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(IssueDeskingHist.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public void deleteReserveHist(PackageMaster packageMaster, Integer compNo) {
        QIssueDeskingHist qIssueDeskingHist = QIssueDeskingHist.issueDeskingHist;
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(qIssueDeskingHist.packageMaster.eq(packageMaster));
        builder.and(qIssueDeskingHist.compNo.eq(compNo));
        builder.and(qIssueDeskingHist.status.eq(EditStatusCode.PUBLISH));
        builder.and(qIssueDeskingHist.approvalYn.eq(MokaConstants.NO));
        builder.and(qIssueDeskingHist.reserveDt.gt(McpDate.todayDate()));

        queryFactory
                .delete(qIssueDeskingHist)
                .where(builder)
                .execute();
    }

    @Override
    public void excuteReserveDeskingHist(PackageMaster packageMaster, Integer compNo) {
        QIssueDeskingHist qIssueDeskingHist = QIssueDeskingHist.issueDeskingHist;
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(qIssueDeskingHist.packageMaster.eq(packageMaster));
        builder.and(qIssueDeskingHist.compNo.eq(compNo));
        builder.and(qIssueDeskingHist.status.eq(EditStatusCode.PUBLISH));
        builder.and(qIssueDeskingHist.approvalYn.eq(MokaConstants.NO));
        //builder.and(qIssueDeskingHist.reserveDt.gt(McpDate.todayDate()));

        queryFactory
                .update(qIssueDeskingHist)
                .where(builder)
                .set(qIssueDeskingHist.approvalYn, MokaConstants.YES)
                .set(qIssueDeskingHist.regDt, McpDate.todayDate())
                .execute();
    }
}
