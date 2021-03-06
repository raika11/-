package jmnet.moka.core.tps.mvc.board.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.encrypt.MokaCrypt;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.push.dto.PushSendDTO;
import jmnet.moka.core.common.push.service.PushSendService;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.BoardTypeCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardAttachDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardAttachSaveDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardSaveDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.entity.BoardAttach;
import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import jmnet.moka.core.tps.mvc.board.service.BoardInfoService;
import jmnet.moka.core.tps.mvc.board.service.BoardService;
import jmnet.moka.core.tps.mvc.push.dto.PushAppSearchDTO;
import jmnet.moka.core.tps.mvc.push.service.PushAppService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.controller
 * ClassName : BoardController
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 11:33
 */
@Slf4j
@RestController
@RequestMapping("/api/boards")
@Api(tags = {"????????? API"})
public class BoardRestController extends AbstractCommonController {

    private final BoardService boardService;

    private final BoardInfoService boardInfoService;

    private final FtpHelper ftpHelper;

    private final MokaCrypt mokaCrypt;

    @Value("${board.image.save.filepath}")
    private String boardImageSavepath;

    @Value("${pds.url}")
    private String pdsUrl;

    private final PushAppService pushAppService;

    private final PushSendService pushSendService;

    public BoardRestController(BoardService boardService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger,
            BoardInfoService boardInfoService, FtpHelper ftpHelper, MokaCrypt mokaCrypt, PushAppService pushAppService,
            PushSendService pushSendService) {
        this.boardService = boardService;
        this.boardInfoService = boardInfoService;
        this.ftpHelper = ftpHelper;
        this.pushAppService = pushAppService;
        this.pushSendService = pushSendService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
        this.mokaCrypt = mokaCrypt;
    }

