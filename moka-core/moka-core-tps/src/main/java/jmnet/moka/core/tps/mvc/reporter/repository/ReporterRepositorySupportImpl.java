/**
 * msp-tps ReservedRepositorySupportImpl.java 2020. 6. 17. 오전 11:32:58 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.codemgt.entity.QCodeMgt;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.QReporter;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 17. 오전 11:32:58
 */
public class ReporterRepositorySupportImpl extends QuerydslRepositorySupport implements ReporterRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ReporterRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Reporter.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Reporter> findList(ReporterSearchDTO search, Pageable pageable) {
        QReporter reporter = QReporter.reporter;
        QCodeMgt codeMgt = QCodeMgt.codeMgt;

        BooleanBuilder builder = new BooleanBuilder();
        String keyword = search.getKeyword();

        // WHERE 조건
        if (!McpString.isEmpty(keyword)) {
            builder.and(reporter.repName.contains(keyword));
                    //.or(codeMgt.reservedValue.contains(keyword)));
                    //.or(codeMgt.reservedValue.contains(keyword)));
        }

        JPQLQuery<Reporter> query = queryFactory.selectFrom(reporter);
        query = getQuerydsl().applyPagination(pageable, query);
        //QueryResults<Reporter> list = query.innerJoin(reporter., domain).fetchJoin().where(builder).fetchResults();
        QueryResults<Reporter> list = query.where(builder).fetchResults();

        return new PageImpl<Reporter>(list.getResults(), pageable, list.getTotal());
    }
}
