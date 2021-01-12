package jmnet.moka.core.tps.mvc.comment.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.article.repository.ArticleClickcntRepository;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.Comment;
import jmnet.moka.core.tps.mvc.comment.mapper.CommentMapper;
import jmnet.moka.core.tps.mvc.comment.repository.CommentRepository;
import jmnet.moka.core.tps.mvc.comment.vo.CommentVO;
import jmnet.moka.core.tps.mvc.reporter.repository.ReporterRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ReporterRepository reporterRepository;

    @Autowired
    private ArticleClickcntRepository articleClickcntRepository;

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
}
