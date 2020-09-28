package jmnet.moka.core.tps.mvc.page.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.core.tps.mvc.page.entity.QPage;
import jmnet.moka.core.tps.mvc.page.entity.QPageHist;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.page.entity.PageHist;

/**
 * <pre>
 * 페이지히스토리 Repository Support Impl
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 3:53:46
 * @author jeon
 */
public class PageHistRepositorySupportImpl extends QuerydslRepositorySupport
        implements PageHistRepositorySupport {
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
        // TODO MIRA
//        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
//            if (searchType.equals("createYmdt")) {
//                builder.and(pageHist.createYmdt.startsWith(keyword));
//            } else if (searchType.equals("creator")) {
//                builder.and(pageHist.creator.contains(keyword));
//            } else if (searchType.equals("all")) {
//                builder.and(pageHist.creator.contains(keyword)
//                        .or(pageHist.createYmdt.startsWith(keyword)));
//            }
//        }

        JPQLQuery<PageHist> query = queryFactory.selectFrom(pageHist);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<PageHist> list = query.innerJoin(pageHist.page, page).fetchJoin()
                .innerJoin(pageHist.domain, domain).fetchJoin().where(builder).fetchResults();

        return new PageImpl<PageHist>(list.getResults(), pageable, list.getTotal());
    }
}
