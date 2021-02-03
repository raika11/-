package jmnet.moka.core.tps.mvc.schedule.server.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.member.entity.QMemberSimpleInfo;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 배포서버 Repository
 * 2021. 1. 26. 김정민
 *
 */
public class DistributeServerRepositorySupportImpl extends TpsQueryDslRepositorySupport implements DistributeServerRepositorySupport{

    private final JPAQueryFactory queryFactory;

    public DistributeServerRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(DistributeServer.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<DistributeServer> findDistibuteServerCodeList() {
        QDistributeServer distributeServer = QDistributeServer.distributeServer;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(distributeServer.delYn.eq(MokaConstants.NO));

        JPQLQuery<DistributeServer> query = queryFactory.selectFrom(distributeServer);

        return query
                .where(builder)
                .fetch();
    }

    @Override
    public Page<DistributeServer> findDistibuteServerList(DistributeServerSearchDTO search, Pageable pageable){
        QDistributeServer distributeServer = QDistributeServer.distributeServer;
        QMemberSimpleInfo memberSimpleInfo = QMemberSimpleInfo.memberSimpleInfo;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(distributeServer.delYn.eq(MokaConstants.NO));
        
        String serverNm = search.getServerNm();
        String serverIp = search.getServerIp();

        if(!McpString.isEmpty(serverNm)){
            builder.or(distributeServer.serverNm.contains(serverNm));
        }
        if(!McpString.isEmpty(serverIp)){
            builder.or(distributeServer.serverIp.contains(serverIp));
        }

        JPQLQuery<DistributeServer> query = queryFactory.selectFrom(distributeServer);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<DistributeServer> list = query
                .leftJoin(distributeServer.regMember, memberSimpleInfo)
                .leftJoin(distributeServer.modMember, memberSimpleInfo)
                .where(builder)
                //.orderBy(distributeServer.serverSeq.desc())
                .fetchResults();

        return new PageImpl<DistributeServer>(list.getResults(), pageable, list.getTotal());

    }





    //not formal
    @Override
    public Page<DistributeServerDTO> findList2(DistributeServerSearchDTO search, Pageable pageable) {
        QDistributeServer distributeServer = QDistributeServer.distributeServer;
        QMemberSimpleInfo memberSimpleInfo = QMemberSimpleInfo.memberSimpleInfo;

        BooleanBuilder builder = new BooleanBuilder();

        String serverNm = search.getServerNm();
        String serverIp = search.getServerIp();

        if(!McpString.isEmpty(serverNm)){
            builder.and(distributeServer.serverNm.contains(serverNm));
        }
        if(!McpString.isEmpty(serverIp)){
            builder.and(distributeServer.serverIp.contains(serverIp));
        }
        builder.and(distributeServer.regId.eq(memberSimpleInfo.memberId));

        JPQLQuery query = queryFactory
                .select(
                        distributeServer.serverSeq,
                        distributeServer.serverIp,
                        distributeServer.serverNm,
                        distributeServer.delYn,
                        distributeServer.accessId,
                        distributeServer.regId,
                        distributeServer.regDt,
                        distributeServer.modId,
                        distributeServer.modDt,
                        memberSimpleInfo.memberNm
                )
                .from(distributeServer, memberSimpleInfo)
                //.leftJoin(distributeServer.member, member)
                .where(builder);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<DistributeServerDTO> list = query.fetchResults();

        return new PageImpl<DistributeServerDTO>(list.getResults(), pageable, list.getTotal());
    }
}
