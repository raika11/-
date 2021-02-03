package jmnet.moka.core.tps.mvc.comment.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentDeleteType;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentOrderType;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.Comment;
import jmnet.moka.core.tps.mvc.comment.service.CommentBannedService;
import jmnet.moka.core.tps.mvc.comment.service.CommentService;
import jmnet.moka.core.tps.mvc.comment.vo.CommentVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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


    private final CommentService commentService;

    private final CommentBannedService commentBannedService;

    private final CodeMgtService codeMgtService;

    public CommentRestController(CommentService commentService, CommentBannedService commentBannedService, CodeMgtService codeMgtService) {
        this.commentService = commentService;
        this.commentBannedService = commentBannedService;
        this.codeMgtService = codeMgtService;
    }

    /**
     * 댓글 화면 초기 설정 정보 조회
     *
     * @return 댓글 URL 목록
     */
    @ApiOperation(value = "댓글 화면 초기 설정 정보 조회")
    @GetMapping("/init")
    public ResponseEntity<?> getCommentInitInfo() {

        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);

        // 댓글 매체 코드 목록
        resultMapDTO.addBodyAttribute("COMMENT_MEDIA_CODE", codeMgtService.findUseSimpleList(TpsConstants.COMMENT_MEDIA_CODE));

        // 댓글 회원 사이트 코드 목록
        resultMapDTO.addBodyAttribute("COMMENT_SITE_CODE", codeMgtService.findUseSimpleList(TpsConstants.COMMENT_SITE_CODE));

        // 차단 유형 코드 목록
        resultMapDTO.addBodyAttribute("COMMENT_TAG_DIV_CODE", codeMgtService.findUseSimpleList(TpsConstants.COMMENT_TAG_DIV_CODE));

        // 댓글 상태 구분
        resultMapDTO.addBodyAttribute("COMMENT_STATUS_CODE", CommentStatusType.toList());

        // 댓글 정렬 구분
        resultMapDTO.addBodyAttribute("COMMENT_ORDER_CODE", CommentOrderType.toList());

        // 삭제 커맨드 유형 구분
        resultMapDTO.addBodyAttribute("COMMENT_DELETE_CODE", CommentDeleteType.toList());


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
    @ApiOperation(value = "댓글 상태 변경")
    @DeleteMapping("/{cmtSeq}/status")
    public ResponseEntity<?> putComment(
            @ApiParam("댓글 ID") @PathVariable("cmtSeq") @Min(value = 1, message = "{comment.error.pattern.cmtSeq}") Long cmtSeq,
            @ApiParam("댓글 상태 유형") @RequestParam(value = "statusType") CommentStatusType statusType,
            @ApiParam("삭제 유형, 댓글하나 : CMT,사용자 댓글 모두 : ALL, 사용자 차단과 해당 댓글 삭제 : BNC, 사용자 차단과 해당 댓글 삭제 : BNA")
            @RequestParam(value = "deleteType", required = false) CommentDeleteType deleteType)
            throws InvalidDataException, NoDataException {

        Comment comment = commentService
                .findCommentBySeq(cmtSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        if (comment
                .getStatus()
                .equals(CommentStatusType.D) && statusType.equals(CommentStatusType.A)) { // 사용자가 삭제한 댓글은 복구 불가
            throw new InvalidDataException("tps.comment-error.user-delete");
        }

        // 삭제 처리인 경우에는 삭제 유형 파라미터 체크
        if (statusType.equals(CommentStatusType.N)) {
            if (deleteType == null) {
                throw new InvalidDataException("tps.comment-banned.error.notnull.deleteType");
            }
        }
        long result = commentService.updateCommentStatus(comment, statusType, deleteType);
        String msg = "";
        if (result > 0) {

            if (statusType.equals(CommentStatusType.N)) {
                switch (deleteType) {
                    case BNA:
                    case BNC:
                        msg = msg("tps.comment-banned.success.id");
                        break;
                    case ALL:
                        msg = msg("tps.comment.success.delete-all");
                        break;
                    default:
                        msg = msg("tps.comment-banned.success.id");
                }

            } else {
                msg = msg("tps.comment.success.status-" + statusType.getCode());
            }
        } else {
            msg = msg("tps.comment.error.status-" + statusType.getCode());
        }


        ResultDTO<Long> resultDto = new ResultDTO<>(result, msg);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
