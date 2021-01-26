package jmnet.moka.core.tps.mvc.comment.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.Comment;
import jmnet.moka.core.tps.mvc.comment.entity.CommentUrl;
import jmnet.moka.core.tps.mvc.comment.service.CommentService;
import jmnet.moka.core.tps.mvc.comment.vo.CommentVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.comment.mvc.comment.controller
 * ClassName : CommentRestController
 * Created : 2020-12-29 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-29 13:33
 */
@Slf4j
@RestController
@RequestMapping("/api/comments")
@Api(tags = {"댓글 API"})
public class CommentRestController extends AbstractCommonController {


    @Autowired
    private CommentService commentService;

    @Autowired
    private CodeMgtService codeMgtService;

    /**
     * 댓글 URL 목록조회
     *
     * @return 댓글 URL 목록
     */
    @ApiOperation(value = "댓글 매체 목록 조회")
    @GetMapping("/urls")
    public ResponseEntity<?> getCommentUrlList() {

        ResultMapDTO resultMapDTO = new ResultMapDTO();

        List<CommentUrl> commentUrlList = commentService.findAllCommentUrl();

        resultMapDTO.addBodyAttribute(TpsConstants.COMMENT_URL, commentUrlList);
        resultMapDTO.addBodyAttribute(TpsConstants.COMMENT_SITE_CODE, codeMgtService.findUseSimpleList(TpsConstants.COMMENT_SITE_CODE));
        resultMapDTO.addBodyAttribute(TpsConstants.COMMENT_TAG_DIV_CODE, codeMgtService.findUseSimpleList(TpsConstants.COMMENT_TAG_DIV_CODE));

        return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
    }

    /**
     * 댓글목록조회
     *
     * @param search 검색조건
     * @return 댓글목록
     */
    @ApiOperation(value = "댓글 목록 조회")
    @GetMapping
    public ResponseEntity<?> getCommentList(@SearchParam CommentSearchDTO search) {

        ResultListDTO<CommentVO> resultListMessage = new ResultListDTO<>();

        List<CommentVO> commentList = commentService.findAllComment(search);

        resultListMessage.setTotalCnt(search.getTotal());
        resultListMessage.setList(commentList);

        ResultDTO<ResultListDTO<CommentVO>> resultDto = new ResultDTO<>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 삭제
     *
     * @param cmtSeq 등록할 댓글정보
     * @return 등록된 댓글정보
     */
    @ApiOperation(value = "댓글 삭제")
    @DeleteMapping("/{cmtSeq}")
    public ResponseEntity<?> deleteComment(
            @ApiParam("댓글 ID") @PathVariable("cmtSeq") @Min(value = 1, message = "{comment.error.pattern.cmtSeq}") Long cmtSeq,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws MokaException, NoDataException {

        Comment comment = commentService
                .findCommentBySeq(cmtSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        long result = commentService.updateCommentStatus(comment, CommentStatusType.N);

        ResultDTO<Long> resultDto = new ResultDTO<>(result, msg("tps.common.success.delete"));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
