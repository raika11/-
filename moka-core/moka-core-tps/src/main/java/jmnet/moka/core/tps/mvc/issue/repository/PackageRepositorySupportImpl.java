package jmnet.moka.core.tps.mvc.issue.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.entity.QPackageKeyword;
import jmnet.moka.core.tps.mvc.issue.entity.QPackageList;
import jmnet.moka.core.tps.mvc.issue.entity.QPackageMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.repository
 * ClassName : PackageRepositorySupportImpl
 * Created : 2021-03-19
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오후 4:23
 */
public class PackageRepositorySupportImpl extends TpsQueryDslRepositorySupport implements PackageRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public PackageRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(PackageMaster.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<PackageMaster> findAllPackage(PackageSearchDTO search) {
        QPackageMaster qPackage = QPackageMaster.packageMaster;
        QPackageList qPackageList = QPackageList.packageList;
        QPackageKeyword qPackageKeyword = QPackageKeyword.packageKeyword;

        JPQLQuery<PackageMaster> query = queryFactory.selectFrom(qPackage);

        query = getQuerydsl().applyPagination(search.getPageable(), query);

        // where

        // join
        query
                .distinct()
                .leftJoin(qPackage.packageKeywords, qPackageKeyword)
                .fetchJoin()
                .leftJoin(qPackage.packageLists, qPackageList)
                .fetchJoin();

        QueryResults<PackageMaster> list = query.fetchResults();
        return new PageImpl<>(list.getResults(), search.getPageable(), list.getTotal());
    }
}
