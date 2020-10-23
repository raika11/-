package jmnet.moka.core.tps.mvc.skin.repository;

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
import jmnet.moka.core.tps.mvc.skin.entity.QSkin;
import jmnet.moka.core.tps.mvc.style.entity.QStyle;
import jmnet.moka.core.tps.mvc.skin.dto.SkinSearchDTO;
import jmnet.moka.core.tps.mvc.skin.entity.Skin;

public class SkinRepositorySupportImpl extends QuerydslRepositorySupport
        implements SkinRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public SkinRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Skin.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Skin> findList(SkinSearchDTO search, Pageable pageable) {
        QSkin skin = QSkin.skin;
        QDomain domain = QDomain.domain;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();
        String servieType = search.getServiceType();

        // WHERE 조건
        builder.and(skin.domain.domainId.eq(search.getDomainId()));
        if (!McpString.isEmpty(servieType)) {
            builder.and(skin.serviceType.eq(servieType));
        }

        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("skinSeq")) {
                builder.and(skin.skinSeq.eq(Long.parseLong(keyword)));
            } else if (searchType.equals("skinName")) {
                builder.and(skin.skinName.contains(keyword));
            } else if (searchType.equals("all")) {
                builder.and(skin.skinSeq.like(keyword).or(skin.skinName.contains(keyword)));
            }
        }

        JPQLQuery<Skin> query = queryFactory.selectFrom(skin);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Skin> list = query.innerJoin(skin.domain, domain).fetchJoin()
                .where(builder).fetchResults();

        return new PageImpl<Skin>(list.getResults(), pageable, list.getTotal());
    }

}
