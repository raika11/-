package jmnet.moka.core.tps.mvc.comment.repository;

import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.comment.repository
 * ClassName : CommentRepositorySupport
 * Created : 2021-01-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-08 15:03
 */
public interface CommentRepositorySupport {

    long updateStatus(Long cmtSeq, CommentStatusType statusType);

}
