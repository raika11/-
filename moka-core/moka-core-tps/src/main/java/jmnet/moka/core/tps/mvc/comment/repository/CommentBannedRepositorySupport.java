package jmnet.moka.core.tps.mvc.comment.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentBannedType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.comment.repository
 * ClassName : CommentMemberRepositorySupport
 * Created : 2021-01-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-08 15:45
 */
public interface CommentBannedRepositorySupport {

    /**
     * 댓글 차단 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    Page<CommentBanned> findAllCommentBanned(CommentBannedSearchDTO searchDTO);

    /**
     * 댓글 차단 상세 조회
     *
     * @param seqNo 일련번호
     * @return 댓글 차단 정보
     */
    Optional<CommentBanned> findCommentBanned(Long seqNo);

    /**
     * 댓글 차단 상세 조회
     *
     * @param tagType  금지유형
     * @param tagValue 태그
     * @return 댓글 차단 정보
     */
    Optional<CommentBanned> findCommentBanned(CommentBannedType tagType, String tagValue);
}
