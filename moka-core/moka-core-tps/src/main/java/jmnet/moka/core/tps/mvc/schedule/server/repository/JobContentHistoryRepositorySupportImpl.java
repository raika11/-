package jmnet.moka.core.tps.mvc.schedule.server.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Date;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentHistorySearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContentHistory;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QJobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QJobContentHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

public class JobContentHistoryRepositorySupportImpl extends TpsQueryDslRepositorySupport implements JobContentHistoryRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public JobContentHistoryRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(JobContentHistory.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<JobContentHistory> findJobContentHistoryList(JobContentHistorySearchDTO search, Pageable pageable) {
        QJobContentHistory jobContentHistory = QJobContentHistory.jobContentHistory;
        QJobContent jobContent = QJobContent.jobContent;

        BooleanBuilder builder = new BooleanBuilder();
        Date startDay = search.getStartDay();
        Date endDay = search.getEndDay();
        Long jobSeq = search.getJobSeq();
        String status = search.getStatus();
        String jobCd = search.getJobCd();

        if (startDay != null && endDay != null) {
            builder.and(jobContentHistory.reserveDt.between(startDay, endDay));
        }
        if (!McpString.isEmpty(jobSeq)) {
            builder.and(jobContent.jobSeq.eq(jobSeq));
        }
        if (!McpString.isEmpty(status)) {
            builder.and(jobContentHistory.status.eq(status));
        }
        if (!McpString.isEmpty(jobCd)) {
            builder.and(jobContent.jobCd.contains(jobCd));
        }

        JPQLQuery<JobContentHistory> query = queryFactory.selectFrom(jobContentHistory);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<JobContentHistory> list = query
                .leftJoin(jobContentHistory.jobContent, jobContent)
                .fetchJoin()
                .where(builder)
                .fetchResults();

        return new PageImpl<JobContentHistory>(list.getResults(), pageable, list.getTotal());
    }
}
