package jmnet.moka.core.tps.mvc.container.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.container.entity.QContainer;
import jmnet.moka.core.tps.mvc.container.entity.QContainerRel;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * 컨테이너 히스토리 Support 구현클래스
 *
 * @author ohtah
 */
public class ContainerRepositorySupportImpl extends QuerydslRepositorySupport implements ContainerRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public ContainerRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Container.class);
        this.queryFactory = queryFactory;
    }

    //검색조건에 해당하는 아이템을 사용중인 컨테이너 목록 조회(부모찾기)
    //   : 컴포넌트,템플릿,데이타셋,광고에서 사용하는 함수
    @Override
    public Page<Container> findRelList(RelationSearchDTO search, Pageable pageable) {
        QContainerRel containerRel = QContainerRel.containerRel;
        QContainer container = QContainer.container;

        BooleanBuilder builder = new BooleanBuilder();
        if (McpString.isNotEmpty(search.getDomainId()) && !search.getDomainId()
                                                                 .equals(TpsConstants.SEARCH_TYPE_ALL)) {
            builder.and(containerRel.domain.domainId.eq(search.getDomainId()));
        }

        builder.and(containerRel.relType.eq(search.getRelSeqType()));    // CT, CP, TP, DS, AD
        builder.and(containerRel.relSeq.eq(search.getRelSeq()));

        /**
         * 서브쿼리 생성하는 쿼리 select skin from Skin skin where skin.skinSeq in (select
         * skinRel.skin.skinSeq from SkinRel skinRel where skinRel.relType = ?1 and skinRel.relSeq =
         * ?2)
         */
        JPQLQuery<Container> query = queryFactory.selectFrom(container)
                                                 .where(container.containerSeq.in(JPAExpressions.select(containerRel.container.containerSeq)
                                                                                                .from(containerRel)
                                                                                                .where(builder)));
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Container> list = query.fetchResults();

        return new PageImpl<Container>(list.getResults(), pageable, list.getTotal());
    }

    //    @Override
    //    public Page<Container> findList(ContainerSearchDTO search, Pageable pageable) {
    //        QContainer container = QContainer.container;
    //        QDomain domain = QDomain.domain;
    //
    //        BooleanBuilder builder = new BooleanBuilder();
    //        String searchType = search.getSearchType();
    //        String keyword = search.getKeyword();
    //
    //        // WHERE 조건
    //        if (McpString.isNotEmpty(search.getDomainId()) && !search.getDomainId().equals(TpsConstants.SEARCH_TYPE_ALL)) {
    //            builder.and(container.domain.domainId.eq(search.getDomainId()));
    //        }
    //
    //        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
    //            if (searchType.equals("containerSeq")) {
    //                builder.and(container.containerSeq.eq(Long.parseLong(keyword)));
    //            } else if (searchType.equals("containerName")) {
    //                builder.and(container.containerName.contains(keyword));
    //            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
    //                builder.and(container.containerSeq.like(keyword).or(container.containerName.contains(keyword)));
    //            }
    //        }
    //
    //        JPQLQuery<Container> query = queryFactory.selectFrom(container);
    //        query = getQuerydsl().applyPagination(pageable, query);
    //        QueryResults<Container> list = query.innerJoin(container.domain, domain).fetchJoin()
    //                .where(builder).fetchResults();
    //
    //        return new PageImpl<Container>(list.getResults(), pageable, list.getTotal());
    //    }
    //
    //	//페이지에서 사용중인 컨테이너 목록 조회(자식찾기)
    //    //   : 페이지에서 사용하는 함수
    //	@Override
    //	public Page<Container> findPageChildRels(ContainerSearchDTO search, Pageable pageable) {
    //
    //		QPageRel pageRel = QPageRel.pageRel;
    //        QContainer container = QContainer.container;
    //
    //        BooleanBuilder builder = new BooleanBuilder();
    //        if (McpString.isNotEmpty(search.getDomainId()) && !search.getDomainId().equals(TpsConstants.SEARCH_TYPE_ALL)) {
    //            builder.and(pageRel.domain.domainId.eq(search.getDomainId()));
    //        }
    //
    //        builder.and(pageRel.page.pageSeq.eq(Long.parseLong(search.getKeyword())));
    //        builder.and(pageRel.relType.eq(MspConstants.ITEM_CONTAINER));
    //
    //        /**
    //         * 서브쿼리 생성하는 쿼리 select skin from Skin skin where skin.skinSeq in (select
    //         * skinRel.skin.skinSeq from SkinRel skinRel where skinRel.relType = ?1 and skinRel.relSeq =
    //         * ?2)
    //         */
    //        JPQLQuery<Container> query = queryFactory.selectFrom(container).where(
    //                container.containerSeq.in(JPAExpressions.select(pageRel.relSeq)
    //                        .from(pageRel).where(builder)));
    //        query = getQuerydsl().applyPagination(pageable, query);
    //        QueryResults<Container> list = query.fetchResults();
    //
    //        return new PageImpl<Container>(list.getResults(), pageable, list.getTotal());
    //	}
    //
    //	//콘텐츠 스킨에서 사용중인 컨테이너 목록 조회(자식찾기)
    //    //   : 콘텐츠스킨에서 사용하는 함수
    //	@Override
    //	public Page<Container> findSkinChildRels(ContainerSearchDTO search, Pageable pageable) {
    //
    //		QSkinRel skinRel = QSkinRel.skinRel;
    //        QContainer container = QContainer.container;
    //
    //        BooleanBuilder builder = new BooleanBuilder();
    //        if (McpString.isNotEmpty(search.getDomainId()) && !search.getDomainId().equals(TpsConstants.SEARCH_TYPE_ALL)) {
    //            builder.and(skinRel.domain.domainId.eq(search.getDomainId()));
    //        }
    //
    //        builder.and(skinRel.skin.skinSeq.eq(Long.parseLong(search.getKeyword())));
    //        builder.and(skinRel.relType.eq(MspConstants.ITEM_CONTAINER));
    //
    //        /**
    //         * 서브쿼리 생성하는 쿼리 select skin from Skin skin where skin.skinSeq in (select
    //         * skinRel.skin.skinSeq from SkinRel skinRel where skinRel.relType = ?1 and skinRel.relSeq =
    //         * ?2)
    //         */
    //        JPQLQuery<Container> query = queryFactory.selectFrom(container).where(
    //                container.containerSeq.in(JPAExpressions.select(skinRel.relSeq)
    //                        .from(skinRel).where(builder)));
    //        query = getQuerydsl().applyPagination(pageable, query);
    //        QueryResults<Container> list = query.fetchResults();
    //
    //        return new PageImpl<Container>(list.getResults(), pageable, list.getTotal());
    //	}
}
