package jmnet.moka.core.tps.mvc.schedule.server.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.member.entity.QMemberSimpleInfo;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QJobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QJobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * 작업 Repository
 * 2021. 2. 1. 김정민
 *
 */
public class JobContentRepositorySupportImpl extends TpsQueryDslRepositorySupport implements JobContentRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public JobContentRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(JobContent.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<JobContent> findJobContentList(JobContentSearchDTO search, Pageable pageable) {
        QJobContent jobContent = QJobContent.jobContent;
        QJobStatus jobStatus = QJobStatus.jobStatus;
        QMemberSimpleInfo memberSimpleInfo = QMemberSimpleInfo.memberSimpleInfo;

        BooleanBuilder builder = new BooleanBuilder();
        String category = search.getCategory();
        Long period = search.getPeriod();
        String sendType = search.getSendType();
        Long serverSeq = search.getServerSeq();
        String usedYn = search.getUsedYn();

        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        if(!McpString.isEmpty(category)){
            builder.or(jobContent.category.eq(category));
        }
        if(!McpString.isEmpty(period)){
            builder.or(jobContent.period.eq(period));
        }
        if(!McpString.isEmpty(sendType)){
            builder.or(jobContent.sendType.eq(sendType));
        }
        if(!McpString.isEmpty(serverSeq)){
            builder.or(jobContent.serverSeq.eq(serverSeq));
        }
        if(!McpString.isEmpty(usedYn)){
            builder.or(jobContent.usedYn.eq(usedYn));
        }

        JPQLQuery<JobContent> query = queryFactory.selectFrom(jobContent);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<JobContent> list = query
                .leftJoin(jobContent.jobStatus, jobStatus).fetchJoin()
                .leftJoin(jobContent.regMember, memberSimpleInfo).fetchJoin()
                .leftJoin(jobContent.modMember, memberSimpleInfo).fetchJoin()
                .where(builder)
                .fetchResults();

        return new PageImpl<JobContent>(list.getResults(), pageable, list.getTotal());
    }

}
