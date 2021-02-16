package jmnet.moka.core.tps.mvc.comment.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentBannedType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedDTO;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSaveDTO;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBannedHist;
import jmnet.moka.core.tps.mvc.comment.service.CommentBannedService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
@RequestMapping("/api/comments-blocks")
@Api(tags = {"댓글 차단(IP/ID/금지어) API"})
public class CommentBannedRestController extends AbstractCommonController {


    private final ModelMapper modelMapper;

    private final CommentBannedService commentBannedService;

    public CommentBannedRestController(ModelMapper modelMapper, CommentBannedService commentBannedService) {
        this.modelMapper = modelMapper;
        this.commentBannedService = commentBannedService;
    }


    /**
     * 댓글차단목록조회
     *
     * @param search 검색조건
     * @return 댓글차단목록
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
     * 댓글차단 이력 목록조회
     *
     * @param seqNo 댓글차단 일련번호
     * @return 댓글차단목록
     */
    @ApiOperation(value = "댓글차단 이력 목록조회")
    @GetMapping("/{seqNo}/historys")
    public ResponseEntity<?> getCommentBlockHistList(
            @ApiParam("댓글차단 일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.comment-banned.error.pattern.seqNo}") Long seqNo) {

        ResultListDTO<CommentBannedDTO> resultListMessage = new ResultListDTO<>();

        List<CommentBannedHist> commentBanneds = commentBannedService.findAllCommentBannedHistoryBySeq(seqNo);
        resultListMessage.setList(modelMapper.map(commentBanneds, CommentBannedDTO.TYPE));
        resultListMessage.setTotalCnt(commentBanneds.size());

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<ResultListDTO<CommentBannedDTO>> resultDto = new ResultDTO<>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 댓글차단목록조회
     *
     * @param seqNo 댓글차단일련번호
     * @return 댓글차단정보
     */
    @ApiOperation(value = "차단 정보 조회")
    @GetMapping("/{seqNo}")
    public ResponseEntity<?> getCommentBlock(
            @ApiParam("댓글차단 일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.comment-banned.error.pattern.seqNo}") Long seqNo)
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
    public ResponseEntity<?> processCommentBlock(@Valid CommentBannedSaveDTO commentBannedSaveDTO)
            throws MokaException {
        if (commentBannedSaveDTO
                .getTagValues()
                .size() == 1) {
            CommentBanned commentBanned = modelMapper.map(commentBannedSaveDTO, CommentBanned.class);
            commentBanned.setTagValue(commentBannedSaveDTO
                    .getTagValues()
                    .get(0));
            return processCommentBlock(commentBanned);
        } else {
            List<String> tagValues = new ArrayList<>();
            for (String tagValue : commentBannedSaveDTO.getTagValues()) {

                Optional<CommentBanned> oldCommentBanned =
                        commentBannedService.findAllCommentBannedByTagValue(commentBannedSaveDTO.getTagType(), tagValue);
                if (oldCommentBanned.isPresent()) {
                    CommentBanned commentBanned = oldCommentBanned.get();
                    commentBanned.setUsedYn(commentBannedSaveDTO.getUsedYn());
                    commentBanned.setTagDesc(commentBannedSaveDTO.getTagDesc());
                    commentBanned.setTagDiv(commentBannedSaveDTO.getTagDiv());
                    try {
                        commentBanned = commentBannedService.updateCommentBanned(commentBanned);
                        if (commentBanned == null || (commentBanned.getSeqNo() == null || commentBanned.getSeqNo() <= 0)) {
                            tagValues.add(tagValue);
                        }
                    } catch (Exception ex) {
                        tagValues.add(tagValue);
                    }
                } else {
                    CommentBanned commentBanned = modelMapper.map(commentBannedSaveDTO, CommentBanned.class);
                    commentBanned.setTagValue(commentBannedSaveDTO
                            .getTagValues()
                            .get(0));
                    try {
                        commentBanned = commentBannedService.insertCommentBanned(commentBanned);
                        if (commentBanned == null || (commentBanned.getSeqNo() == null || commentBanned.getSeqNo() <= 0)) {
                            tagValues.add(tagValue);
                        }
                    } catch (Exception ex) {
                        tagValues.add(tagValue);
                    }
                }
            }

            boolean success = true;
            String msg = msg("tps.comment-banned.success.save", commentBannedSaveDTO
                    .getTagType()
                    .getFullname());
            if (tagValues.size() > 0) {
                msg = msg("tps.comment-banned.error.part", CommentBannedType.U.getFullname(), CommentBannedType.U.getName(),
                        CommentBannedType.U.getName(), McpString.collectionToDelimitedString(tagValues, ", "));
                success = false;
            }
            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, msg);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        }
    }

    /**
     * 등록
     *
     * @param commentBanned 등록할 댓글정보
     * @return 등록된 댓글정보
     */
    private ResponseEntity<?> processCommentBlock(CommentBanned commentBanned)
            throws MokaException {

        Optional<CommentBanned> oldCommentBanned =
                commentBannedService.findAllCommentBannedByTagValue(commentBanned.getTagType(), commentBanned.getTagValue());

        if (!oldCommentBanned.isPresent()) {
            commentBanned = commentBannedService.insertCommentBanned(commentBanned);

            ResultDTO<CommentBannedDTO> resultDto = new ResultDTO<>(modelMapper.map(commentBanned, CommentBannedDTO.class),
                    msg("tps.comment-banned.success.save", commentBanned
                            .getTagType()
                            .getFullname()));

            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } else {
            String usedYn = oldCommentBanned
                    .get()
                    .getUsedYn();


            ResultDTO<CommentBannedDTO> resultDto =
                    new ResultDTO<>(HttpStatus.BAD_REQUEST, modelMapper.map(oldCommentBanned.get(), CommentBannedDTO.class),
                            msg(MokaConstants.NO.equals(usedYn) ? "tps.comment-banned.error.exist-recover-history" : "tps.comment-banned.error.exist",
                                    commentBanned
                                            .getTagType()
                                            .getName()));
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        }
    }



    /**
     * 차단 정보 삭제/복원
     *
     * @param seqNo 차단 일련번호
     * @return 성공여부
     */
    @ApiOperation(value = "차단 정보 삭제/복원")
    @PutMapping("/{seqNo}/used")
    public ResponseEntity<?> putCommentBlockUsedYn(
            @ApiParam("차단 일련번호") @PathVariable("seqNo") @Min(value = 1, message = "{tps.comment-banned.error.pattern.seqNo}") Long seqNo,
            @ApiParam("사용여부") @Pattern(regexp = "[Y|N]$", message = "{tps.common.error.pattern.usedYn}")
            @RequestParam(value = "usedYn", defaultValue = MokaConstants.YES) String usedYn)
            throws NoDataException {

        CommentBanned commentBanned = commentBannedService
                .findCommentBannedBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        commentBanned.setUsedYn(usedYn);
        commentBanned = commentBannedService.updateCommentBanned(commentBanned);

        tpsLogger.success(ActionType.UPDATE);

        String msg = msg(MokaConstants.NO.equals(usedYn) ? "tps.comment-banned.success.recover" : "tps.comment-banned.success.resave", commentBanned
                .getTagType()
                .getFullname());

        ResultDTO<CommentBannedDTO> resultDto = new ResultDTO<>(modelMapper.map(commentBanned, CommentBannedDTO.class), msg);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
