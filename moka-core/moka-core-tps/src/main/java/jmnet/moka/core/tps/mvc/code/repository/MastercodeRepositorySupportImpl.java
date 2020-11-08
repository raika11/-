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
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.entity.Mastercode;
import jmnet.moka.core.tps.mvc.code.entity.QMastercode;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 11. 8.
 */
public class MastercodeRepositorySupportImpl extends QuerydslRepositorySupport implements
    MastercodeRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public MastercodeRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Mastercode.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Mastercode> findList(CodeSearchDTO search) {
        QMastercode master = QMastercode.mastercode;
        String searchType = search.getSearchType();
        String keyword = search.getKeyword() == null ? "" : search.getKeyword();
        String usedYn = search.getUsedYn();

        BooleanBuilder builder = new BooleanBuilder();

        if(usedYn.equals(McpString.YES) || usedYn.equals(McpString.NO)) {
            builder.and(master.usedYn.eq(usedYn));
        }

        if(searchType.equals("korname")) {
            // 코드명 검색
            builder
                .or(master.serviceKorname.contains(keyword))
                .or(master.sectionEngname.contains(keyword))
                .or(master.contentKorname.contains(keyword));
        } else if(searchType.equals("parentCode")) {
            int len = keyword.length();
            if (len == 0){
                // service code 검색
                builder.and(master.masterCode.length().eq(2));
            } else if (len == 2) {
                // section code 검색
                builder.and(master.masterCode.length().eq(4)).and(master.masterCode.startsWith(keyword));
            } else {
                // content code 검색
                builder.and(master.masterCode.length().gt(4)).and(master.masterCode.startsWith(keyword));
            }
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "codeOrd");
        JPQLQuery<Mastercode> query = queryFactory.selectFrom(master)
                                                .where(builder);
        query = getQuerydsl().applySorting(sort, query);
        QueryResults<Mastercode> list = query.fetchResults();
        return query.fetchResults().getResults();
    }
}
