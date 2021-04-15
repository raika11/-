/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.issue.entity.IssueDesking;

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
public class IssueDeskingRepositorySupportImpl extends TpsQueryDslRepositorySupport implements IssueDeskingRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public IssueDeskingRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(IssueDesking.class);
        this.queryFactory = queryFactory;
    }

    //    @Override
    //    public List<IssueDesking> findAll(Long pkgSeq) {
    //        QIssueDesking qIssueDesking = QIssueDesking.issueDesking;
    //        QPackageMaster qPackageMaster = QPackageMaster.packageMaster;
    //
    //        JPQLQuery<IssueDesking> query = queryFactory.selectFrom(qIssueDesking);
    //        QueryResults<IssueDesking> list = query
    //                .innerJoin(qIssueDesking.packageMaster, qPackageMaster)
    //                .fetchJoin()
    //                .where(qIssueDesking.packageMaster.pkgSeq.eq(pkgSeq))
    //                .orderBy(qIssueDesking.compNo.asc(), qIssueDesking.contentsOrd.asc())
    //                .fetchResults();
    //
    //        return list.getResults();
    //    }
    //
    //    @Override
    //    public List<IssueDesking> findByComponent(Long pkgSeq, Integer compNo) {
    //        QIssueDesking qIssueDesking = QIssueDesking.issueDesking;
    //        QPackageMaster qPackageMaster = QPackageMaster.packageMaster;
    //
    //        // WHERE 조건
    //        BooleanBuilder builder = new BooleanBuilder();
    //        builder.and(qIssueDesking.packageMaster.pkgSeq.eq(pkgSeq));
    //        builder.and(qIssueDesking.compNo.eq(compNo));
    //
    //        JPQLQuery<IssueDesking> query = queryFactory.selectFrom(qIssueDesking);
    //        QueryResults<IssueDesking> list = query
    //                .innerJoin(qIssueDesking.packageMaster, qPackageMaster)
    //                .fetchJoin()
    //                .where(builder)
    //                .orderBy(qIssueDesking.contentsOrd.asc())
    //                .fetchResults();
    //
    //        return list.getResults();
    //    }
}
