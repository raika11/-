/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.special.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtSearchDTO;
import jmnet.moka.core.tps.mvc.special.entity.QSpecialPageMgt;
import jmnet.moka.core.tps.mvc.special.entity.SpecialPageMgt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 12. 5.
 */
public class SpecialPageMgtRepositorySupportImpl extends TpsQueryDslRepositorySupport implements SpecialPageMgtRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public SpecialPageMgtRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(SpecialPageMgt.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<SpecialPageMgt> findAllSpecialPageMgt(SpecialPageMgtSearchDTO search) {
        QSpecialPageMgt specialPageMgt = QSpecialPageMgt.specialPageMgt;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();
        String pageCd = search.getPageCd();

        builder.and(specialPageMgt.usedYn.ne(MokaConstants.DELETE));    // 삭제된 디지털스페셜은 제외

        if (McpString.isNotEmpty(pageCd)) {
            if (!pageCd.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                builder.and(specialPageMgt.pageCd.eq(pageCd));
            }
        }

        if (McpString.isNotEmpty(search.getUsedYn())) {
            builder.and(specialPageMgt.usedYn.eq(search.getUsedYn()));
        }

        if (McpString.isNotEmpty(searchType) && McpString.isNotEmpty(keyword)) {
            if (searchType.equals("devName")) {
                builder.and(specialPageMgt.devName.contains(keyword));
            } else if (searchType.equals("pageTitle")) {
                builder.and(specialPageMgt.pageTitle.contains(keyword));
            } else if (searchType.equals("seqNo")) {
                builder.and(specialPageMgt.seqNo.eq(Long.parseLong(keyword)));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                builder.and(specialPageMgt.devName
                        .contains(keyword)
                        .or(specialPageMgt.pageTitle.contains(keyword)));
            }
        }

        JPQLQuery<SpecialPageMgt> query = queryFactory.selectFrom(specialPageMgt);
        query = getQuerydsl().applyPagination(search.getPageable(), query);
        QueryResults<SpecialPageMgt> list = query
                .where(builder)
                .fetchResults();

        return new PageImpl<>(list.getResults(), search.getPageable(), list.getTotal());

    }

    @Override
    public List<String> findAllDeptName() {
        QSpecialPageMgt specialPageMgt = QSpecialPageMgt.specialPageMgt;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(specialPageMgt.usedYn.eq(MokaConstants.YES));
        builder.and(specialPageMgt.repDeptName.isNotNull());
        builder.and(specialPageMgt.repDeptName
                .length()
                .gt(0));

        List<String> returnList = queryFactory
                .select(specialPageMgt.repDeptName)
                .from(specialPageMgt)
                .where(builder)
                .groupBy(specialPageMgt.repDeptName)
                .fetch()
                .stream()
                .collect(Collectors.toList());

        return returnList;
    }
}
