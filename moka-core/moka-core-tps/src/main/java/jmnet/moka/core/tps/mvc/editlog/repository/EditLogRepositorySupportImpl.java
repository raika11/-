package jmnet.moka.core.tps.mvc.editlog.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.editlog.dto.EditLogSearchDTO;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import jmnet.moka.core.tps.mvc.editlog.entity.QEditLog;
import jmnet.moka.core.tps.mvc.menu.entity.QMenuSimple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * <pre>
 * Editlog Repository Support Implementation class
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editlog.repository
 * ClassName : EditLogRepositorySupportImpl
 * Created : 2021-01-20 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-20 10:50
 */
public class EditLogRepositorySupportImpl extends TpsQueryDslRepositorySupport implements EditLogRepositorySupport {
    public EditLogRepositorySupportImpl() {
        super(EditLog.class);
    }


    @Override
    public Page<EditLog> findAllEditLog(EditLogSearchDTO searchDTO) {

        QEditLog qEditLog = QEditLog.editLog;
        QMenuSimple menuSimple = QMenuSimple.menuSimple;
        JPQLQuery<EditLog> query = from(qEditLog);

        if (McpString.isNotEmpty(searchDTO.getSuccessYn()) && !TpsConstants.SEARCH_TYPE_ALL.equals(searchDTO.getSuccessYn())) {
            query.where(qEditLog.successYn.eq(searchDTO.getSuccessYn()));
        }
        if (searchDTO.getAction() != null) {
            query.where(qEditLog.action.eq(searchDTO.getAction()));
        }

        if (McpString.isNotEmpty(searchDTO.getKeyword())) {
            if (TpsConstants.SEARCH_TYPE_ALL.equals(searchDTO.getSearchType())) {
                String keyword = searchDTO
                        .getKeyword()
                        .toUpperCase();
                query.where(qEditLog.regIp
                        .toUpperCase()
                        .contains(keyword)
                        .or(qEditLog.regIp
                                .toUpperCase()
                                .contains(keyword))
                        .or(qEditLog.memberId
                                .toUpperCase()
                                .contains(keyword))
                        .or(qEditLog.menuId.in(JPAExpressions
                                .selectFrom(menuSimple)
                                .select(menuSimple.menuId)
                                .where(menuSimple.menuNm.contains(searchDTO.getKeyword())))));
            } else {
                if (qEditLog.memberId
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qEditLog.memberId.contains(searchDTO.getKeyword()));
                } else if (qEditLog.regIp
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qEditLog.regIp.contains(searchDTO.getKeyword()));
                } else if (menuSimple.menuNm
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qEditLog.menuId.in(JPAExpressions
                            .selectFrom(menuSimple)
                            .select(menuSimple.menuId)
                            .where(menuSimple.menuNm.contains(searchDTO.getKeyword()))));
                }
            }
        }

        if (searchDTO.getStartDt() != null && searchDTO.getEndDt() != null) {
            query.where(qEditLog.regDt.between(searchDTO.getStartDt(), searchDTO.getEndDt()));
        } else if (searchDTO.getStartDt() != null) {
            query.where(qEditLog.regDt.goe(searchDTO.getStartDt()));
        } else if (searchDTO.getEndDt() != null) {
            query.where(qEditLog.regDt.loe(searchDTO.getEndDt()));
        } else {
            // 아무것도 안함
        }

        // 데이터가 많은 관계로 full 검색 기능 없이 무조건 페이징 처리한다.
        query = getQuerydsl().applyPagination(searchDTO.getPageable(), query);

        QueryResults<EditLog> list = query
                .select(Projections.fields(EditLog.class, qEditLog.seqNo, qEditLog.regDt, qEditLog.action, qEditLog.successYn, qEditLog.regIp,
                        qEditLog.memberId, qEditLog.menuId, ExpressionUtils.as(JPAExpressions
                                .select(menuSimple.menuNm)
                                .from(menuSimple)
                                .where(menuSimple.menuId.eq(qEditLog.menuId)), "menuNm")))
                .fetchResults();

        return new PageImpl<>(list.getResults(), searchDTO.getPageable(), list.getTotal());
    }


    public Optional<EditLog> findEditLog(Long seqNo) {

        QEditLog qEditLog = QEditLog.editLog;
        QMenuSimple menuSimple = QMenuSimple.menuSimple;

        JPQLQuery<EditLog> query = from(qEditLog);

        EditLog result = query
                .select(Projections.fields(EditLog.class, qEditLog.seqNo, qEditLog.menuId, qEditLog.memberId, qEditLog.regIp, qEditLog.successYn,
                        qEditLog.action, qEditLog.apiPath, qEditLog.errMsg, qEditLog.executedTime, qEditLog.param, qEditLog.regDt, ExpressionUtils.as(
                                JPAExpressions
                                        .select(menuSimple.menuNm)
                                        .from(menuSimple)
                                        .where(menuSimple.menuId.eq(qEditLog.menuId)), "menuNm")))
                .where(qEditLog.seqNo.eq(seqNo))
                .fetchFirst();

        return Optional.ofNullable(result);
    }


}
