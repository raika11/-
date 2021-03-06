package jmnet.moka.core.tps.mvc.comment.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import java.util.Optional;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentBannedType;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentDeleteType;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentOrderType;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.Comment;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
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
@Api(tags = {"?????? API"})
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
     * ?????? ?????? ?????? ?????? ?????? ??????
     *
     * @return ?????? URL ??????
     */
    @ApiOperation(value = "?????? ?????? ?????? ?????? ?????? ??????")
    @GetMapping("/init")
    public ResponseEntity<?> getCommentInitInfo() {

        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);

        // ?????? ?????? ?????? ??????
        resultMapDTO.addBodyAttribute("COMMENT_MEDIA_CODE", codeMgtService.findUseSimpleList(TpsConstants.COMMENT_MEDIA_CODE));

        // ?????? ?????? ????????? ?????? ??????
        resultMapDTO.addBodyAttribute("COMMENT_SITE_CODE", codeMgtService.findUseSimpleList(TpsConstants.COMMENT_SITE_CODE));

        // ?????? ?????? ?????? ??????
        resultMapDTO.addBodyAttribute("COMMENT_TAG_DIV_CODE", codeMgtService.findUseSimpleList(TpsConstants.COMMENT_TAG_DIV_CODE));

        // ?????? ?????? ??????
        resultMapDTO.addBodyAttribute("COMMENT_STATUS_CODE", CommentStatusType.toList());

        // ?????? ?????? ??????
        resultMapDTO.addBodyAttribute("COMMENT_ORDER_CODE", CommentOrderType.toList());

        // ?????? ????????? ?????? ??????
        resultMapDTO.addBodyAttribute("COMMENT_DELETE_CODE", CommentDeleteType.toList());


        return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
    }

    /**
     * ??????????????????
     *
     * @param search ????????????
     * @return ????????????
     */
    @ApiOperation(value = "?????? ?????? ??????")
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
     * ??????
     *
     * @param cmtSeq ????????? ????????????
     * @return ????????? ????????????
     */
    @ApiOperation(value = "?????? ?????? ??????")
    @DeleteMapping("/{cmtSeq}/status")
    public ResponseEntity<?> putComment(
            @ApiParam("?????? ID") @PathVariable("cmtSeq") @Min(value = 1, message = "{comment.error.pattern.cmtSeq}") Long cmtSeq,
            @ApiParam("?????? ?????? ??????") @RequestParam(value = "statusType") CommentStatusType statusType,
            @ApiParam("?????? ??????, ???????????? : CMT, ????????? ?????? ?????? : ALL, ????????? ID?????? ??? ?????? ?????? ?????? : BNC, ????????? ID?????? ??? ?????? ?????? ?????? ?????? : BNA")
            @RequestParam(value = "deleteType", required = false) CommentDeleteType deleteType)
            throws InvalidDataException, NoDataException {

        Comment comment = commentService
                .findCommentBySeq(cmtSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        if (comment
                .getStatus()
                .equals(CommentStatusType.D) && statusType.equals(CommentStatusType.A)) { // ???????????? ????????? ????????? ?????? ??????
            throw new InvalidDataException(msg("tps.comment.error.user-delete"));
        }

        // ?????? ????????? ???????????? ?????? ?????? ???????????? ??????
        if (statusType.equals(CommentStatusType.N)) {
            if (deleteType == null) {
                throw new InvalidDataException("tps.comment-banned.error.notnull.deleteType");
            }
        }

        //????????? ????????? ID ??????(T:??????, N:?????????????????? ??????????????? ??????, Y:?????????????????? ???????????? ??????, M:?????????????????? ??????)
        String blockChk = "";
        Long seqNo = null;

        if (McpString.isNotEmpty(comment)) {
            if (statusType.equals(CommentStatusType.N)) {

                Optional<CommentBanned> oldCommentBanned =
                        commentBannedService.findAllCommentBannedByTagValueOrderbySeqNoDesc(CommentBannedType.U, comment.getMemId());
                //commentBannedService.findAllCommentBannedByTagValue(CommentBannedType.U, comment.getMemId());
                if (oldCommentBanned.isPresent()) {
                    CommentBanned commentBanned = oldCommentBanned.get();
                    if (commentBanned
                            .getUsedYn()
                            .equals("N")) {
                        blockChk = "N";
                        seqNo = commentBanned.getSeqNo();
                    } else if (commentBanned
                            .getUsedYn()
                            .equals("Y")) {
                        blockChk = "Y";
                    }
                } else {
                    blockChk = "M";
                }
            }
        }

        long result = 0L;
        result = commentService.updateCommentStatus(comment, statusType, deleteType, blockChk, seqNo, cmtSeq);
        String msg = "";
        if (result > 0) {

            /**   deleteType
             CMT("DTCO", "??? ????????? ??????"),
             ALL("UDC", "?????? ???????????? ?????? ?????? ?????? ??????"),
             BNC("BNC", "?????? ????????? ID ?????? ??? ?????? ?????? ??????"),
             BNA("BNA", "?????? ????????? ID ?????? ??? ?????? ?????? ?????? ??????");
             */
            if (statusType.equals(CommentStatusType.N)) {
                switch (deleteType) {
                    case BNA:
                        if (blockChk.equals("T") || blockChk.equals("Y")) {
                            msg = msg("tps.comment-banned.id.comment.success.del");
                        } else {
                            msg = msg("tps.comment-banned.id.comment.success.block.del");
                        }
                        break;
                    case BNC:
                        if (blockChk.equals("T") || blockChk.equals("Y")) {
                            msg = msg("tps.comment-banned.id.success.del");
                        } else {
                            msg = msg("tps.comment-banned.id.success.block.del");
                        }
                        break;
                    case ALL:
                        msg = msg("tps.comment.success.delete-all");
                        break;
                    default:
                        msg = msg("tps.comment.success.status-" + statusType.getCode());
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
