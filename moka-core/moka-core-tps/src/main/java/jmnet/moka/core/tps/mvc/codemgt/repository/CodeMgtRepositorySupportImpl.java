/**
 * msp-tps CodeMgtRepositorySupportImpl.java 2020. 6. 18. 오후 3:54:36 ssc
 */
package jmnet.moka.core.tps.mvc.codemgt.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDtlDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.entity.QCodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.entity.QCodeMgtGrp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * 2020. 6. 18. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 18. 오후 3:54:36
 */
public class CodeMgtRepositorySupportImpl extends TpsQueryDslRepositorySupport implements CodeMgtRepositorySupport {

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

        JPQLQuery<CodeMgt> query = queryFactory
                .selectFrom(codeMgt)
                .orderBy(codeMgt.cdOrd.asc());

        return query
                .innerJoin(codeMgt.codeMgtGrp, codeMgtGrp)
                .fetchJoin()
                .where(builder)
                .fetch();
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
        QueryResults<CodeMgt> list = query
                .innerJoin(codeMgt.codeMgtGrp, codeMgtGrp)
                .fetchJoin()
                .where(builder)
                .fetchResults();

        return new PageImpl<CodeMgt>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    public List<CodeMgt> findByDtlCd(String grpCd, String dtlCd) {
        QCodeMgt QcodeMgt = QCodeMgt.codeMgt;
        JPQLQuery<CodeMgt> query = from(QcodeMgt);

        BooleanBuilder builder = new BooleanBuilder();
        query.where(QcodeMgt.codeMgtGrp.grpCd.eq(grpCd));
        query.where(QcodeMgt.usedYn.eq("Y"));
        query.where(QcodeMgt.dtlCd.eq(dtlCd));

        QueryResults<CodeMgt> list = query.fetchResults();

        return query
                .fetchResults()
                .getResults();
    }

    @Override
    @Transactional
    public CodeMgtDtlDTO updateCodeMgtDtl(CodeMgtDtlDTO codeMgtDtlDTO) {
        QCodeMgt QcodeMgt = QCodeMgt.codeMgt;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(QcodeMgt.seqNo.eq(codeMgtDtlDTO.getSeqNo()));
        queryFactory
                .update(QcodeMgt)
                .where(builder)
                .set(QcodeMgt.cdNm, codeMgtDtlDTO.getCdNm())
                .execute();

        return codeMgtDtlDTO;
    }

}
