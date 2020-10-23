package jmnet.moka.core.tps.mvc.container.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;
import jmnet.moka.core.tps.mvc.container.entity.QContainer;
import jmnet.moka.core.tps.mvc.container.entity.QContainerHist;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

public class ContainerHistRepositorySupportImpl extends QuerydslRepositorySupport implements ContainerHistRepositorySupport {

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
            if (searchType.equals("regDt")) {
                try {
                    List<Date> keywordDtList = McpDate.betweenDate(MokaConstants.JSON_DATE_FORMAT, keyword);
                    builder.and(containerHist.regDt.between(Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(0)),
                                                            Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(1))));
                } catch (ParseException e) {
                }
            } else if (searchType.equals("regId")) {
                builder.and(containerHist.regId.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                List<Date> keywordDtList = null;
                try {
                    keywordDtList = McpDate.betweenDate(MokaConstants.JSON_DATE_FORMAT, keyword);
                } catch (ParseException e) {
                }
                builder.and(containerHist.regId.contains(keyword)
                                               .or(containerHist.regDt.between(Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(0)),
                                                                               Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(1)))));
            }
        }

        JPQLQuery<ContainerHist> query = queryFactory.selectFrom(containerHist);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<ContainerHist> list = query.innerJoin(containerHist.container, container)
                                                .fetchJoin()
                                                .innerJoin(containerHist.domain, domain)
                                                .fetchJoin()
                                                .where(builder)
                                                .fetchResults();

        return new PageImpl<ContainerHist>(list.getResults(), pageable, list.getTotal());
    }
}
