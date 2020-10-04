/**
 * msp-tps CodeMgtRepositorySupportImpl.java 2020. 6. 18. 오후 3:54:36 ssc
 */
package jmnet.moka.core.tps.mvc.codeMgt.repository;

import java.util.List;

import jmnet.moka.core.tps.mvc.codeMgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codeMgt.entity.QCodeMgt;
import jmnet.moka.core.tps.mvc.codeMgt.entity.QCodeMgtGrp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.codeMgt.dto.CodeMgtSearchDTO;

/**
 * <pre>
 * 
 * 2020. 6. 18. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 18. 오후 3:54:36
 * @author ssc
 */
public class CodeMgtRepositorySupportImpl extends QuerydslRepositorySupport
        implements CodeMgtRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public CodeMgtRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(CodeMgt.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<CodeMgt> findUseList(String grpCd) {
        QCodeMgt codeMgt = QCodeMgt.codeMgt;
        QCodeMgtGrp codeMgtGrp = QCodeMgtGrp.codeMgtGrp;

        BooleanBuilder builder = new BooleanBuilder();

        // WHERE 조건
        builder.and(codeMgt.codeMgtGrp.grpCd.eq(grpCd));
        builder.and(codeMgt.usedYn.eq("Y"));

        JPQLQuery<CodeMgt> query = queryFactory.selectFrom(codeMgt).orderBy(codeMgt.cdOrd.asc());

        return query.innerJoin(codeMgt.codeMgtGrp, codeMgtGrp).fetchJoin().where(builder).fetch();
    }

    @Override
    public Page<CodeMgt> findList(CodeMgtSearchDTO search, Pageable pageable) {
        QCodeMgt codeMgt = QCodeMgt.codeMgt;
        QCodeMgtGrp codeMgtGrp = QCodeMgtGrp.codeMgtGrp;

        BooleanBuilder builder = new BooleanBuilder();
        String grpCd = search.getGrpCd();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(codeMgt.codeMgtGrp.grpCd.eq(grpCd));
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("dtlCd")) {
                builder.and(codeMgt.dtlCd.contains(keyword));
            } else if (searchType.equals("cdNm")) {
                builder.and(codeMgt.cdNm.contains(keyword));
            }
        }

        JPQLQuery<CodeMgt> query = queryFactory.selectFrom(codeMgt);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<CodeMgt> list = query.innerJoin(codeMgt.codeMgtGrp, codeMgtGrp).fetchJoin()
                .where(builder).fetchResults();

        return new PageImpl<CodeMgt>(list.getResults(), pageable, list.getTotal());
    }

}
