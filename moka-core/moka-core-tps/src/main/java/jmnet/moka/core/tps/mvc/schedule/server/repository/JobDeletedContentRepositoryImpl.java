package jmnet.moka.core.tps.mvc.schedule.server.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.member.entity.QMemberSimpleInfo;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobDeletedContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobDeletedContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QJobDeletedContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * 삭제된 작업 Repository
 * 2021. 2. 2. 김정민
 *
 */
public class JobDeletedContentRepositoryImpl extends TpsQueryDslRepositorySupport implements JobDeletedContentRepositorySupport{

    private final JPAQueryFactory queryFactory;

    public JobDeletedContentRepositoryImpl(JPAQueryFactory queryFactory) {
        super(JobDeletedContent.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<JobDeletedContent> findJobDeletedContentList(JobDeletedContentSearchDTO search, Pageable pageable) {
        QJobDeletedContent jobDeletedContent = QJobDeletedContent.jobDeletedContent;
        QMemberSimpleInfo memberSimpleInfo = QMemberSimpleInfo.memberSimpleInfo;

        BooleanBuilder builder = new BooleanBuilder();
        String category = search.getCategory();
        Long period = search.getPeriod();
        String sendType = search.getSendType();
        Long serverSeq = search.getServerSeq();

        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        if(!McpString.isEmpty(category)){
            builder.or(jobDeletedContent.category.eq(category));
        }
        if(!McpString.isEmpty(period)){
            builder.or(jobDeletedContent.period.eq(period));
        }
        if(!McpString.isEmpty(sendType)){
            builder.or(jobDeletedContent.sendType.eq(sendType));
        }
        if(!McpString.isEmpty(serverSeq)){
            builder.or(jobDeletedContent.serverSeq.eq(serverSeq));
        }


        JPQLQuery<JobDeletedContent> query = queryFactory.selectFrom(jobDeletedContent);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<JobDeletedContent> list = query
                .leftJoin(jobDeletedContent.regMember, memberSimpleInfo).fetchJoin()
                .where(builder)
                .fetchResults();

        return new PageImpl<JobDeletedContent>(list.getResults(), pageable, list.getTotal());
    }
}
