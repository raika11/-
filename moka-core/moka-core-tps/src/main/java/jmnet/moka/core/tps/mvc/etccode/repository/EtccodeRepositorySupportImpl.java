/**
 * msp-tps EtccodeRepositorySupportImpl.java 2020. 6. 18. 오후 3:54:36 ssc
 */
package jmnet.moka.core.tps.mvc.etccode.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.etccode.entity.QEtccode;
import jmnet.moka.core.tps.mvc.etccode.entity.QEtccodeType;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.etccode.dto.EtccodeSearchDTO;
import jmnet.moka.core.tps.mvc.etccode.entity.Etccode;

/**
 * <pre>
 * 
 * 2020. 6. 18. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 18. 오후 3:54:36
 * @author ssc
 */
public class EtccodeRepositorySupportImpl extends QuerydslRepositorySupport
        implements EtccodeRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public EtccodeRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Etccode.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Etccode> findUseList(String codeTypeId) {
        QEtccode etccode = QEtccode.etccode;
        QEtccodeType etccodeType = QEtccodeType.etccodeType;

        BooleanBuilder builder = new BooleanBuilder();

        // WHERE 조건
        builder.and(etccode.etccodeType.codeTypeId.eq(codeTypeId));
        builder.and(etccode.useYn.eq("Y"));

        JPQLQuery<Etccode> query = queryFactory.selectFrom(etccode).orderBy(etccode.codeOrder.asc());

        return query.innerJoin(etccode.etccodeType, etccodeType).fetchJoin().where(builder).fetch();
    }

    @Override
    public Page<Etccode> findList(EtccodeSearchDTO search, Pageable pageable) {
        QEtccode etccode = QEtccode.etccode;
        QEtccodeType etccodeType = QEtccodeType.etccodeType;

        BooleanBuilder builder = new BooleanBuilder();
        String codeTypeId = search.getCodeTypeId();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(etccode.etccodeType.codeTypeId.eq(codeTypeId));
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("codeId")) {
                builder.and(etccode.codeId.contains(keyword));
            } else if (searchType.equals("codeName")) {
                builder.and(etccode.codeName.contains(keyword));
            }
        }

        JPQLQuery<Etccode> query = queryFactory.selectFrom(etccode);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Etccode> list = query.innerJoin(etccode.etccodeType, etccodeType).fetchJoin()
                .where(builder).fetchResults();

        return new PageImpl<Etccode>(list.getResults(), pageable, list.getTotal());
    }

}
