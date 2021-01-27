package jmnet.moka.core.tps.mvc.comment.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.article.repository.ArticleClickcntRepository;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentBannedType;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentDeleteType;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.Comment;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import jmnet.moka.core.tps.mvc.comment.entity.CommentUrl;
import jmnet.moka.core.tps.mvc.comment.mapper.CommentMapper;
import jmnet.moka.core.tps.mvc.comment.repository.CommentRepository;
import jmnet.moka.core.tps.mvc.comment.repository.CommentUrlRepository;
import jmnet.moka.core.tps.mvc.comment.vo.CommentVO;
import jmnet.moka.core.tps.mvc.reporter.repository.ReporterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.comment.service
 * ClassName : CommentServiceImpl
 * Created : 2021-01-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-08 14:19
 */
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;

    private final CommentRepository commentRepository;

    private final ReporterRepository reporterRepository;

    private final ArticleClickcntRepository articleClickcntRepository;

    private final CommentUrlRepository commentUrlRepository;

    private final CommentBannedService commentBannedService;

    public CommentServiceImpl(CommentMapper commentMapper, CommentRepository commentRepository, ReporterRepository reporterRepository,
            ArticleClickcntRepository articleClickcntRepository, CommentUrlRepository commentUrlRepository,
            CommentBannedService commentBannedService) {
        this.commentMapper = commentMapper;
        this.commentRepository = commentRepository;
        this.reporterRepository = reporterRepository;
        this.articleClickcntRepository = articleClickcntRepository;
        this.commentUrlRepository = commentUrlRepository;
        this.commentBannedService = commentBannedService;
    }

    @Override
    public List<CommentVO> findAllComment(CommentSearchDTO searchDTO) {
        return commentMapper.findAll(searchDTO);
    }

    @Override
    public Optional<Comment> findCommentBySeq(Long cmtSeq) {
        return commentRepository.findById(cmtSeq);
    }

    @Override
    @Transactional
    public long updateCommentStatus(Comment comment, CommentStatusType statusType) {
        long result = commentRepository.updateStatus(comment.getCmtSeq(), statusType);

        if (result > 0 && McpString.isNotEmpty(comment.getContentId())) {
            articleClickcntRepository.updateReplyCnt(Long.parseLong(comment.getContentId()), -1);
            reporterRepository.updateReplyCnt(comment.getContentId(), comment.getMemId(), -1);
        }

        return result;
    }

    @Override
    @Transactional
    public long updateCommentStatus(Comment comment, CommentStatusType statusType, CommentDeleteType deleteType) {
        if (deleteType.equals(CommentDeleteType.BNA) || deleteType.equals(CommentDeleteType.BNC)) { // 사용자 ID 차단 처리
            commentBannedService.insertCommentBanned(CommentBanned
                    .builder()
                    .tagType(CommentBannedType.U)
                    .tagValue(comment.getMemId())
                    .build());
        }
        long result = 0l;
        switch (deleteType) {
            case CMT:
            case BNC:
                result = commentRepository.updateStatus(comment.getCmtSeq(), statusType);
                if (result > 0 && McpString.isNotEmpty(comment.getContentId()) && statusType.equals(CommentStatusType.N)) {
                    articleClickcntRepository.updateReplyCnt(Long.parseLong(comment.getContentId()), -1);
                    reporterRepository.updateReplyCnt(comment.getContentId(), comment.getMemId(), -1);
                }
                break;
            case BNA:
            case ALL:
                // 해당 사용자 ID 차단 처리
                result = commentRepository.updateStatusByMemberId(comment.getMemId(), statusType);
                if (result > 0 && McpString.isNotEmpty(comment.getContentId()) && statusType.equals(CommentStatusType.N)) {
                    commentMapper.updateReplyCnt(CommentVO
                            .builder()
                            .status(statusType.getCode())
                            .memId(comment.getMemId())
                            .memSite(comment.getMemSite())
                            .build());
                }
                break;
            default:
                // 처리 할 프로세스 없음
        }

        return result;
    }

    @Override
    public List<CommentUrl> findAllCommentUrl() {
        return commentUrlRepository.findAllByUsedYn(MokaConstants.YES);
    }
}
