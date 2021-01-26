package jmnet.moka.core.tps.mvc.comment.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.article.repository.ArticleClickcntRepository;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.Comment;
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

    public CommentServiceImpl(CommentMapper commentMapper, CommentRepository commentRepository, ReporterRepository reporterRepository,
            ArticleClickcntRepository articleClickcntRepository, CommentUrlRepository commentUrlRepository) {
        this.commentMapper = commentMapper;
        this.commentRepository = commentRepository;
        this.reporterRepository = reporterRepository;
        this.articleClickcntRepository = articleClickcntRepository;
        this.commentUrlRepository = commentUrlRepository;
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
    public List<CommentUrl> findAllCommentUrl() {
        return commentUrlRepository.findAllByUsedYn(MokaConstants.YES);
    }
}
