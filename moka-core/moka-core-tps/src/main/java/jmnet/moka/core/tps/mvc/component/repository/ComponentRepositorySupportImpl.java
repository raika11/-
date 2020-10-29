package jmnet.moka.core.tps.mvc.component.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.QComponent;
import jmnet.moka.core.tps.mvc.dataset.entity.QDataset;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.QTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * 컴포넌트 Repository Support 구현체
 *
 * @author jeon
 */
public class ComponentRepositorySupportImpl extends QuerydslRepositorySupport implements ComponentRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ComponentRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Component.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Component> findList(ComponentSearchDTO search, Pageable pageable) {
        QComponent component = QComponent.component;
        QDomain domain = QDomain.domain;
        QTemplate template = QTemplate.template;
        QDataset dataset = QDataset.dataset;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // 검색조건 (컴포넌트ID, 컴포넌트명, 템플릿ID, 템플릿명)
        builder.and(component.domain.domainId.eq(search.getDomainId()));
        if (McpString.isNotEmpty(searchType) && McpString.isNotEmpty(keyword)) {
            if (searchType.equals("componentSeq")) {
                builder.and(component.componentSeq.eq(Long.valueOf(keyword)));
            } else if (searchType.equals("componentName")) {
                builder.and(component.componentName.contains(keyword));
            } else if (searchType.equals("templateSeq")) {
                builder.and(component.template.templateSeq.eq(Long.valueOf(keyword)));
            } else if (searchType.equals("templateName")) {
                builder.and(component.template.in(JPAExpressions.selectFrom(template)
                                                                .where(template.templateName.contains(keyword))));
            }
        }

        JPQLQuery<Component> query = queryFactory.selectFrom(component);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Component> list = query.leftJoin(component.domain, domain)
                                            .fetchJoin()
                                            .leftJoin(component.template, template)
                                            .fetchJoin()
                                            .leftJoin(component.dataset, dataset)
                                            .fetchJoin()
                                            .where(builder)
                                            .fetchResults();

        return new PageImpl<Component>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    public Page<Component> findListByTemplate(RelationSearchDTO search, Pageable pageable) {
        QComponent component = QComponent.component;
        QDomain domain = QDomain.domain;
        QTemplate template = QTemplate.template;
        QDataset dataset = QDataset.dataset;

        BooleanBuilder builder = new BooleanBuilder();
        // String searchType = search.getSearchType();
        // String keyword = search.getKeyword();

        // 도메인ID 조건
        if (!McpString.isNullOrEmpty(search.getDomainId()) && !search.getDomainId()
                                                                     .equals(TpsConstants.SEARCH_TYPE_ALL)) {
            builder.and(component.domain.domainId.eq(search.getDomainId()));
        }
        // 검색조건 (컴포넌트명, 컴포넌트ID)
        // if (McpString.isNotEmpty(searchType) && McpString.isNotEmpty(keyword)) {
        // if (searchType.equals("componentSeq")) {
        // builder.and(component.componentSeq.eq(Long.valueOf(keyword)));
        // } else if (searchType.equals("componentName")) {
        // builder.and(component.componentName.contains(keyword));
        // }
        // }
        // 템플릿 조건
        builder.and(component.template.templateSeq.eq(search.getRelSeq()));

        JPQLQuery<Component> query = queryFactory.selectFrom(component);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Component> list = query.leftJoin(component.domain, domain)
                                            .fetchJoin()
                                            .leftJoin(component.template, template)
                                            .fetchJoin()
                                            .leftJoin(component.dataset, dataset)
                                            .fetchJoin()
                                            .where(builder)
                                            .fetchResults();

        return new PageImpl<Component>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    public Page<Component> findListByDataset(RelationSearchDTO search, Pageable pageable) {
        QComponent component = QComponent.component;
        QDomain domain = QDomain.domain;
        QTemplate template = QTemplate.template;
        QDataset dataset = QDataset.dataset;

        BooleanBuilder builder = new BooleanBuilder();
        // String searchType = search.getSearchType();
        // String keyword = search.getKeyword();

        // 도메인ID 조건
        if (!McpString.isNullOrEmpty(search.getDomainId()) && !search.getDomainId()
                                                                     .equals(TpsConstants.SEARCH_TYPE_ALL)) {
            builder.and(component.domain.domainId.eq(search.getDomainId()));
        }
        // 검색조건 (컴포넌트명, 컴포넌트ID)
        // if (McpString.isNotEmpty(searchType) && McpString.isNotEmpty(keyword)) {
        // if (searchType.equals("componentSeq")) {
        // builder.and(component.componentSeq.eq(Long.valueOf(keyword)));
        // } else if (searchType.equals("componentName")) {
        // builder.and(component.componentName.contains(keyword));
        // }
        // }
        // 데이터셋 조건
        builder.and(component.dataset.datasetSeq.eq(search.getRelSeq()));

        JPQLQuery<Component> query = queryFactory.selectFrom(component);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Component> list = query.leftJoin(component.domain, domain)
                                            .fetchJoin()
                                            .leftJoin(component.template, template)
                                            .fetchJoin()
                                            .leftJoin(component.dataset, dataset)
                                            .fetchJoin()
                                            .where(builder)
                                            .fetchResults();

        return new PageImpl<Component>(list.getResults(), pageable, list.getTotal());
    }

}
