package jmnet.moka.core.tps.mvc.comment.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeSimple;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import jmnet.moka.core.tps.mvc.comment.repository.CommentBannedRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.comment.service
 * ClassName : CommentBannedServiceImpl
 * Created : 2021-01-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-08 15:43
 */
@Service
public class CommentBannedServiceImpl implements CommentBannedService {

    private final CommentBannedRepository commentBannedRepository;

    private final CodeMgtService codeMgtService;

    public CommentBannedServiceImpl(CommentBannedRepository commentBannedRepository, CodeMgtService codeMgtService) {
        this.commentBannedRepository = commentBannedRepository;
        this.codeMgtService = codeMgtService;
    }

    @Override
    public Page<CommentBanned> findAllCommentBanned(CommentBannedSearchDTO searchDTO) {
        return commentBannedRepository.findAllCommentBanned(searchDTO);
    }

    @Override
    public Optional<CommentBanned> findCommentBannedBySeq(Long seqNo) {
        return commentBannedRepository.findCommentBanned(seqNo);
    }

    @Override
    public CommentBanned insertCommentBanned(CommentBanned commentBanned) {
        return saveCommentBanned(commentBanned);
    }

    @Override
    public CommentBanned updateCommentBanned(CommentBanned commentBanned) {
        return saveCommentBanned(commentBanned);
    }

    private CommentBanned saveCommentBanned(CommentBanned commentBanned) {
        CommentBanned currentCommentBanned = commentBannedRepository.save(commentBanned);
        if (McpString.isNotEmpty(currentCommentBanned.getTagDiv())) {
            List<CodeMgt> codes = codeMgtService.findByDtlCd(TpsConstants.CMT_TAG_DIV, currentCommentBanned.getTagDiv());
            if (codes != null && codes.size() > 0) {
                currentCommentBanned.setTagDivCode(CodeSimple
                        .builder()
                        .cdNm(codes
                                .get(0)
                                .getCdNm())
                        .dtlCd(codes
                                .get(0)
                                .getDtlCd())
                        .grpCd(codes
                                .get(0)
                                .getCodeMgtGrp()
                                .getGrpCd())
                        .usedYn(codes
                                .get(0)
                                .getUsedYn())
                        .build());
            }
        }
        return currentCommentBanned;
    }

    @Override
    public void deleteCommentBanned(Long seqNo) {
        commentBannedRepository.deleteById(seqNo);
    }

    @Override
    public void deleteCommentBanned(CommentBanned commentBanned) {
        commentBannedRepository.delete(commentBanned);
    }
}
