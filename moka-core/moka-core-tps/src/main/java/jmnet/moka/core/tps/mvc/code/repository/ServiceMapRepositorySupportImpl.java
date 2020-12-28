/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.code.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.entity.QServiceMap;
import jmnet.moka.core.tps.mvc.code.entity.ServiceMap;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 11. 8.
 */
public class ServiceMapRepositorySupportImpl extends TpsQueryDslRepositorySupport implements ServiceMapRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ServiceMapRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(ServiceMap.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<ServiceMap> findList(CodeSearchDTO search) {
        QServiceMap serviceMap = QServiceMap.serviceMap;
        String searchType = search.getSearchType();
        String keyword = search.getKeyword() == null ? "" : search.getKeyword();
        //        String usedYn = search.getUsedYn();

        BooleanBuilder builder = new BooleanBuilder();

        //        if(usedYn.equals(McpString.YES) || usedYn.equals(McpString.NO)) {
        //            builder.and(serviceMap.usedYn.eq(usedYn));
        //        }

        if (searchType.equals("korname")) {
            // 코드명 검색
            builder
                    .or(serviceMap.frstKorNm.contains(keyword))
                    .or(serviceMap.scndKorNm.contains(keyword));
        } else if (searchType.equals("parentCode")) {
            int len = keyword.length();
            if (len == 0) {
                // service code 검색
                builder.and(serviceMap.masterCode
                        .length()
                        .eq(2));
            } else if (len == 2) {
                // section code 검색
                builder
                        .and(serviceMap.masterCode
                                .length()
                                .eq(4))
                        .and(serviceMap.masterCode.startsWith(keyword));
            } else {
                // content code 검색
                builder
                        .and(serviceMap.masterCode
                                .length()
                                .gt(4))
                        .and(serviceMap.masterCode.startsWith(keyword));
            }
        }

        //        Sort sort = Sort.by(Sort.Direction.DESC, "codeOrd");
        JPQLQuery<ServiceMap> query = queryFactory
                .selectFrom(serviceMap)
                .where(builder);
        //        query = getQuerydsl().applySorting(sort, query);
        QueryResults<ServiceMap> list = query.fetchResults();
        return query
                .fetchResults()
                .getResults();
    }
}
