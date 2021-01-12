package jmnet.moka.core.tps.mvc.comment.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.comment.entity.Comment;
import jmnet.moka.core.tps.mvc.comment.entity.QComment;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.comment.repository
 * ClassName : CommentRepositorySupportImpl
 * Created : 2021-01-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-08 15:03
 */
public class CommentRepositorySupportImpl extends QuerydslRepositorySupport implements CommentRepositorySupport {

    public CommentRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Comment.class);
    }


    @Transactional
    @Override
    public long updateStatus(Long cmtSeq, CommentStatusType statusType) {
        QComment qComment = QComment.comment;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qComment.cmtSeq.eq(cmtSeq));
        return update(qComment)
                .where(builder)
                .set(qComment.status, statusType)
                .execute();
    }
}
