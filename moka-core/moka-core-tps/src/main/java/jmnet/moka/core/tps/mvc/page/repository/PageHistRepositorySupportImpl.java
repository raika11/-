package jmnet.moka.core.tps.mvc.page.repository;

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
import jmnet.moka.core.tps.mvc.history.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.core.tps.mvc.page.entity.PageHist;
import jmnet.moka.core.tps.mvc.page.entity.QPage;
import jmnet.moka.core.tps.mvc.page.entity.QPageHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 * 페이지히스토리 Repository Support Impl
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 3:53:46
 */
public class PageHistRepositorySupportImpl extends QuerydslRepositorySupport implements PageHistRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public PageHistRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(PageHist.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<PageHist> findList(HistSearchDTO search, Pageable pageable) {
        QPageHist pageHist = QPageHist.pageHist;
        QDomain domain = QDomain.domain;
        QPage page = QPage.page;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(pageHist.page.pageSeq.eq(search.getSeq()));

        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("regDt")) {
                try {
                    List<Date> keywordDtList = McpDate.betweenDate(MokaConstants.JSON_DATE_FORMAT, keyword);
                    builder.and(pageHist.regDt.between(Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(0)),
                                                       Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(1))));
                } catch (ParseException e) {
                }
            } else if (searchType.equals("regId")) {
                builder.and(pageHist.regId.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                List<Date> keywordDtList = null;
                try {
                    keywordDtList = McpDate.betweenDate(MokaConstants.JSON_DATE_FORMAT, keyword);
                } catch (ParseException e) {
                }
                builder.and(pageHist.regId.contains(keyword)
                                          .or(pageHist.regDt.between(Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(0)),
                                                                     Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(1)))));
            }
        }

        JPQLQuery<PageHist> query = queryFactory.selectFrom(pageHist);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<PageHist> list = query.innerJoin(pageHist.page, page)
                                           .fetchJoin()
                                           .innerJoin(pageHist.domain, domain)
                                           .fetchJoin()
                                           .where(builder)
                                           .fetchResults();

        return new PageImpl<PageHist>(list.getResults(), pageable, list.getTotal());
    }
}
