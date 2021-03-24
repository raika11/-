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
@Api(tags = {"게시판 API"})
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
     * 게시판목록조회
     *
     * @param search 검색조건
     * @return 게시판목록
     */
    @ApiOperation(value = "게시판 목록 조회")
    @GetMapping("/{boardId}/contents")
    public ResponseEntity<?> getBoardList(@ApiParam("게시물 일련번호") @PathVariable("boardId")
    @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId, @SearchParam BoardSearchDTO search) {

        ResultListDTO<BoardDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Board> returnValue = boardService.findAllBoard(boardId, search);

        // 리턴값 설정
        List<BoardDTO> boardDtoList = modelMapper.map(returnValue.getContent(), BoardDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(boardDtoList);


        ResultDTO<ResultListDTO<BoardDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 게시판정보 조회
     *
     * @param boardId  게시판 일련번호
     * @param boardSeq 게시판아이디 (필수)
     * @param boardSeq 게시판아이디 (필수)
     * @return 게시판정보
     * @throws NoDataException 게시판 정보가 없음
     */
    @ApiOperation(value = "게시판 조회")
    @GetMapping("/{boardId}/contents/{boardSeq}")
    public ResponseEntity<?> getBoard(
            @ApiParam("게시판 ID") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Min(value = 1, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq,
            @ApiParam("게시물 비밀번호") @RequestParam(value = "pwd", required = false) String pwd)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        Board board = boardService
                .findBoardBySeq(boardSeq)
                .orElseThrow(() -> new NoDataException(message));
        /*
        if (!matchedPassword(board, pwd)) {
            throw new InvalidDataException(msg("tps.board.error.pwd-unmatched"));
        }
        */
        /**
         * depth 최대값 구해오기
         */
        int maxDepth = boardService.findByMaxDepth(board.getParentBoardSeq());

        BoardDTO dto = modelMapper.map(board, BoardDTO.class);
        dto.setMaxDepth(maxDepth);

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * 등록
     *
     * @param boardDTO 등록할 게시판정보
     * @return 등록된 게시판정보
     */
    @ApiOperation(value = "게시판 등록")
    @PostMapping("/{boardId}/contents")
    public ResponseEntity<?> postBoard(
            @ApiParam("게시판 ID") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @Valid BoardSaveDTO boardDTO, @ApiParam(hidden = true) @NotNull Principal principal)
            throws InvalidDataException, NoDataException {


        // BoardDTO -> Board 변환
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

        // 결과리턴
        BoardDTO dto = modelMapper.map(returnValue, BoardDTO.class);

        String attachMessage = saveAttachFiles(returnValue, dto, boardDTO.getAttaches());

        String successMsg = msg("tps.board.success.save");
        if (attachMessage.length() > 0) {
            successMsg += "\n" + attachMessage;
        }
        ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto, successMsg);

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.INSERT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 게시판 답변/댓글 등록
     *
     * @param parentBoardSeq 게시물 일련번호
     * @param boardDTO       등록할 게시판정보
     * @return 등록된 게시판정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "게시판 답변/댓글 등록")
    @PostMapping("/{boardId}/contents/{parentBoardSeq}/reply")
    public ResponseEntity<?> postBoardReply(
            @ApiParam("게시판 ID") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("게시물 일련번호") @PathVariable("parentBoardSeq")
            @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long parentBoardSeq, @Valid BoardSaveDTO boardDTO,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws InvalidDataException, Exception {

        // BoardDTO -> Board 변환
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
            // 부모 순서와 답글 순서 일치화
            board.setOrdNo(parentBoard.getOrdNo());

        } catch (Exception e) {
            log.error("[FAIL TO INSERT BOARD]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.board.error.save"), e);
        }
        ResponseEntity<ResultDTO<BoardDTO>> result = processBoardContents(board, boardDTO.getAttaches());
        /**
         * 답변글 등록시 부모글의 answYn을 Y로 변경
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
                        .equals(MokaConstants.YES)) { // 답변 등록 알림 푸시 전송
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
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.board.error.save"), e);
        }
        return result;
    }

    /**
     * 수정
     *
     * @param boardId  게시판 ID
     * @param boardSeq 게시판아이디
     * @param boardDTO 수정할 게시판정보
     * @return 수정된 게시판정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "게시판 수정")
    @PutMapping("/{boardId}/contents/{boardSeq}")
    public ResponseEntity<?> putBoard(
            @ApiParam("게시판 ID") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq,
            @Valid BoardSaveDTO boardDTO)
            throws Exception {

        // BoardDTO -> Board 변환
        Board newBoard = modelMapper.map(boardDTO, Board.class);
        newBoard.setBoardId(boardId);
        newBoard.setBoardSeq(boardSeq);
        newBoard.setParentBoardSeq(boardSeq);
        newBoard.setDepth(0);
        //newBoard.setContent(HtmlUtils.htmlEscape(newBoard.getContent()));

        // 오리진 데이터 조회
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
     * 게시판 답변/댓글 수정
     *
     * @param boardId  게시판 ID
     * @param boardSeq 게시판아이디
     * @param boardDTO 수정할 게시판정보
     * @return 수정된 게시판정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "게시판 답변/댓글 수정")
    @PutMapping("/{boardId}/contents/{parentBoardSeq}/replys/{boardSeq}")
    public ResponseEntity<?> putBoardReply(
            @ApiParam("게시판 ID") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("게시물 일련번호") @PathVariable("parentBoardSeq")
            @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long parentBoardSeq,
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq,
            @Valid BoardSaveDTO boardDTO)
            throws Exception {

        // BoardDTO -> Board 변환
        String infoMessage = msg("tps.common.error.no-data");
        Board newBoard = modelMapper.map(boardDTO, Board.class);
        newBoard.setBoardId(boardId);
        newBoard.setBoardSeq(boardSeq);
        newBoard.setParentBoardSeq(parentBoardSeq);
        newBoard.setDepth(1);
        //newBoard.setContent(HtmlUtils.htmlEscape(newBoard.getContent()));

        // 오리진 데이터 조회
        Board oldBoard = boardService
                .findBoardBySeq(newBoard.getBoardSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));

        // 답변글인데 부모 일련번호 빈값이면 에러 처리
        if (newBoard.getParentBoardSeq() == null || newBoard.getParentBoardSeq() == 0) {
            throw new InvalidDataException(msg("tps.board.error.min.parentBoardSeq"));
        }

        // 부모 일련번호 DB에 없으면 에러 처리
        Board parentBoard = boardService
                .findBoardBySeq(newBoard.getParentBoardSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.board.error.no-data.parentBoardSeq")));

        // 기존 상위 게시물 일련번호와 현재 일련번호가 바뀌면 에러 처리
        if (!oldBoard
                .getParentBoardSeq()
                .equals(newBoard.getParentBoardSeq())) {
            throw new InvalidDataException(msg("tps.board.error.unmatched-parentBoardSeq"));
        }
        // 부모 순서와 답글 순서 일치화
        newBoard.setOrdNo(newBoard.getOrdNo());

        return processUpdateEntity(newBoard, oldBoard, boardDTO.getAttaches());
    }

    /**
     * 게시판 등록 수정 처리
     *
     * @param board 게시물 정보
     * @return ResponseEntity
     * @throws InvalidDataException 공통 에러 처리
     */
    private ResponseEntity<ResultDTO<BoardDTO>> processBoardContents(Board board, List<BoardAttachSaveDTO> boardAttachSaveDTOSet)
            throws InvalidDataException {
        ActionType actionType = board.getBoardSeq() != null && board.getBoardSeq() > 0 ? ActionType.UPDATE : ActionType.INSERT;
        try {
            // 상호작용 파라미터 검증
            validInteractionOperation(board.getBoardInfo(), board);
            // 파일 파라미터 검증
            validFileOperation(board.getBoardInfo(), boardAttachSaveDTOSet);

            Board returnValue = actionType == ActionType.UPDATE ? boardService.updateBoard(board) : boardService.insertBoard(board);

            // 결과리턴
            BoardDTO dto = modelMapper.map(returnValue, BoardDTO.class);

            String attachMessage = saveAttachFiles(returnValue, dto, boardAttachSaveDTOSet);

            String successMsg = msg("tps.board.success.save");
            if (attachMessage.length() > 0) {
                successMsg += "\n" + attachMessage;
            }

            ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto, successMsg);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(actionType);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (InvalidDataException e) {
            log.error("[FAIL TO " + actionType.code() + " BOARD]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(actionType, e);
            throw e;
        }
    }


    /**
     * 삭제
     *
     * @param boardId  게시판 일련번호
     * @param boardSeq 삭제 할 게시판아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 게시판 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "게시판 삭제")
    @DeleteMapping("/{boardId}/contents/{boardSeq}")
    public ResponseEntity<?> deleteBoard(
            @ApiParam("게시판 ID") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq)
            throws InvalidDataException, NoDataException, Exception {


        // 게시판 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data");
        Board board = boardService
                .findBoardBySeq(boardSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));


        // 하위 게시물이 있는 경우 삭제 불가
        if (boardService.countAllBoardByParentBoardSeq(board.getBoardSeq()) > 0) {
            throw new InvalidDataException(msg("tps.board.error.exist-children-contents"));
        }

        try {
            // 삭제
            board.setBoardId(boardId);
            board.setDelYn(MokaConstants.YES);
            boardService.updateBoard(board);
            //boardService.deleteBoard(board);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.common.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE BOARD] boardSeq: {} {}", boardSeq, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.board.error.delete"), e);
        }
    }

    /**
     * 글 순서 변경
     *
     * @param boardSeq 게시물 일련번호
     * @return 성공 여부
     */
    @ApiOperation(value = "글 순서 변경")
    @PutMapping("/{boardSeq}/order")
    public ResponseEntity<?> putOrder(
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq,
            @ApiParam("게시물 순서번호") @RequestParam("ordNo") @Min(value = 0, message = "{tps.board.error.min.ordNo}") Integer ordNo) {

        if (boardService.updateOrdNo(boardSeq, ordNo) > 0) {
            return new ResponseEntity<>(new ResultDTO<>(true, msg("tps.board.success.change-order")), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResultDTO<>(false, msg("tps.board.error.change-order")), HttpStatus.OK);
        }
    }

    /**
     * 게시물 조회 건수 증가
     *
     * @param boardSeq 게시물 일련번호
     * @return 등록된 게시판정보
     */
    @ApiOperation(value = "게시물 조회 건수 증가")
    @PutMapping("/{boardSeq}/views/add")
    public ResponseEntity<?> putViewAdd(
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq) {

        if (boardService.updateViewCnt(boardSeq) > 0) {
            return new ResponseEntity<>(new ResultDTO<>(true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResultDTO<>(false), HttpStatus.OK);
        }
    }

    /**
     * 등록
     *
     * @param boardSeq 게시물 일련번호
     * @return 등록된 게시판정보
     */
    @ApiOperation(value = "게시물 조회 건수 증가")
    @PutMapping("/{boardSeq}/recommands/add")
    public ResponseEntity<?> putRecommandAdd(
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq) {

        if (boardService.updateRecomCnt(boardSeq, true) > 0) {
            return new ResponseEntity<>(new ResultDTO<>(true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResultDTO<>(false), HttpStatus.OK);
        }
    }

    /**
     * 등록
     *
     * @param boardSeq 게시물 일련번호
     * @return 등록된 게시판정보
     */
    @ApiOperation(value = "게시물 추천 취소")
    @PutMapping("/{boardSeq}/recommands/cancel")
    public ResponseEntity<?> putRecommandCancel(
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq) {

        if (boardService.updateRecomCnt(boardSeq, false) > 0) {
            return new ResponseEntity<>(new ResultDTO<>(true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResultDTO<>(false), HttpStatus.OK);
        }
    }

    /**
     * 비추천수
     *
     * @param boardSeq 게시물 일련번호
     * @return 등록된 게시판정보
     */
    @ApiOperation(value = "게시물 조회 건수 증가")
    @PutMapping("/{boardSeq}/unrecommands/add")
    public ResponseEntity<?> putUnrecommandAdd(
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq) {

        if (boardService.updateDecomCnt(boardSeq, true) > 0) {
            return new ResponseEntity<>(new ResultDTO<>(true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResultDTO<>(false), HttpStatus.OK);
        }
    }

    /**
     * 등록
     *
     * @param boardSeq 게시물 일련번호
     * @return 등록된 게시판정보
     */
    @ApiOperation(value = "게시물 조회 건수 증가")
    @PutMapping("/{boardSeq}/unrecommands/cancel")
    public ResponseEntity<?> putUnrecommandCancel(
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq) {

        if (boardService.updateDecomCnt(boardSeq, false) > 0) {
            return new ResponseEntity<>(new ResultDTO<>(true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResultDTO<>(false), HttpStatus.OK);
        }
    }

    /**
     * 등록
     *
     * @param boardSeq 게시물 일련번호
     * @return 등록된 게시판정보
     */
    @ApiOperation(value = "게시물 조회 건수 증가")
    @PutMapping("/{boardSeq}/reports/add")
    public ResponseEntity<?> putReportAdd(
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq) {

        if (boardService.updateDeclareCnt(boardSeq, true) > 0) {
            return new ResponseEntity<>(new ResultDTO<>(true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResultDTO<>(false), HttpStatus.OK);
        }
    }

    /**
     * 게시물 신고 취소
     *
     * @param boardSeq 게시물 일련번호
     * @return 등록된 게시판정보
     */
    @ApiOperation(value = "게시물 신고 취소")
    @PutMapping("/{boardSeq}/reports/cancel")
    public ResponseEntity<?> putReportCancel(
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq) {

        if (boardService.updateDeclareCnt(boardSeq, false) > 0) {
            return new ResponseEntity<>(new ResultDTO<>(true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResultDTO<>(false), HttpStatus.OK);
        }
    }

    private void setRegisterInfo(Board board, Principal principal) {
        UserDTO userDTO = (UserDTO) ((UsernamePasswordAuthenticationToken) principal).getDetails();
        board.setRegName(userDTO.getUserName());
        board.setRegDiv(TpsConstants.BOARD_REG_DIV_ADMIN);
        board.setRegIp(HttpHelper.getRemoteAddr());
    }

    /**
     * 푸시, 메일 파라미터 검증
     *
     * @param boardInfo 게시판정보
     * @param board     게시물정보
     * @throws InvalidDataException 오류데이터 에러 처리
     */
    private void validInteractionOperation(BoardInfo boardInfo, Board board)
            throws InvalidDataException {

        // 답변푸시설정이 안되어 있는 게시판에 게시물의 답변푸시수신이 Y로 되어 있는 경우
        if (boardInfo
                .getAnswPushYn()
                .equals(MokaConstants.NO)) {
            if (board
                    .getPushReceiveYn()
                    .equals(MokaConstants.YES)) {
                new InvalidDataException(msg("tps.board.error.do-not-push"));
            }
        }

        // 답변푸시수신이 Y로 되어 있지만 푸시 전송 정보가 누락되어 있는 경우
        if (board
                .getPushReceiveYn()
                .equals(MokaConstants.YES)) {
            if (McpString.isEmpty(board.getAppOs()) || McpString.isEmpty(board.getDevDiv()) || McpString.isEmpty(board.getToken())) {
                new InvalidDataException(msg("tps.board.error.need-push-info"));
            }
        }

        // 이메일 발송 설정이 안되어 있는 게시판의 게시물에 이메일수신이 Y로 되어 있는 경우
        if (boardInfo
                .getEmailSendYn()
                .equals(MokaConstants.NO)) {
            if (board
                    .getEmailReceiveYn()
                    .equals(MokaConstants.YES)) {
                new InvalidDataException(msg("tps.board.error.do-not-email"));
            }
        }

        // 게시물에 이메일수신이 Y로 되어 있는 경우, 이메일 주소 입력 여부 체크
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
            // 파일 첨부 가능 여부 체크
            if (McpString
                    .defaultValue(boardInfo.getFileYn(), MokaConstants.NO)
                    .equals(MokaConstants.NO)) {
                throw new InvalidDataException(msg("tps.board.error.file-attach-disable"));
            }

            // 최대 파일 건수 체크
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

                        // 개별 파일 확장자 검사
                        if (ext != null && !board
                                .getBoardInfo()
                                .getAllowFileExt()
                                .contains(ext)) {
                            message.append(message.length() > 0 ? "\n" : "");
                            message.append(msg("tps.board.error.file-ext", boardAttachSaveDTO
                                    .getAttachFile()
                                    .getOriginalFilename()));
                        } else {
                            // 개별 파일의 사이즈 검사
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
                                // root 디렉토리(/bbs_attach)/board/게시판설정정보번호(BOARDINFO_SEQ)/파일명

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
        } else { // 수정시 클라이언트로 부터 전달된 첨부파일 정보가 없을 경우 무조건 삭제 처리 한번 한다.
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
     * 본문에 첨부되는 이미지 업로드
     *
     * @param boardId 등록할 게시판 ID
     * @return 등록된 게시판정보
     */
    @ApiOperation(value = "본문에 첨부되는 이미지 업로드")
    @PostMapping("/{boardId}/image")
    public ResponseEntity<?> postUploadContentImage(
            @ApiParam("게시판 ID") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            MultipartFile attachFile)
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

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.UPLOAD);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



}
