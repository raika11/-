package jmnet.moka.core.tps.mvc.page.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.core.tps.mvc.page.dto.PageSearchDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.entity.QPage;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 * 페이지 Repository Support Impl
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 4:15:10
 */
public class PageRepositorySupportImpl extends QuerydslRepositorySupport implements PageRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public PageRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Page.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Page> findByDomainId(String domainId) {
        QPage page = QPage.page;
        QDomain domain = QDomain.domain;
        // QPageRelation relation = QPageRelation.pageRelation; // 관련정보는 lazy loading한다.

        BooleanBuilder builder = new BooleanBuilder();

        // WHERE 조건
        builder.and(page.domain.domainId.eq(domainId));

        JPQLQuery<Page> query = queryFactory.selectFrom(page)
                                            .innerJoin(page.domain, domain)
                                            .fetchJoin()
                                            // .leftJoin(page.pageRelations, relation).fetchJoin()
                                            .where(builder)
                                            .orderBy(page.pageUrl.asc());

        return query.fetch();
    }

    @Override
    public List<Page> findByPageUrl(String pageUrl, String domainId) {
        QPage page = QPage.page;
        QDomain domain = QDomain.domain;
        // QPageRelation relation = QPageRelation.pageRelation;// 관련정보는 lazy loading한다.

        BooleanBuilder builder = new BooleanBuilder();

        // WHERE 조건
        builder.and(page.domain.domainId.eq(domainId));
        builder.and(page.pageUrl.eq(pageUrl));

        JPQLQuery<Page> query = queryFactory.selectFrom(page)
                                            .innerJoin(page.domain, domain)
                                            .fetchJoin()
                                            // .leftJoin(page.pageRelations, relation).fetchJoin()
                                            .where(builder)
                                            .orderBy(page.pageUrl.asc());

        return query.fetch();
    }

    @Override
    public org.springframework.data.domain.Page<Page> findList(PageSearchDTO search, Pageable pageable) {
        QPage page = QPage.page;
        QDomain domain = QDomain.domain;
        // QPageRelation relation = QPageRelation.pageRelation; // 관련정보는 lazy loading한다.

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(page.domain.domainId.eq(search.getDomainId()));

        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("pageSeq")) {
                builder.and(page.pageSeq.eq(Long.parseLong(keyword)));
            } else if (searchType.equals("pageName")) {
                builder.and(page.pageName.contains(keyword));
            } else if (searchType.equals("pageServiceName")) {
                builder.and(page.pageServiceName.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                builder.and(page.pageSeq.like(keyword)
                                        .or(page.pageName.contains(keyword))
                                        .or(page.pageServiceName.contains(keyword)));
            }
        }

        JPQLQuery<Page> query = queryFactory.selectFrom(page);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Page> list = query.innerJoin(page.domain, domain)
                                       .fetchJoin()
                                       .where(builder)
                                       .fetchResults();

        return new PageImpl<Page>(list.getResults(), pageable, list.getTotal());
    }

    // @Override
    // public org.springframework.data.domain.Page<Page> findRelPages(RelationSearchDTO search,
    // Pageable pageable) {
    // QPageRel pageRel = QPageRel.pageRel;
    // QPage page = QPage.page;
    //
    // BooleanBuilder builder = new BooleanBuilder();
    // String searchType = search.getSearchType();
    // String keyword = search.getKeyword();
    //
    // if (McpString.isNotEmpty(search.getDomainId()) && !search.getDomainId().equals(TpsConstants.SEARCH_TYPE_ALL)) {
    // builder.and(pageRel.domain.domainId.eq(search.getDomainId()));
    // }
    //
    // builder.and(pageRel.relType.eq(search.getRelSeqType()));
    // builder.and(pageRel.relSeq.eq(search.getRelSeq()));
    // if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
    // if (searchType.equals("pageSeq")) {
    // builder.and(page.pageSeq.eq(Long.parseLong(keyword)));
    // } else if (searchType.equals("pageName")) {
    // builder.and(page.pageName.contains(keyword));
    // }
    // }
    //
    // /**
    // * 서브쿼리 생성하는 쿼리 select page from Page page where page.pageSeq in (select
    // * pageRel.page.pageSeq from PageRel pageRel where pageRel.relType = ?1 and pageRel.relSeq =
    // * ?2)
    // */
    // JPQLQuery<Page> query = queryFactory.selectFrom(page).where(page.pageSeq
    // .in(JPAExpressions.select(pageRel.page.pageSeq).from(pageRel).where(builder)));
    // query = getQuerydsl().applyPagination(pageable, query);
    // QueryResults<Page> list = query.fetchResults();
    //
    // return new PageImpl<Page>(list.getResults(), pageable, list.getTotal());
    // }

}
