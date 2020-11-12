/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.entity.AreaSimple;
import jmnet.moka.core.tps.mvc.area.entity.QArea;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * Description: 편집영역 QueryDSL 구현체
 *
 * @author ssc
 * @since 2020-11-11
 */
public class AreaRepositorySupportImpl extends QuerydslRepositorySupport implements AreaRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public AreaRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Area.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<AreaSimple> findByParent(Long parentAreaSeq) {
        QArea area = QArea.area;

        BooleanBuilder builder = new BooleanBuilder();
        if (parentAreaSeq == null) {
            builder.and(area.parent.areaSeq.isNull());
        } else {
            builder.and(area.parent.areaSeq.eq(parentAreaSeq));
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "codeOrd");
        JPQLQuery<AreaSimple> query = queryFactory.select(
                Projections.fields(AreaSimple.class, area.areaSeq.as("areaSeq"), area.depth.as("depth"), area.usedYn.as("usedYn"),
                                   area.ordNo.as("ordNo"), area.areaNm.as("areaNm")))
                                                  .from(area)
                                                  .where(builder)
                                                  .orderBy(area.ordNo.asc());
        return query.fetch();
    }
}
