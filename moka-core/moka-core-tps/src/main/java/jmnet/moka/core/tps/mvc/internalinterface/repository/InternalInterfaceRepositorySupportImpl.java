package jmnet.moka.core.tps.mvc.internalinterface.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.codemgt.entity.QCodeMgt;
import jmnet.moka.core.tps.mvc.internalinterface.dto.InternalInterfaceSearchDTO;
import jmnet.moka.core.tps.mvc.internalinterface.entity.InternalInterface;
import jmnet.moka.core.tps.mvc.internalinterface.entity.QInternalInterface;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.internalinterface.repository
 * ClassName : InternalInterfaceRepositorySupportImpl
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 10:23
 */
public class InternalInterfaceRepositorySupportImpl extends TpsQueryDslRepositorySupport implements InternalInterfaceRepositorySupport {

    public InternalInterfaceRepositorySupportImpl() {
        super(InternalInterface.class);
    }

    @Override
    public Page<InternalInterface> findAllInternalInterface(InternalInterfaceSearchDTO searchDTO) {
        Pageable pageable = searchDTO.getPageable();
        QInternalInterface qInternalInterface = QInternalInterface.internalInterface;
        QCodeMgt qCodeMgt = QCodeMgt.codeMgt;
        JPQLQuery<InternalInterface> query = from(qInternalInterface);

        // api 유형으로 조회
        if (McpString.isNotEmpty(searchDTO.getApiType())) {
            query.where(qInternalInterface.apiType.eq(searchDTO.getApiType()));
        }
        // 메소드로 조회
        if (McpString.isNotEmpty(searchDTO.getApiMethod())) {
            query.where(qInternalInterface.apiMethod.eq(searchDTO.getApiMethod()));
        }

        // 사용여부 조회
        if (McpString.isNotEmpty(searchDTO.getUsedYn())) {
            query.where(qInternalInterface.usedYn.eq(searchDTO.getUsedYn()));
        }

        // 검색어로 조회
        if (McpString.isNotEmpty(searchDTO.getKeyword())) {
            if (qInternalInterface.apiPath
                    .getMetadata()
                    .getName()
                    .equals(searchDTO.getSearchType())) {
                query.where(qInternalInterface.apiPath.contains(searchDTO.getKeyword()));
            } else if (qInternalInterface.apiName
                    .getMetadata()
                    .getName()
                    .equals(searchDTO.getSearchType())) {
                query.where(qInternalInterface.apiName.contains(searchDTO.getKeyword()));
            } else if (qInternalInterface.apiDesc
                    .getMetadata()
                    .getName()
                    .equals(searchDTO.getSearchType())) {
                query.where(qInternalInterface.apiDesc.contains(searchDTO.getKeyword()));
            } else {
                query.where(qInternalInterface.apiPath
                        .contains(searchDTO.getKeyword())
                        .or(qInternalInterface.apiName.contains(searchDTO.getKeyword()))
                        .or(qInternalInterface.apiDesc.contains(searchDTO.getKeyword())));
            }
        }
        // 삭제 안된것만 조회
        query.where(qInternalInterface.delYn.eq(MokaConstants.NO));

        // 페이징 처리 여부
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        /**
         * method도 apiType과 같이 코드에서 불러와야 하는데 코드와 코드명이 동일하기 때문에
         * 일단 조회하지 않는다.
         * 조인이 필요없는데 굳이 할 필요는 없다
         */
        QueryResults<InternalInterface> list = query
                .select(Projections.fields(InternalInterface.class, qInternalInterface.seqNo, qInternalInterface.apiName,
                        qInternalInterface.apiMethod, qInternalInterface.apiPath, qInternalInterface.apiType, qInternalInterface.apiDesc,
                        qInternalInterface.usedYn, ExpressionUtils.as(JPAExpressions
                                .select(qCodeMgt.cdNm)
                                .from(qCodeMgt)
                                .where(qCodeMgt.codeMgtGrp.grpCd
                                        .eq(TpsConstants.API_TYPE_CODE)
                                        .and(qCodeMgt.dtlCd.eq(qInternalInterface.apiType))), "apiTypeName")))
                .fetchResults();

        return new PageImpl<InternalInterface>(list.getResults(), pageable, list.getTotal());
    }
}
