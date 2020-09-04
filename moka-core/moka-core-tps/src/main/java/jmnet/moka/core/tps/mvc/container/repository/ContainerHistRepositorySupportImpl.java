package jmnet.moka.core.tps.mvc.container.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.container.entity.QContainer;
import jmnet.moka.core.tps.mvc.container.entity.QContainerHist;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;

public class ContainerHistRepositorySupportImpl extends QuerydslRepositorySupport
        implements ContainerHistRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public ContainerHistRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(ContainerHist.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<ContainerHist> findList(HistSearchDTO search, Pageable pageable) {
        QContainerHist containerHist = QContainerHist.containerHist;
        QDomain domain = QDomain.domain;
        QContainer container = QContainer.container;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(containerHist.container.containerSeq.eq(search.getSeq()));
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("createYmdt")) {
                builder.and(containerHist.createYmdt.startsWith(keyword));
            } else if (searchType.equals("creator")) {
                builder.and(containerHist.creator.contains(keyword));
            } else if (searchType.equals("all")) {
                builder.and(containerHist.creator.contains(keyword)
                        .or(containerHist.createYmdt.startsWith(keyword)));
            }
        }

        JPQLQuery<ContainerHist> query = queryFactory.selectFrom(containerHist);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<ContainerHist> list = query.innerJoin(containerHist.container, container)
                .fetchJoin().innerJoin(containerHist.domain, domain).fetchJoin().where(builder)
                .fetchResults();

        return new PageImpl<ContainerHist>(list.getResults(), pageable, list.getTotal());
    }
}
