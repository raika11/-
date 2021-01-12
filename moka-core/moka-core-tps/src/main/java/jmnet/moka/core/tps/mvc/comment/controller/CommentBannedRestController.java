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
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedDTO;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSaveDTO;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import jmnet.moka.core.tps.mvc.comment.service.CommentBannedService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
@RequestMapping("/api/comments-blocks")
@Api(tags = {"댓글 차단(IP/ID/금지어) API"})
public class CommentBannedRestController extends AbstractCommonController {

    @Autowired
    private ActionLogger actionLogger;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CommentBannedService commentBannedService;


    /**
     * 댓글목록조회
     *
     * @param search 검색조건
     * @return 댓글목록
     */
    @ApiOperation(value = "차단 목록 조회")
    @GetMapping
    public ResponseEntity<?> getCommentBlockList(@SearchParam CommentBannedSearchDTO search) {

        ResultListDTO<CommentBannedDTO> resultListMessage = new ResultListDTO<>();

        Page<CommentBanned> commentBanneds = commentBannedService.findAllCommentBanned(search);
        resultListMessage.setList(modelMapper.map(commentBanneds.getContent(), CommentBannedDTO.TYPE));
        resultListMessage.setTotalCnt(commentBanneds.getTotalElements());

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<ResultListDTO<CommentBannedDTO>> resultDto = new ResultDTO<>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 댓글목록조회
     *
     * @param seqNo 댓글차단일련번호
     * @return 댓글차단정보
     */
    @ApiOperation(value = "차단 정보 조회")
    @GetMapping("/{seqNo}")
    public ResponseEntity<?> getCommentBlock(
            @ApiParam("댓글차단 일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.group.error.pattern.groupCd}") Long seqNo)
            throws NoDataException {

        CommentBanned commentBanned = commentBannedService
                .findCommentBannedBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<CommentBannedDTO> resultDto = new ResultDTO<>(modelMapper.map(commentBanned, CommentBannedDTO.class));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param commentBannedSaveDTO 등록할 댓글정보
     * @return 등록된 댓글정보
     */
    @ApiOperation(value = "차단 등록")
    @PostMapping
    public ResponseEntity<?> postCommentBlock(@Valid CommentBannedSaveDTO commentBannedSaveDTO, @ApiParam(hidden = true) @NotNull Principal principal)
            throws NoDataException {

        CommentBanned commentBanned = modelMapper.map(commentBannedSaveDTO, CommentBanned.class);
        commentBanned = commentBannedService.insertCommentBanned(commentBanned);

        ResultDTO<CommentBannedDTO> resultDto =
                new ResultDTO<>(modelMapper.map(commentBanned, CommentBannedDTO.class), msg("tps.common.success.insert"));

        tpsLogger.success(ActionType.INSERT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 차단 정보 수정
     *
     * @param commentBannedSaveDTO 댓글 차단 정보
     * @param seqNo                차단 일련번호
     * @return 등록된 댓글정보
     */
    @ApiOperation(value = "차단 수정")
    @PutMapping("/{seqNo}")
    public ResponseEntity<?> putCommentBlock(
            @ApiParam("차단 일련번호") @PathVariable("seqNo") @Min(value = 1, message = "{comment.error.pattern.blockSeq}") Long seqNo,
            @Valid CommentBannedSaveDTO commentBannedSaveDTO, @ApiParam(hidden = true) @NotNull Principal principal)
            throws NoDataException {

        commentBannedService
                .findCommentBannedBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        CommentBanned commentBanned = modelMapper.map(commentBannedSaveDTO, CommentBanned.class);
        commentBanned.setSeqNo(seqNo);
        commentBanned = commentBannedService.updateCommentBanned(commentBanned);

        tpsLogger.success(ActionType.UPDATE);

        ResultDTO<CommentBannedDTO> resultDto =
                new ResultDTO<>(modelMapper.map(commentBanned, CommentBannedDTO.class), msg("tps.common.success.update"));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 차단 정보 삭제
     *
     * @param blockSeq 차단 일련번호
     * @return 성공여부
     */
    @ApiOperation(value = "차단 삭제")
    @DeleteMapping("/{blockSeq}")
    public ResponseEntity<?> deleteCommentBlock(
            @ApiParam("차단 일련번호") @PathVariable("blockSeq") @Min(value = 1, message = "{comment.error.pattern.blockSeq}") Long blockSeq,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws MokaException {

        ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg(""));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
