package jmnet.moka.core.tps.mvc.template.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.template.entity.QTemplateHist;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;

public class TemplateHistRepositorySupportImpl extends QuerydslRepositorySupport
        implements TemplateHistRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public TemplateHistRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(TemplateHist.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<TemplateHist> findList(Long templateSeq, SearchDTO search, Pageable pageable) {
        QTemplateHist hist = QTemplateHist.templateHist;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getFirst("searchType");
        String keyword = search.getFirst("keyword");

        // WHERE 조건
        builder.and(hist.template.templateSeq.eq(templateSeq));
        if (McpString.isNotEmpty(searchType) && McpString.isNotEmpty(keyword)) {
            if (searchType.equals("createYmdt")) {
                builder.and(hist.createYmdt.startsWith(keyword));
            } else if (searchType.equals("creator")) {
                builder.and(hist.creator.contains(keyword));
            } else if (searchType.equals("all")) {
                builder.and(hist.creator.contains(keyword).or(hist.createYmdt.startsWith(keyword)));
            }
        }

        JPQLQuery<TemplateHist> query = queryFactory.selectFrom(hist);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<TemplateHist> list = query.where(builder).fetchResults();

        return new PageImpl<TemplateHist>(list.getResults(), pageable, list.getTotal());
    }

}
