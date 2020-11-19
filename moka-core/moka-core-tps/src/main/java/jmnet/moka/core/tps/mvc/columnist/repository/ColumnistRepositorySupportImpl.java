package jmnet.moka.core.tps.mvc.columnist.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistSearchDTO;
import jmnet.moka.core.tps.mvc.columnist.entity.Columnist;
import jmnet.moka.core.tps.mvc.columnist.entity.QColumnist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.columnist.repository
 * ClassName : ColumnistRepositorySupportImpl
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public class ColumnistRepositorySupportImpl extends QuerydslRepositorySupport implements ColumnistRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public ColumnistRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Columnist.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Columnist> findAllColumnist(ColumnistSearchDTO searchDTO) {
        QColumnist qColumnist = QColumnist.columnist;
        JPQLQuery<Columnist> query = from(qColumnist);
        
        // 상태구분
        if (McpString.isNotEmpty(searchDTO.getStatus())) {

            query.where(qColumnist.status.toUpperCase().eq(searchDTO.getStatus().toUpperCase()));
        }

        // 기자이름
        if (McpString.isNotEmpty(searchDTO.getColumnNm())) {
            query.where(qColumnist.columnistNm.contains(searchDTO.getColumnNm().toUpperCase()));
        }

        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<Columnist> list = query.fetchResults();

        return new PageImpl<Columnist>(list.getResults(), pageable, list.getTotal());
    }


}
