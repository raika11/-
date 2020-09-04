/**
 * msp-tps ReservedRepositorySupportImpl.java 2020. 6. 17. 오전 11:32:58 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.core.tps.mvc.reserved.entity.QReserved;
import jmnet.moka.core.tps.mvc.reserved.dto.ReservedSearchDTO;
import jmnet.moka.core.tps.mvc.reserved.entity.Reserved;

/**
 * <pre>
 * 
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 17. 오전 11:32:58
 * @author ssc
 */
public class ReservedRepositorySupportImpl extends QuerydslRepositorySupport
        implements ReservedRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ReservedRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Reserved.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Reserved> findList(ReservedSearchDTO search, Pageable pageable) {
        QReserved reserved = QReserved.reserved;
        QDomain domain = QDomain.domain;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(reserved.domain.domainId.eq(search.getDomainId()));
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("reservedId")) {
                builder.and(reserved.reservedId.contains(keyword));
            } else if (searchType.equals("reservedValue")) {
                builder.and(reserved.reservedValue.contains(keyword));
            } else if (searchType.equals("all")) {
                builder.and(reserved.reservedId.contains(keyword)
                        .or(reserved.reservedValue.contains(keyword)));
            }
        }

        JPQLQuery<Reserved> query = queryFactory.selectFrom(reserved);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Reserved> list =
                query.innerJoin(reserved.domain, domain).fetchJoin().where(builder).fetchResults();

        return new PageImpl<Reserved>(list.getResults(), pageable, list.getTotal());
    }
}
