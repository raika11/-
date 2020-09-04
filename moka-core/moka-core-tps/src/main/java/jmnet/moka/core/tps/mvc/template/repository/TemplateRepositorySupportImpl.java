package jmnet.moka.core.tps.mvc.template.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.core.tps.mvc.template.entity.QTemplate;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;

/**
 * 
 * <pre>
 * 템플릿 Repository Support Impl
 * 2020. 4. 21. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 21. 오후 4:38:35
 * @author jeon
 */
public class TemplateRepositorySupportImpl extends QuerydslRepositorySupport
        implements TemplateRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public TemplateRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Template.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Template> findList(TemplateSearchDTO search, Pageable pageable) {
        QTemplate template = QTemplate.template;
        QDomain domain = QDomain.domain;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(template.domain.domainId.eq(search.getDomainId()));
        if (McpString.isNotEmpty(searchType) && McpString.isNotEmpty(keyword)) {
            if (searchType.equals("templateSeq")) {
                builder.and(template.templateSeq.eq(Long.valueOf(keyword)));
            } else if (searchType.equals("templateName")) {
                builder.and(template.templateName.contains(keyword));
            }
        }

        JPQLQuery<Template> query = queryFactory.selectFrom(template);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Template> list =
                query.leftJoin(template.domain, domain).fetchJoin().where(builder).fetchResults();

        return new PageImpl<Template>(list.getResults(), pageable, list.getTotal());
    }
}
