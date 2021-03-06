/**
 * msp-tps ReservedRepositorySupportImpl.java 2020. 6. 17. 오전 11:32:58 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.comment.entity.Comment;
import jmnet.moka.core.tps.mvc.comment.entity.QComment;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.QReporter;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 17. 오전 11:32:58
 */
public class ReporterRepositorySupportImpl extends TpsQueryDslRepositorySupport implements ReporterRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ReporterRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Reporter.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Reporter> findList(ReporterSearchDTO search, Pageable pageable) {
        QReporter reporter = QReporter.reporter;
        //        QCodeMgt codeMgt = QCodeMgt.codeMgt;
        //        String r1Cd = "R1";
        //        String r2Cd = "R2";
        //        String r3Cd = "R3";
        //        String r4Cd = "R4";

        BooleanBuilder builder = new BooleanBuilder();
        String keyword = search.getKeyword();

        // WHERE 조건
        if (!McpString.isEmpty(keyword)) {
            builder.and(reporter.repName.contains(keyword));
            //                    .and(reporter.r1Cd.contains(r1Cd))
            //                    .and(reporter.r2Cd.contains(r2Cd))
            //                    .and(reporter.r3Cd.contains(r3Cd))
            //                    .and(reporter.r4Cd.contains(r4Cd));
        }

        JPQLQuery<Reporter> query = queryFactory.selectFrom(reporter);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Reporter> list = query
                .where(builder)
                .fetchResults();

        return new PageImpl<Reporter>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    public long updateReplyCnt(String regSeq, String regId, int cnt) {
        QReporter qReporter = QReporter.reporter;
        QComment qComment = QComment.comment;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qReporter.repSeq.eq(regSeq));

        JPQLQuery<Comment> query = queryFactory.selectFrom(qComment);
        Comment comment = query
                .where(qComment.contentId.eq(regSeq)
                                         /*.and(qComment.urlSeq.eq(5))*/
                                         .and(qComment.status.eq(CommentStatusType.A))
                                         .and(qComment.memId.ne(regId)))
                .orderBy(qComment.cmtSeq.desc())
                .fetchFirst();

        return update(qReporter)
                .set(qReporter.replyCnt, qReporter.replyCnt.add(cnt))
                .set(qReporter.userTalk, comment != null ? comment.getCont() : null)
                .where(builder)
                .execute();
    }
}
