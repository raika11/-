package jmnet.moka.core.tps.mvc.comment.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.comment.dto.CommentDTO;
import jmnet.moka.core.tps.mvc.comment.dto.CommentSearchDTO;
import jmnet.moka.core.tps.mvc.comment.vo.CommentVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    private ActionLogger actionLogger;

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

        ResultDTO<ResultListDTO<CommentVO>> resultDto = new ResultDTO<>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 삭제
     *
     * @param commentDTO 등록할 댓글정보
     * @return 등록된 댓글정보
     */
    @ApiOperation(value = "댓글 삭제")
    @PostMapping("/{commentSeq}/{psn}")
    public ResponseEntity<?> deleteComment(
            @ApiParam("댓글 ID") @PathVariable("commentSeq") @Min(value = 1, message = "{comment.error.pattern.commentSeq}") Long commentSeq,
            @ApiParam("댓글 ID") @PathVariable("psn") @Min(value = 1, message = "{comment.error.pattern.psn}") Long psn, @Valid CommentDTO commentDTO,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws MokaException {

        ResultDTO<CommentDTO> resultDto = new ResultDTO<>(commentDTO, msg(""));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
