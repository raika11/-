package jmnet.moka.core.tps.mvc.comment.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.comment.service
 * ClassName : CommentBannedService
 * Created : 2021-01-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-08 15:39
 */
public interface CommentBannedService {

    Page<CommentBanned> findAllCommentBanned(CommentBannedSearchDTO searchDTO);

    Optional<CommentBanned> findCommentBannedBySeq(Long seqNo);

    CommentBanned insertCommentBanned(CommentBanned commentBanned);

    CommentBanned updateCommentBanned(CommentBanned commentBanned);

    void deleteCommentBanned(Long seqNo);

    void deleteCommentBanned(CommentBanned commentBanned);

}
