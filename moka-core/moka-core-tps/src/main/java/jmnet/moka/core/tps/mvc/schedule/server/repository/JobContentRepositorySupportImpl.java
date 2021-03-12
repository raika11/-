package jmnet.moka.core.tps.mvc.schedule.server.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.member.entity.QMemberSimpleInfo;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QJobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.QJobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

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
        String delYn = search.getDelYn();
        String category = search.getCategory();
        Long period = search.getPeriod();
        String sendType = search.getSendType();
        Long serverSeq = search.getServerSeq();
        String usedYn = search.getUsedYn();

        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        if(!McpString.isEmpty(delYn)){
            builder.and(jobContent.delYn.eq(delYn));
        }
        else{
            builder.and(jobContent.delYn.eq(MokaConstants.NO));
        }

        if(!McpString.isEmpty(category)){
            builder.and(jobContent.category.eq(category));
        }
        if(!McpString.isEmpty(period)){
            builder.and(jobContent.period.eq(period));
        }
        if(!McpString.isEmpty(sendType)){
            builder.and(jobContent.sendType.eq(sendType));
        }
        if(!McpString.isEmpty(serverSeq)){
            builder.and(jobContent.serverSeq.eq(serverSeq));
        }
        if(!McpString.isEmpty(usedYn)){
            builder.and(jobContent.usedYn.eq(usedYn));
        }
        if(!McpString.isEmpty(keyword)){
            if(!McpString.isEmpty(searchType) && searchType.equals("keyword1")){
                builder.and(jobContent.pkgNm.contains(keyword));
            }
            else if(!McpString.isEmpty(searchType) && searchType.equals("keyword2")){
                builder.and(jobContent.targetPath.contains(keyword));
            }
            else if(!McpString.isEmpty(searchType) && searchType.equals("keyword3")){
                builder.and(jobContent.jobDesc.contains(keyword));
            }

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

    @Override
    public Optional<JobContent> findJobContent(JobContentSearchDTO search) {
        QJobContent jobContent = QJobContent.jobContent;
        BooleanBuilder builder = new BooleanBuilder();

        if(!McpString.isEmpty(search.getPeriod())) {
            builder.and(jobContent.period.eq(search.getPeriod()));
        }
        if(!McpString.isEmpty(search.getServerSeq())) {
            builder.and(jobContent.serverSeq.eq(search.getServerSeq()));
        }
        if(!McpString.isEmpty(search.getCallUrl())) {
            builder.and(jobContent.callUrl.eq(search.getCallUrl()));
        }

        JPQLQuery<JobContent> query = queryFactory.selectFrom(jobContent)
                .where(builder);

        return Optional.ofNullable(query.fetchFirst());
    }

}