    /**
     * ?????????????????????
     *
     * @param search ????????????
     * @return ???????????????
     */
    @ApiOperation(value = "????????? ?????? ??????")
    @GetMapping("/{boardId}/contents")
    public ResponseEntity<?> getBoardList(@ApiParam("????????? ????????????") @PathVariable("boardId")
    @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId, @SearchParam BoardSearchDTO search) {

        ResultListDTO<BoardDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<Board> returnValue = boardService.findAllBoard(boardId, search);

        // ????????? ??????
        List<BoardDTO> boardDtoList = modelMapper.map(returnValue.getContent(), BoardDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(boardDtoList);


        ResultDTO<ResultListDTO<BoardDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????????????? ??????
     *
     * @param boardId  ????????? ????????????
     * @param boardSeq ?????????????????? (??????)
     * @param pwd      ????????????
     * @return ???????????????
     * @throws NoDataException ????????? ????????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @GetMapping("/{boardId}/contents/{boardSeq}")
    public ResponseEntity<?> getBoard(@ApiParam("????????? ????????????") @PathVariable("boardId")
    @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("????????? ????????????") @PathVariable("boardSeq") @Min(value = 1, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq,
            @ApiParam("????????? ????????????") @RequestParam(value = "pwd", required = false) String pwd)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");

        Board board = boardService
                .findBoardBySeq(boardSeq)
                .orElseThrow(() -> new NoDataException(message));

        if (board
                .getBoardInfo()
                .getBoardType() == BoardTypeCode.A) {
            boardService.updateViewCnt(boardSeq);
            board.setViewCnt(board.getViewCnt() + 1);
        }
        /*
        if (!matchedPassword(board, pwd)) {
            throw new InvalidDataException(msg("tps.board.error.pwd-unmatched"));
        }
        */
        /**
         * depth ????????? ????????????
         */
        int maxDepth = boardService.findByMaxDepth(board.getParentBoardSeq());

        BoardDTO dto = modelMapper.map(board, BoardDTO.class);
        dto.setMaxDepth(maxDepth);

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * ??????
     *
     * @param boardDTO ????????? ???????????????
     * @return ????????? ???????????????
     */
    @ApiOperation(value = "????????? ??????")
    @PostMapping("/{boardId}/contents")
    public ResponseEntity<?> postBoard(@ApiParam("????????? ????????????") @PathVariable("boardId")
    @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId, @Valid BoardSaveDTO boardDTO,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws InvalidDataException, NoDataException {


        // BoardDTO -> Board ??????
        Board board = modelMapper.map(boardDTO, Board.class);
        board.setBoardId(boardId);
        board.setParentBoardSeq(0L);
        board.setDepth(0);
        setPassword(board);
        setRegisterInfo(board, principal);
        //board.setContent(HtmlUtils.htmlEscape(board.getContent()));

        BoardInfo boardInfo = boardInfoService
                .findBoardInfoById(boardId)
                .orElseThrow(() -> new NoDataException(msg("tps.board-info.error.not-exist")));

        validInteractionOperation(boardInfo, board);

        validFileOperation(boardInfo, boardDTO.getAttaches());

        Board returnValue = boardService.insertBoard(board);
        returnValue.setParentBoardSeq(returnValue.getBoardSeq());
        boardService.updateBoardParentSeq(returnValue.getBoardSeq(), returnValue.getBoardSeq());


        returnValue.setBoardInfo(boardInfo);

        // ????????????
        BoardDTO dto = modelMapper.map(returnValue, BoardDTO.class);

        String attachMessage = saveAttachFiles(returnValue, dto, boardDTO.getAttaches());

        String successMsg = msg("tps.board.success.save");
        if (attachMessage.length() > 0) {
            successMsg += "\n" + attachMessage;
        }
        ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto, successMsg);

        // ?????? ????????? ?????? ?????? ??????
        tpsLogger.success(ActionType.INSERT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ????????? ??????/?????? ??????
     *
     * @param parentBoardSeq ????????? ????????????
     * @param boardDTO       ????????? ???????????????
     * @return ????????? ???????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????? ??????/?????? ??????")
    @PostMapping("/{boardId}/contents/{parentBoardSeq}/reply")
    public ResponseEntity<?> postBoardReply(@ApiParam("????????? ????????????") @PathVariable("boardId")
    @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId, @ApiParam("????????? ????????????") @PathVariable("parentBoardSeq")
    @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long parentBoardSeq, @Valid BoardSaveDTO boardDTO,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws InvalidDataException, Exception {

        // BoardDTO -> Board ??????
        Board board = modelMapper.map(boardDTO, Board.class);
        board.setBoardId(boardId);
        board.setParentBoardSeq(parentBoardSeq);
        //board.setContent(HtmlUtils.htmlEscape(board.getContent()));
        setRegisterInfo(board, principal);
        setPassword(board);
        Board parentBoard;
        try {
            if (board.getParentBoardSeq() == null || board.getParentBoardSeq() == 0) {
                throw new InvalidDataException(msg("tps.board.error.min.parentBoardSeq"));
            }

            parentBoard = boardService
                    .findBoardBySeq(board.getParentBoardSeq())
                    .orElseThrow(() -> new NoDataException(msg("tps.board.error.no-data.parentBoardSeq")));

            board.setBoardInfo(parentBoard.getBoardInfo());
            // ?????? ????????? ?????? ?????? ?????????
            board.setOrdNo(parentBoard.getOrdNo());

        } catch (Exception e) {
            log.error("[FAIL TO INSERT BOARD]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.board.error.save"), e);
        }
        ResponseEntity<ResultDTO<BoardDTO>> result = processBoardContents(board, boardDTO.getAttaches());
        /**
         * ????????? ????????? ???????????? answYn??? Y??? ??????
         */
        try {
            if (result
                    .getBody()
                    .getHeader()
                    .isSuccess()) {
                parentBoard.setAnswYn(MokaConstants.YES);
                boardService.updateBoard(parentBoard);
                if (board
                        .getPushReceiveYn()
                        .equals(MokaConstants.YES)) { // ?????? ?????? ?????? ?????? ??????
                    List<Integer> appIds = pushAppService.findAllPushAppIds(PushAppSearchDTO
                            .builder()
                            .appDiv(MokaConstants.PUSH_APP_DIV_J)
                            .devDiv(board.getDevDiv())
                            .appOs(board.getAppOs())
                            .build());
                    pushSendService.send(PushSendDTO
                            .builder()
                            .appSeq(appIds)
                            .content(msg("tps.board.push.replay-content"))
                            .pushType(MokaConstants.PUSH_TYPE_BOARD_REPLY)
                            .relContentId(board.getBoardSeq())
                            .title(msg("tps.board.push.replay-title"))
                            .build());
                }
            }
        } catch (Exception e) {
            log.error("[FAIL TO INSERT BOARD]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.board.error.save"), e);
        }
        return result;
    }

    /**
     * ??????
     *
     * @param boardId  ????????? ID
     * @param boardSeq ??????????????????
     * @param boardDTO ????????? ???????????????
     * @return ????????? ???????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @PutMapping("/{boardId}/contents/{boardSeq}")
    public ResponseEntity<?> putBoard(@ApiParam("????????? ????????????") @PathVariable("boardId")
    @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("????????? ????????????") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq,
            @Valid BoardSaveDTO boardDTO)
            throws Exception {

        // BoardDTO -> Board ??????
        Board newBoard = modelMapper.map(boardDTO, Board.class);
        newBoard.setBoardId(boardId);
        newBoard.setBoardSeq(boardSeq);
        newBoard.setParentBoardSeq(boardSeq);
        newBoard.setDepth(0);
        //newBoard.setContent(HtmlUtils.htmlEscape(newBoard.getContent()));

        // ????????? ????????? ??????
        Board oldBoard = boardService
                .findBoardBySeq(newBoard.getBoardSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        return processUpdateEntity(newBoard, oldBoard, boardDTO.getAttaches());

    }

    private ResponseEntity<?> processUpdateEntity(Board newBoard, Board oldBoard, List<BoardAttachSaveDTO> boardAttachSaveDTOSet)
            throws InvalidDataException {
        if (!matchedPassword(oldBoard, newBoard.getPwd())) {
            throw new InvalidDataException(msg("tps.board.error.pwd-unmatched"));
        }
        newBoard.setRecomCnt(oldBoard.getRecomCnt());
        newBoard.setViewCnt(oldBoard.getViewCnt());
        newBoard.setDeclareCnt(oldBoard.getDeclareCnt());
        newBoard.setDecomCnt(oldBoard.getDecomCnt());
        newBoard.setRegName(oldBoard.getRegName());
        newBoard.setRegIp(oldBoard.getRegIp());
        newBoard.setAttaches(oldBoard.getAttaches());
        newBoard.setBoardInfo(oldBoard.getBoardInfo());
        newBoard.setAnswYn(oldBoard.getAnswYn());
        newBoard.setModDiv(TpsConstants.BOARD_REG_DIV_ADMIN);
        setPassword(newBoard);
        return processBoardContents(newBoard, boardAttachSaveDTOSet);
    }


    /**
     * ????????? ??????/?????? ??????
     *
     * @param boardId  ????????? ID
     * @param boardSeq ??????????????????
     * @param boardDTO ????????? ???????????????
     * @return ????????? ???????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "????????? ??????/?????? ??????")
    @PutMapping("/{boardId}/contents/{parentBoardSeq}/replys/{boardSeq}")
    public ResponseEntity<?> putBoardReply(@ApiParam("????????? ????????????") @PathVariable("boardId")
    @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("??????????????? ????????????") @PathVariable("parentBoardSeq")
            @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long parentBoardSeq,
            @ApiParam("????????? ????????????") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq,
            @Valid BoardSaveDTO boardDTO)
            throws Exception {

        // BoardDTO -> Board ??????
        String infoMessage = msg("tps.common.error.no-data");
        Board newBoard = modelMapper.map(boardDTO, Board.class);
        newBoard.setBoardId(boardId);
        newBoard.setBoardSeq(boardSeq);
        newBoard.setParentBoardSeq(parentBoardSeq);
        newBoard.setDepth(1);
        //newBoard.setContent(HtmlUtils.htmlEscape(newBoard.getContent()));

        // ????????? ????????? ??????
        Board oldBoard = boardService
                .findBoardBySeq(newBoard.getBoardSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));

        // ??????????????? ?????? ???????????? ???????????? ?????? ??????
        if (newBoard.getParentBoardSeq() == null || newBoard.getParentBoardSeq() == 0) {
            throw new InvalidDataException(msg("tps.board.error.min.parentBoardSeq"));
        }

        // ?????? ???????????? DB??? ????????? ?????? ??????
        Board parentBoard = boardService
                .findBoardBySeq(newBoard.getParentBoardSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.board.error.no-data.parentBoardSeq")));

        // ?????? ?????? ????????? ??????????????? ?????? ??????????????? ????????? ?????? ??????
        if (!oldBoard
                .getParentBoardSeq()
                .equals(newBoard.getParentBoardSeq())) {
            throw new InvalidDataException(msg("tps.board.error.unmatched-parentBoardSeq"));
        }
        // ?????? ????????? ?????? ?????? ?????????
        newBoard.setOrdNo(newBoard.getOrdNo());

        return processUpdateEntity(newBoard, oldBoard, boardDTO.getAttaches());
    }

    /**
     * ????????? ?????? ?????? ??????
     *
     * @param board ????????? ??????
     * @return ResponseEntity
     * @throws InvalidDataException ?????? ?????? ??????
     */
    private ResponseEntity<ResultDTO<BoardDTO>> processBoardContents(Board board, List<BoardAttachSaveDTO> boardAttachSaveDTOSet)
            throws InvalidDataException {
        ActionType actionType = board.getBoardSeq() != null && board.getBoardSeq() > 0 ? ActionType.UPDATE : ActionType.INSERT;
        try {
            // ???????????? ???????????? ??????
            validInteractionOperation(board.getBoardInfo(), board);
            // ?????? ???????????? ??????
            validFileOperation(board.getBoardInfo(), boardAttachSaveDTOSet);

            Board returnValue = actionType == ActionType.UPDATE ? boardService.updateBoard(board) : boardService.insertBoard(board);

            // ????????????
            BoardDTO dto = modelMapper.map(returnValue, BoardDTO.class);

            String attachMessage = saveAttachFiles(returnValue, dto, boardAttachSaveDTOSet);

            String successMsg = msg("tps.board.success.update");
            if (attachMessage.length() > 0) {
                successMsg += "\n" + attachMessage;
            }

            ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto, successMsg);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(actionType);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (InvalidDataException e) {
            log.error("[FAIL TO " + actionType.code() + " BOARD]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(actionType, e);
            throw e;
        }
    }


    /**
     * ??????
     *
     * @param boardId  ????????? ????????????
     * @param boardSeq ?????? ??? ?????????????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ????????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "????????? ??????")
    @DeleteMapping("/{boardId}/contents/{boardSeq}")
    public ResponseEntity<?> deleteBoard(@ApiParam("????????? ????????????") @PathVariable("boardId")
    @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("????????? ????????????") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq)
            throws InvalidDataException, NoDataException, Exception {


        // ????????? ????????? ??????
        String noContentMessage = msg("tps.common.error.no-data");
        Board board = boardService
                .findBoardBySeq(boardSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));


        // ?????? ???????????? ?????? ?????? ?????? ??????
        if (boardService.countAllBoardByParentBoardSeq(board.getBoardSeq()) > 0) {
            throw new InvalidDataException(msg("tps.board.error.exist-children-contents"));
        }

        try {
            // ??????
            board.setBoardId(boardId);
            board.setDelYn(MokaConstants.YES);
            boardService.updateBoard(board);
            //boardService.deleteBoard(board);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.DELETE);

            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.common.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE BOARD] boardSeq: {} {}", boardSeq, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.board.error.delete"), e);
        }
    }

    /**
     * ??? ?????? ??????
     *
     * @param boardSeq ????????? ????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "??? ?????? ??????")
    @PutMapping("/{boardSeq}/order")
    public ResponseEntity<?> putOrder(
            @ApiParam("????????? ????????????") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq,
            @ApiParam("????????? ????????????") @RequestParam("ordNo") @Min(value = 0, message = "{tps.board.error.min.ordNo}") Integer ordNo) {

        if (boardService.updateOrdNo(boardSeq, ordNo) > 0) {
            return new ResponseEntity<>(new ResultDTO<>(true, msg("tps.board.success.change-order")), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResultDTO<>(false, msg("tps.board.error.change-order")), HttpStatus.OK);
        }
    }



    private void setRegisterInfo(Board board, Principal principal) {
        UserDTO userDTO = (UserDTO) ((UsernamePasswordAuthenticationToken) principal).getDetails();
        board.setRegName(userDTO.getUserName());
        board.setRegDiv(TpsConstants.BOARD_REG_DIV_ADMIN);
        board.setRegIp(HttpHelper.getRemoteAddr());
    }

    /**
     * ??????, ?????? ???????????? ??????
     *
     * @param boardInfo ???????????????
     * @param board     ???????????????
     * @throws InvalidDataException ??????????????? ?????? ??????
     */
    private void validInteractionOperation(BoardInfo boardInfo, Board board)
            throws InvalidDataException {

        // ????????????????????? ????????? ?????? ???????????? ???????????? ????????????????????? Y??? ?????? ?????? ??????
        if (boardInfo
                .getAnswPushYn()
                .equals(MokaConstants.NO)) {
            if (board
                    .getPushReceiveYn()
                    .equals(MokaConstants.YES)) {
                new InvalidDataException(msg("tps.board.error.do-not-push"));
            }
        }

        // ????????????????????? Y??? ?????? ????????? ?????? ?????? ????????? ???????????? ?????? ??????
        if (board
                .getPushReceiveYn()
                .equals(MokaConstants.YES)) {
            if (McpString.isEmpty(board.getAppOs()) || McpString.isEmpty(board.getDevDiv()) || McpString.isEmpty(board.getToken())) {
                new InvalidDataException(msg("tps.board.error.need-push-info"));
            }
        }

        // ????????? ?????? ????????? ????????? ?????? ???????????? ???????????? ?????????????????? Y??? ?????? ?????? ??????
        if (boardInfo
                .getEmailSendYn()
                .equals(MokaConstants.NO)) {
            if (board
                    .getEmailReceiveYn()
                    .equals(MokaConstants.YES)) {
                new InvalidDataException(msg("tps.board.error.do-not-email"));
            }
        }

        // ???????????? ?????????????????? Y??? ?????? ?????? ??????, ????????? ?????? ?????? ?????? ??????
        if (board
                .getEmailReceiveYn()
                .equals(MokaConstants.YES)) {
            if (McpString.isEmpty(board.getEmail())) {
                new InvalidDataException(msg("tps.board.error.need-email-address"));
            }
        }
    }

    private void validFileOperation(BoardInfo boardInfo, List<BoardAttachSaveDTO> boardAttachSaveDTOSet)
            throws InvalidDataException {
        if (boardAttachSaveDTOSet != null && boardAttachSaveDTOSet.size() > 0) {
            // ?????? ?????? ?????? ?????? ??????
            if (McpString
                    .defaultValue(boardInfo.getFileYn(), MokaConstants.NO)
                    .equals(MokaConstants.NO)) {
                throw new InvalidDataException(msg("tps.board.error.file-attach-disable"));
            }

            // ?????? ?????? ?????? ??????
            if (boardInfo
                    .getAllowFileCnt()
                    .compareTo(boardAttachSaveDTOSet.size()) < 0) {
                throw new InvalidDataException(msg("tps.board.error.file-limit-count", boardInfo.getAllowFileCnt()));
            }
        }
    }

    private String saveAttachFiles(Board board, BoardDTO boardDto, List<BoardAttachSaveDTO> boardAttachSaveDTOSet) {
        List<BoardAttach> attaches = board.getAttaches();
        List<BoardAttach> newAttaches = new ArrayList<>();


        StringBuilder message = new StringBuilder();

        if (boardAttachSaveDTOSet != null && boardAttachSaveDTOSet.size() > 0) {
            boardAttachSaveDTOSet.forEach(boardAttachSaveDTO -> {
                try {
                    if (boardAttachSaveDTO.getAttachFile() != null) {
                        String ext = McpFile.getExtension(boardAttachSaveDTO
                                .getAttachFile()
                                .getOriginalFilename());

                        // ?????? ?????? ????????? ??????
                        if (ext != null && !board
                                .getBoardInfo()
                                .getAllowFileExt()
                                .contains(ext)) {
                            message.append(message.length() > 0 ? "\n" : "");
                            message.append(msg("tps.board.error.file-ext", boardAttachSaveDTO
                                    .getAttachFile()
                                    .getOriginalFilename()));
                        } else {
                            // ?????? ????????? ????????? ??????
                            if (board
                                    .getBoardInfo()
                                    .getAllowFileSize()
                                    .compareTo((int) (boardAttachSaveDTO
                                            .getAttachFile()
                                            .getSize() / (1024 * 1024))) < 0) {
                                message.append(message.length() > 0 ? "\n" : "");
                                message.append(msg("tps.board.error.file-size", boardAttachSaveDTO
                                        .getAttachFile()
                                        .getOriginalFilename(), board
                                        .getBoardInfo()
                                        .getAllowFileSize()));
                            } else {
                                String yearMonth = McpDate.dateStr(McpDate.now(), "yyyyMM");
                                //String saveFilePath = "/board/" + board.getBoardId() + "/" + yearMonth;
                                String filename = UUIDGenerator.uuid() + "." + ext;
                                String saveFilePath = "/bbs_attach/board/" + board.getBoardId() + "/" + filename;
                                // root ????????????(/bbs_attach)/board/???????????????????????????(BOARDINFO_SEQ)/?????????

                                ftpHelper.upload(FtpHelper.PDS, filename, boardAttachSaveDTO
                                        .getAttachFile()
                                        .getInputStream(), saveFilePath);

                                if (boardAttachSaveDTO.getSeqNo() != null && boardAttachSaveDTO.getSeqNo() > 0) {
                                    attaches
                                            .stream()
                                            .filter(attach -> attach
                                                    .getSeqNo()
                                                    .equals(boardAttachSaveDTO.getSeqNo()))
                                            .findFirst()
                                            .ifPresentOrElse(boardAttach -> {
                                                boardAttach.setFileName(filename);
                                                boardAttach.setFilePath(saveFilePath);
                                                boardAttach.setOrgFileName(boardAttachSaveDTO
                                                        .getAttachFile()
                                                        .getOriginalFilename());
                                                boardService.updateBoardAttach(boardAttach);
                                            }, () -> boardService.insertBoardAttach(BoardAttach
                                                    .builder()
                                                    .boardId(board.getBoardId())
                                                    .boardSeq(board.getBoardSeq())
                                                    .fileName(filename)
                                                    .filePath(saveFilePath)
                                                    .orgFileName(boardAttachSaveDTO
                                                            .getAttachFile()
                                                            .getOriginalFilename())
                                                    .build()));
                                    attaches.removeIf(boardAttach -> boardAttachSaveDTO
                                            .getSeqNo()
                                            .equals(boardAttach.getSeqNo()));
                                } else {
                                    newAttaches.add(boardService.insertBoardAttach(BoardAttach
                                            .builder()
                                            .boardId(board.getBoardId())
                                            .boardSeq(board.getBoardSeq())
                                            .fileName(filename)
                                            .filePath(saveFilePath)
                                            .orgFileName(boardAttachSaveDTO
                                                    .getAttachFile()
                                                    .getOriginalFilename())
                                            .build()));
                                }
                            }
                        }
                    } else {
                        attaches
                                .stream()
                                .filter(boardAttach -> boardAttachSaveDTO
                                        .getSeqNo()
                                        .equals(boardAttach.getSeqNo()))
                                .findFirst()
                                .ifPresent(ba -> {
                                    newAttaches.add(ba);
                                    attaches.remove(ba);
                                });

                    }
                } catch (IOException ex) {
                    log.error("[FAIL TO FILE UPLOAD BOARD] boardseq: {} {}", board.getBoardSeq(), ex.getMessage());
                }
            });

            if (attaches != null && attaches.size() > 0) {
                boardService.deleteAllBoardAttach(attaches);
            }
            if (newAttaches.size() > 0) {
                boardDto.setAttaches(modelMapper.map(newAttaches, BoardAttachDTO.TYPE));
            }
        } else { // ????????? ?????????????????? ?????? ????????? ???????????? ????????? ?????? ?????? ????????? ?????? ?????? ?????? ??????.
            boardService.deleteAllBoardAttach(board.getBoardSeq());
        }

        return message.toString();
    }

    private void setPassword(Board board) {
        if (McpString.isNotEmpty(board.getPwd())) {
            try {
                board.setPwd(mokaCrypt.encrypt(board.getPwd()));
            } catch (Exception ex) {
                log.error("[FAIL TO BOARD PASSWORD] password: {} {}", board.getPwd(), ex.getMessage());
            }
        }
    }

    private boolean matchedPassword(Board board, String pwd) {
        if (McpString.isNotEmpty(board.getPwd())) {
            if (McpString.isEmpty(pwd)) {
                return false;
            }

            try {
                return pwd.equals(mokaCrypt.decrypt(board.getPwd()));
            } catch (Exception ex) {
                log.error("[FAIL TO BOARD PASSWORD] password: {} {}", board.getPwd(), ex.getMessage());
                return false;
            }
        }
        return true;
    }

    /**
     * ????????? ???????????? ????????? ?????????
     *
     * @param boardId ????????? ????????? ID
     * @return ????????? ???????????????
     */
    @ApiOperation(value = "????????? ???????????? ????????? ?????????")
    @PostMapping("/{boardId}/image")
    public ResponseEntity<?> postUploadContentImage(@ApiParam("????????? ????????????") @PathVariable("boardId")
    @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId, MultipartFile attachFile)
            throws InvalidDataException, IOException {

        if (!ImageUtil.isImage(attachFile)) {
            throw new InvalidDataException(msg("tps.board.error.file-ext", attachFile.getOriginalFilename()));
        }

        String ext = McpFile.getExtension(attachFile.getOriginalFilename());
        String filename = UUIDGenerator.uuid() + "." + ext;
        String yearMonth = McpDate.dateStr(McpDate.now(), "yyyyMM");
        String saveFilePath = String.format(boardImageSavepath, boardId, yearMonth);
        String imageUrl = pdsUrl;
        String message;
        if (ftpHelper.upload(FtpHelper.PDS, filename, attachFile.getInputStream(), saveFilePath)) {
            imageUrl = pdsUrl + saveFilePath + "/" + filename;
            message = msg("tps.board-info.success.upload");
        } else {
            message = msg("tps.board-info.error.upload");
        }

        ResultDTO<String> resultDto = new ResultDTO<>(imageUrl, message);

        // ?????? ????????? ?????? ?????? ??????
        tpsLogger.success(ActionType.UPLOAD);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



}
