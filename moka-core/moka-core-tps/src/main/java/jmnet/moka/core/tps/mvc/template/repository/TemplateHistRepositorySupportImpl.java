package jmnet.moka.core.tps.mvc.template.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.template.entity.QTemplateHist;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

public class TemplateHistRepositorySupportImpl extends QuerydslRepositorySupport implements TemplateHistRepositorySupport {
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
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("regDt")) {
                try {
                    List<Date> keywordDtList = McpDate.betweenDate(MokaConstants.JSON_DATE_FORMAT, keyword);
                    builder.and(hist.regDt.between(Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(0)),
                                                   Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(1))));
                } catch (ParseException e) {
                }
            } else if (searchType.equals("regId")) {
                builder.and(hist.regId.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                List<Date> keywordDtList = null;
                try {
                    keywordDtList = McpDate.betweenDate(MokaConstants.JSON_DATE_FORMAT, keyword);
                } catch (ParseException e) {
                }
                builder.and(hist.regId.contains(keyword)
                                      .or(hist.regDt.between(Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(0)),
                                                             Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(1)))));
            }
        }
        //        if (McpString.isNotEmpty(searchType) && McpString.isNotEmpty(keyword)) {
        //            if (searchType.equals("regDt")) {
        //                builder.and(hist.createYmdt.startsWith(keyword));
        //            } else if (searchType.equals("regId")) {
        //                builder.and(hist.creator.contains(keyword));
        //            } else if (searchType.equals("all")) {
        //                builder.and(hist.creator.contains(keyword).or(hist.createYmdt.startsWith(keyword)));
        //            }
        //        }

        JPQLQuery<TemplateHist> query = queryFactory.selectFrom(hist);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<TemplateHist> list = query.where(builder)
                                               .fetchResults();

        return new PageImpl<TemplateHist>(list.getResults(), pageable, list.getTotal());
    }

}
