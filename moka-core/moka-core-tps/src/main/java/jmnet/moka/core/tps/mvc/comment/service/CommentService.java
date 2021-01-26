package jmnet.moka.core.tps.mvc.comment.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.Comment;
import jmnet.moka.core.tps.mvc.comment.entity.CommentUrl;
import jmnet.moka.core.tps.mvc.comment.vo.CommentVO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.comment.service
 * ClassName : CommentService
 * Created : 2021-01-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-08 14:18
 */
public interface CommentService {

    /**
     * 댓글 목록 조회
     *
     * @param searchDTO 댓글 검색 조건
     * @return 댓글 목록
     */
    List<CommentVO> findAllComment(CommentSearchDTO searchDTO);

    /**
     * 댓글 상세 조회
     *
     * @param cmtSeq 댓글 일련번호
     * @return 댓글 목록
     */
    Optional<Comment> findCommentBySeq(Long cmtSeq);

    /**
     * 댓글 상태 변경
     *
     * @param comment    댓글 정보
     * @param statusType 상태코드
     * @return 변경 여부
     */
    long updateCommentStatus(Comment comment, CommentStatusType statusType);


    /**
     * 사용중인 댓글 URL 전체 목록 조회
     *
     * @return 댓글 목록
     */
    List<CommentUrl> findAllCommentUrl();
}
