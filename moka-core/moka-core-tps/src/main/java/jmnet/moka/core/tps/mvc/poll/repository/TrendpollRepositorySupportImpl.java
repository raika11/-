package jmnet.moka.core.tps.mvc.poll.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import java.util.List;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.member.entity.QMemberInfo;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollSearchDTO;
import jmnet.moka.core.tps.mvc.poll.entity.QTrendpoll;
import jmnet.moka.core.tps.mvc.poll.entity.QTrendpollItem;
import jmnet.moka.core.tps.mvc.poll.entity.QTrendpollRelate;
import jmnet.moka.core.tps.mvc.poll.entity.Trendpoll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.repository
 * ClassName : TrendpollRepositorySupportImpl
 * Created : 2021-01-13 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-13 11:28
 */
public class TrendpollRepositorySupportImpl extends QuerydslRepositorySupport implements TrendpollRepositorySupport {

    public TrendpollRepositorySupportImpl() {
        super(Trendpoll.class);
    }

    @Override
    public Page<Trendpoll> findAllTrendpoll(TrendpollSearchDTO searchDTO) {
        Pageable pageable = searchDTO.getPageable();
        QTrendpoll qTrendpoll = QTrendpoll.trendpoll;
        QTrendpollItem qTrendpollItem = QTrendpollItem.trendpollItem;

        QMemberInfo qRegMember = new QMemberInfo("regMember");
        QMemberInfo qModMember = new QMemberInfo("modMember");

        JPQLQuery<Trendpoll> query = from(qTrendpoll);

        if (McpString.isNotEmpty(searchDTO.getPollGroup())) {
            query.where(qTrendpoll.pollGroup.eq(searchDTO.getPollGroup()));
        }

        if (McpString.isNotEmpty(searchDTO.getPollDiv())) {
            query.where(qTrendpoll.pollDiv.eq(searchDTO.getPollDiv()));
        }

        if (McpString.isNotEmpty(searchDTO.getPollType())) {
            query.where(qTrendpoll.pollType.eq(searchDTO.getPollType()));
        }

        if (searchDTO.getStatus() != null && searchDTO.getStatus().length > 0) {
            query.where(qTrendpoll.status.in(searchDTO.getStatus()));
        }

        if (McpString.isNotEmpty(searchDTO.getPollCategory())) {
            query.where(qTrendpoll.pollCategory.eq(searchDTO.getPollCategory()));
        }

        if (McpString.isNotEmpty(searchDTO.getStartDt())) {
            query.where(qTrendpoll.startDt.goe(McpDate.dateStr(searchDTO.getStartDt(), "yyyy-MM-dd")));
        }

        if (McpString.isNotEmpty(searchDTO.getEndDt())) {
            query.where(qTrendpoll.endDt.loe(McpDate.dateStr(searchDTO.getEndDt(), "yyyy-MM-dd")));
        }

        if (McpString.isNotEmpty(searchDTO.getKeyword())) {
            if (qTrendpoll.title
                    .getMetadata()
                    .getName()
                    .equals(searchDTO.getSearchType())) {
                query.where(qTrendpoll.title.contains(searchDTO.getKeyword()));
            } else {
                if (qTrendpoll.pollSeq
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qTrendpoll.pollSeq.eq(Long.parseLong(searchDTO.getKeyword())));
                } else if (searchDTO
                        .getSearchType()
                        .equals("itemTitle")) {
                    query.where(qTrendpoll.pollSeq.in(JPAExpressions
                            .selectFrom(qTrendpollItem)
                            .select(qTrendpollItem.pollSeq)
                            .where(qTrendpollItem.title.contains(searchDTO.getKeyword()))));
                } else {
                    // 검색 조건 없음
                }
            }
        }

        // 삭제가 아닌 경우 노출
        //query.where(qTrendpoll.status.ne(PollStatusCode.D));

        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }



        QueryResults<Trendpoll> list = query
                .leftJoin(qTrendpoll.regMember, qRegMember)
                .leftJoin(qTrendpoll.modMember, qModMember)
                .fetchResults();

        return new PageImpl<Trendpoll>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    @Transactional
    public long updateTrendpollStatus(Long pollSeq, PollStatusCode status) {
        QTrendpoll trendpoll = QTrendpoll.trendpoll;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(trendpoll.pollSeq.eq(pollSeq));
        return update(trendpoll)
                .set(trendpoll.status, status)
                .where(builder)
                .execute();
    }

    @Override
    @Transactional
    public long deleteItemByPollSeq(Long pollSeq, List<Long> exceptSeqs) {
        QTrendpollItem trendpollItem = QTrendpollItem.trendpollItem;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(trendpollItem.pollSeq.eq(pollSeq));
        builder.and(trendpollItem.itemSeq.notIn(exceptSeqs));
        return delete(trendpollItem)
                .where(builder)
                .execute();
    }

    @Override
    @Transactional
    public long deleteContentsByPollSeq(Long pollSeq, List<Long> exceptSeqs) {
        QTrendpollRelate trendpollRelate = QTrendpollRelate.trendpollRelate;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(trendpollRelate.pollSeq.eq(pollSeq));
        builder.and(trendpollRelate.seqNo.notIn(exceptSeqs));
        return delete(trendpollRelate)
                .where(builder)
                .execute();
    }
}
