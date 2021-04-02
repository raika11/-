/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.article.entity.QArticleBasic;
import jmnet.moka.core.tps.mvc.issue.dto.PackageListSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageList;
import jmnet.moka.core.tps.mvc.issue.entity.QPackageList;
import jmnet.moka.core.tps.mvc.issue.entity.QPackageMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-02
 */
public class PackageListRepositorySupportImpl extends TpsQueryDslRepositorySupport implements PackageListRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public PackageListRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(PackageList.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<PackageList> findAll(PackageListSearchDTO search) {
        QPackageMaster qPackageMaster = QPackageMaster.packageMaster;
        QPackageList qPackageList = QPackageList.packageList;
        QArticleBasic qArticleBasic = QArticleBasic.articleBasic;

        JPQLQuery<PackageList> query = from(qPackageList);
        if (search.getPkgSeq() != null) {
            query.where(qPackageList.packageMaster.pkgSeq.eq(search.getPkgSeq()));
        }

        query = getQuerydsl().applyPagination(search.getPageable(), query);

        QueryResults<PackageList> list = query
                .select(Projections.fields(PackageList.class, qPackageList.seqNo, qPackageList.catDiv, qPackageList.ordNo, qPackageList.totalId,
                        qPackageList.regDt, ExpressionUtils.as(JPAExpressions
                                .select(qArticleBasic.artTitle)
                                .from(qArticleBasic)
                                .where(qArticleBasic.totalId
                                        .eq(qPackageList.totalId)
                                        .and(qArticleBasic.serviceFlag.eq(MokaConstants.YES))), "title")))
                .innerJoin(qPackageList.packageMaster, qPackageMaster)
                .orderBy(qPackageList.ordNo.asc())
                .fetchResults();

        return new PageImpl<>(list.getResults(), search.getPageable(), list.getTotal());
    }
}
