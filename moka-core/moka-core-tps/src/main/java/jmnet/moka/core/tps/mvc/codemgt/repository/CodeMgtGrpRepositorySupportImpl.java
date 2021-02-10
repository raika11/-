/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.codemgt.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtGrpSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgtGrp;
import jmnet.moka.core.tps.mvc.codemgt.entity.QCodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.entity.QCodeMgtGrp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-02-10
 */
public class CodeMgtGrpRepositorySupportImpl extends TpsQueryDslRepositorySupport implements CodeMgtGrpRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public CodeMgtGrpRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(CodeMgtGrp.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<CodeMgtGrp> findAll(CodeMgtGrpSearchDTO search) {
        QCodeMgtGrp codeMgtGrp = QCodeMgtGrp.codeMgtGrp;
        QCodeMgt codeMgt = QCodeMgt.codeMgt;

        BooleanBuilder builder = new BooleanBuilder();
        String keyword = search.getKeyword();
        String searchType = search.getSearchType();

        builder.and(codeMgtGrp.usedYn.eq(MokaConstants.YES));

        if (search
                .getSecretYn()
                .equals(MokaConstants.NO)) {
            builder.and(codeMgtGrp.secretYn.eq(MokaConstants.NO));
        }

        if (McpString.isNotEmpty(keyword)) {
            if (searchType.equals("grp")) {
                builder.and(codeMgtGrp.grpCd
                        .contains(keyword)
                        .or(codeMgtGrp.cdNm.contains(keyword))
                        .or(codeMgtGrp.cdEngNm.contains(keyword)));
            } else if (searchType.equals("grpCd")) {
                builder.and(codeMgtGrp.grpCd.contains(keyword));
            } else if (searchType.equals("grpCdNm")) {
                builder.and(codeMgtGrp.cdNm
                        .contains(keyword)
                        .or(codeMgtGrp.cdEngNm.contains(keyword)));
            } else if (searchType.equals("dtl")) {
                builder.and(codeMgt.dtlCd
                        .contains(keyword)
                        .or(codeMgt.cdNm.contains(keyword))
                        .or(codeMgt.cdEngNm.contains(keyword)));
            } else if (searchType.equals("dtlCd")) {
                builder.and(codeMgt.dtlCd.contains(keyword));
            } else if (searchType.equals("dtlCdNm")) {
                builder.and(codeMgt.cdNm
                        .contains(keyword)
                        .or(codeMgt.cdEngNm.contains(keyword)));
            }
        }

        JPQLQuery<CodeMgtGrp> query = queryFactory.selectFrom(codeMgtGrp);
        query = getQuerydsl().applyPagination(search.getPageable(), query);
        QueryResults<CodeMgtGrp> list = query.join(codeMgtGrp.codeMgts, codeMgt)
                                             //                .join(codeMgt).on(codeMgtGrp.grpCd.eq(codeMgt.codeMgtGrp.grpCd))
                                             .where(builder)
                                             .fetchResults();

        return new PageImpl<>(list.getResults(), search.getPageable(), list.getTotal());

        //        if (search
        //                .getSecretYn()
        //                .equals(TpsConstants.SEARCH_TYPE_ALL)) {
        //            return codeMgtGrpRepository.findByUsedYn(MokaConstants.YES, search.getPageable());
        //        } else {
        //            return codeMgtGrpRepository.findBySecretYnAndUsedYn(search.getSecretYn(), MokaConstants.YES, search.getPageable());
        //        }
        //
        //        return null;
    }
}
