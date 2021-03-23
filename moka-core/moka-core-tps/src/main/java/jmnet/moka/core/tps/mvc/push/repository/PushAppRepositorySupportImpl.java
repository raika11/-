package jmnet.moka.core.tps.mvc.push.repository;

import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.CommonCode;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.codemgt.entity.QCodeSimple;
import jmnet.moka.core.tps.mvc.push.dto.PushAppSearchDTO;
import jmnet.moka.core.tps.mvc.push.entity.PushApp;
import jmnet.moka.core.tps.mvc.push.entity.QPushApp;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.push.repository
 * ClassName : PushAppRepositorySupportImpl
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 08:21
 */
public class PushAppRepositorySupportImpl extends TpsQueryDslRepositorySupport implements PushAppRepositorySupport {
    public PushAppRepositorySupportImpl() {
        super(PushApp.class);
    }

    @Override
    public List<PushApp> findAll(PushAppSearchDTO searchDTO) {
        QPushApp pushApp = QPushApp.pushApp;
        JPQLQuery<PushApp> query = from(pushApp);

        if (McpString.isNotEmpty(searchDTO.getAppOs())) {
            query.where(pushApp.appOs.eq(searchDTO.getAppOs()));
        }
        if (McpString.isNotEmpty(searchDTO.getAppOs())) {
            query.where(pushApp.devDiv.eq(searchDTO.getDevDiv()));
        }
        if (McpString.isNotEmpty(searchDTO.getAppDiv())) {
            query.where(pushApp.appDiv.eq(searchDTO.getAppDiv()));
        }

        return query.fetch();
    }

    @Override
    public List<Integer> findAllIds(PushAppSearchDTO searchDTO) {
        QPushApp pushApp = QPushApp.pushApp;
        JPQLQuery<PushApp> query = from(pushApp);

        if (McpString.isNotEmpty(searchDTO.getAppOs())) {
            query.where(pushApp.appOs.eq(searchDTO.getAppOs()));
        }
        if (McpString.isNotEmpty(searchDTO.getAppOs())) {
            query.where(pushApp.devDiv.eq(searchDTO.getDevDiv()));
        }
        if (McpString.isNotEmpty(searchDTO.getAppDiv())) {
            query.where(pushApp.appDiv.eq(searchDTO.getAppDiv()));
        }

        return query
                .select(pushApp.appSeq)
                .fetch();
    }

    @Override
    public List<CommonCode> findAllAppDiv() {
        QPushApp pushApp = QPushApp.pushApp;
        QCodeSimple codeSimple = QCodeSimple.codeSimple;
        JPQLQuery<PushApp> query = from(pushApp);

        List<CommonCode> appOsList = query
                .select(Projections.fields(CommonCode.class, pushApp.appDiv.as("code"), ExpressionUtils.as(JPAExpressions
                        .select(codeSimple.cdNm)
                        .from(codeSimple)
                        .where(codeSimple.dtlCd
                                .eq(pushApp.appDiv)
                                .and(codeSimple.grpCd.eq(MokaConstants.PUSH_APP_DIV))), "name")))
                .groupBy(pushApp.appDiv)
                .fetch();

        return appOsList;
    }

    @Override
    public List<CommonCode> findAllAppDevDiv(PushAppSearchDTO searchDTO) {
        QPushApp pushApp = QPushApp.pushApp;
        QCodeSimple codeSimple = QCodeSimple.codeSimple;
        JPQLQuery<PushApp> query = from(pushApp);

        List<CommonCode> appOsList = query
                .select(Projections.fields(CommonCode.class, pushApp.devDiv.as("code"), ExpressionUtils.as(JPAExpressions
                        .select(codeSimple.cdNm)
                        .from(codeSimple)
                        .where(codeSimple.dtlCd
                                .eq(pushApp.devDiv)
                                .and(codeSimple.grpCd.eq(MokaConstants.PUSH_APP_DEV_DIV))), "name")))
                .where(pushApp.appDiv.eq(searchDTO.getAppDiv()))
                .groupBy(pushApp.devDiv)
                .fetch();

        return appOsList;
    }

    @Override
    public List<CommonCode> findAllAppOsDiv(PushAppSearchDTO searchDTO) {
        QPushApp pushApp = QPushApp.pushApp;
        QCodeSimple codeSimple = QCodeSimple.codeSimple;
        JPQLQuery<PushApp> query = from(pushApp);

        List<CommonCode> appOsList = query
                .select(Projections.fields(CommonCode.class, pushApp.appOs.as("code"), ExpressionUtils.as(JPAExpressions
                        .select(codeSimple.cdNm)
                        .from(codeSimple)
                        .where(codeSimple.dtlCd
                                .eq(pushApp.appOs)
                                .and(codeSimple.grpCd.eq(MokaConstants.PUSH_APP_OS_DIV))), "name")))
                .where(pushApp.appDiv
                        .eq(searchDTO.getAppDiv())
                        .and(pushApp.devDiv.eq(searchDTO.getDevDiv())))
                .groupBy(pushApp.appOs)
                .fetch();

        return appOsList;
    }

}
