package jmnet.moka.core.tps.mvc.schedule.server.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobStatisticSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatistic;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QDistributeServerSimple;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QJobStatistic;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QJobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * 작업 실행상태 Repository 2021. 2. 3. 김정민
 */
public class JobStatisticRepositorySupportImpl extends TpsQueryDslRepositorySupport implements JobStatisticRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public JobStatisticRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(JobStatistic.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<JobStatistic> findJobStatisticList(JobStatisticSearchDTO search, Pageable pageable) {
        QJobStatistic jobStatistic = QJobStatistic.jobStatistic;
        QDistributeServerSimple distributeServerSimple = QDistributeServerSimple.distributeServerSimple;
        QJobStatus jobStatus = QJobStatus.jobStatus;


        BooleanBuilder builder = new BooleanBuilder();
        String category = search.getCategory();
        Long period = search.getPeriod();
        String sendType = search.getSendType();
        Long serverSeq = search.getServerSeq();
        Long genResult = search.getGenResult();

        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        if (!McpString.isEmpty(category)) {
            builder.or(jobStatistic.category.eq(category));
        }
        if (!McpString.isEmpty(period)) {
            builder.or(jobStatistic.period.eq(period));
        }
        if (!McpString.isEmpty(sendType)) {
            builder.or(jobStatistic.sendType.eq(sendType));
        }
        if (!McpString.isEmpty(serverSeq)) {
            builder.or(jobStatistic.serverSeq.eq(serverSeq));
        }
        if (!McpString.isEmpty(genResult)) {
            builder.or(jobStatus.genResult.eq(genResult));
        }
        if (!McpString.isEmpty(keyword)) {
            if (!McpString.isEmpty(searchType) && searchType.equals("keyword0")) {
                builder.and(jobStatistic.pkgNm
                        .contains(keyword)
                        .or(jobStatistic.targetPath
                                .contains(keyword)
                                .or(jobStatistic.jobDesc.contains(keyword))));

            } else if (!McpString.isEmpty(searchType) && searchType.equals("keyword1")) {
                builder.and(jobStatistic.pkgNm.contains(keyword));
            } else if (!McpString.isEmpty(searchType) && searchType.equals("keyword2")) {
                builder.and(jobStatistic.targetPath.contains(keyword));
            } else if (!McpString.isEmpty(searchType) && searchType.equals("keyword3")) {
                builder.and(jobStatistic.jobDesc.contains(keyword));
            }

        }

        //TB_GEN_TARGET.SERVER_SEQ = 0 인 데이터는 미존재로 조회불가
        builder.and(jobStatistic.serverSeq.ne(0L)); //SERVER_SEQ = 0은 PK값이 NULL인 데이터로 간주하여 조회 제외

        JPQLQuery<JobStatistic> query = queryFactory.selectFrom(jobStatistic);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<JobStatistic> list = query
                .leftJoin(jobStatistic.distributeServerSimple, distributeServerSimple)
                .fetchJoin()
                .leftJoin(jobStatistic.jobStatus, jobStatus)
                .fetchJoin()
                .where(builder)
                .fetchResults();

        return new PageImpl<JobStatistic>(list.getResults(), pageable, list.getTotal());
    }
}
