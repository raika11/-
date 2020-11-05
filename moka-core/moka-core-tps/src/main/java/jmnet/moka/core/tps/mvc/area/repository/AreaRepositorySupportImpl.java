/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-04
 */
public class AreaRepositorySupportImpl extends QuerydslRepositorySupport implements AreaRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public AreaRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Area.class);
        this.queryFactory = queryFactory;
    }

    //    @Override
    //    public Page<Area> findAllbyDepth(AreaSearchDTO searchDTO) {
    //        QArea area = QArea.area;
    //        BooleanBuilder builder = new BooleanBuilder();
    //        builder.and(area.depth.eq(searchDTO.getDepth()));
    //
    //        JPQLQuery<Area> query = queryFactory.selectFrom(area);
    //        query = getQuerydsl().applyPagination(searchDTO.getPageable(), query);
    //        QueryResults<Area> list = query.where(builder)
    //                                       .fetchResults();
    //
    //        return new PageImpl<Area>(list.getResults(), searchDTO.getPageable(), list.getTotal());
    //    }
}
