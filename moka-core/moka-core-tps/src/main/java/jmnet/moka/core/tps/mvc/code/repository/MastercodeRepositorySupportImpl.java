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
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.entity.Mastercode;
import jmnet.moka.core.tps.mvc.code.entity.QMastercode;
import jmnet.moka.core.tps.mvc.code.entity.QServiceMap;
import org.springframework.data.domain.Sort;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 11. 8.
 */
public class MastercodeRepositorySupportImpl extends TpsQueryDslRepositorySupport implements MastercodeRepositorySupport {
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

        if (McpString.isNotEmpty(usedYn) && (usedYn.equals(McpString.YES) || usedYn.equals(McpString.NO))) {
            builder.and(master.usedYn.eq(usedYn));
        }

        if (searchType.equals("korname")) {
            // 코드명 검색
            builder
                    .or(master.serviceKorname.contains(keyword))
                    .or(master.sectionEngname.contains(keyword))
                    .or(master.contentKorname.contains(keyword));
        } else if (searchType.equals("parentCode")) {
            int len = keyword.length();
            if (len == 0) {
                // service code 검색
                builder
                        .and(master.masterCode.endsWith("00000"))
                        .and(master.masterCode.ne("0000000"));
            } else if (len == 2) {
                // section code 검색
                builder
                        .and(master.masterCode.startsWith(keyword))
                        .and(master.masterCode.endsWith("000"))
                        .and(master.masterCode.ne(keyword + "00000"));
            } else {
                // content code 검색
                builder
                        .and(master.masterCode.startsWith(keyword))
                        .and(master.masterCode.ne(keyword + "000"));
            }
        }

        Sort sort = Sort.by(Sort.Direction.ASC, "codeOrd");
        JPQLQuery<Mastercode> query = queryFactory
                .selectFrom(master)
                .where(builder);
        query = getQuerydsl().applySorting(sort, query);
        QueryResults<Mastercode> list = query.fetchResults();
        return query
                .fetchResults()
                .getResults();
    }

    @Override
    public List<Mastercode> findAllCode() {
        QMastercode master = QMastercode.mastercode;
        QServiceMap serviceMap = QServiceMap.serviceMap;

        JPQLQuery<Mastercode> query = queryFactory
                .select(Projections.fields(Mastercode.class, master.as("masterCode"), master.as("serviceEngname"), master.as("sectionEngname"),
                        master.as("contentEngname"), master.as("serviceKorname"), master.as("sectionKorname"), master.as("contentKorname"),
                        master.as("usedYn"), master.as("codeOrd"), serviceMap.frstCode.as("frstCode"), serviceMap.scndCode.as("scndCode"),
                        serviceMap.frstKorNm.as("frstKorNm"), serviceMap.scndKorNm.as("scndKorNm")))
                .from(master)
                .leftJoin(serviceMap)
                .on(master.masterCode.eq(serviceMap.masterCode))
                .fetchJoin();
        return query.fetch();
    }
}
