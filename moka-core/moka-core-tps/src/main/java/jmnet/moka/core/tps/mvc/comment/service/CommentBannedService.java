package jmnet.moka.core.tps.mvc.comment.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentBannedType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBannedHist;
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

    List<CommentBannedHist> findAllCommentBannedHistoryBySeq(Long seqNo);

    Optional<CommentBanned> findCommentBannedBySeq(Long seqNo);

    Optional<CommentBanned> findAllCommentBannedByTagValue(CommentBannedType tagType, String tagValue);

    CommentBanned insertCommentBanned(CommentBanned commentBanned);

    CommentBanned updateCommentBanned(CommentBanned commentBanned);

    void deleteCommentBanned(Long seqNo);

    void deleteCommentBanned(CommentBanned commentBanned);

}
