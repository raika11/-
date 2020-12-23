package jmnet.moka.core.tps.mvc.board.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Set;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardAttachSaveDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardSaveDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.entity.BoardAttach;
import jmnet.moka.core.tps.mvc.board.service.BoardService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
import org.springframework.web.bind.annotation.RestController;

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

    private final FtpHelper ftpHelper;

    public BoardRestController(BoardService boardService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger,
            FtpHelper ftpHelper) {
        this.boardService = boardService;
        this.ftpHelper = ftpHelper;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
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
     * @return 게시판정보
     * @throws NoDataException 게시판 정보가 없음
     */
    @ApiOperation(value = "게시판 조회")
    @GetMapping("/{boardId}/contents/{boardSeq}")
    public ResponseEntity<?> getBoard(
            @ApiParam("게시판 ID") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @ApiParam("게시물 일련번호") @PathVariable("boardSeq") @Min(value = 1, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        Board board = boardService
                .findBoardBySeq(boardSeq)
                .orElseThrow(() -> new NoDataException(message));

        BoardDTO dto = modelMapper.map(board, BoardDTO.class);


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
            @Valid BoardSaveDTO boardDTO, @ApiParam(hidden = true) @NotNull Principal principal) {

        // BoardDTO -> Board 변환
        Board board = modelMapper.map(boardDTO, Board.class);
        board.setBoardId(boardId);
        board.setParentBoardSeq(0L);
        board.setDepth(0);
        setRegisterInfo(board, principal);


        Board returnValue = boardService.insertBoard(board);
        returnValue.setParentBoardSeq(returnValue.getBoardSeq());
        returnValue = boardService.updateBoard(returnValue);

        saveAttachFiles(returnValue, boardDTO.getAttaches());

        // 결과리턴
        BoardDTO dto = modelMapper.map(returnValue, BoardDTO.class);
        ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto);

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
        setRegisterInfo(board, principal);
        try {
            if (board.getParentBoardSeq() == null || board.getParentBoardSeq() == 0) {
                throw new InvalidDataException(msg("tps.board.error.min.parentBoardSeq"));
            }

            boardService
                    .findBoardBySeq(board.getParentBoardSeq())
                    .orElseThrow(() -> new NoDataException(msg("tps.board.error.no-data.parentBoardSeq")));

        } catch (Exception e) {
            log.error("[FAIL TO INSERT BOARD]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.board.error.save"), e);
        }

        return processBoardContents(board, boardDTO.getAttaches());
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

        // 오리진 데이터 조회
        Board oldBoard = boardService
                .findBoardBySeq(newBoard.getBoardSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        return processUpdateEntity(newBoard, oldBoard, boardDTO.getAttaches());

    }

    private ResponseEntity<?> processUpdateEntity(Board newBoard, Board oldBoard, List<BoardAttachSaveDTO> boardAttachSaveDTOSet)
            throws Exception {
        newBoard.setRecomCnt(oldBoard.getRecomCnt());
        newBoard.setViewCnt(oldBoard.getViewCnt());
        newBoard.setDeclareCnt(oldBoard.getDeclareCnt());
        newBoard.setDecomCnt(oldBoard.getDecomCnt());
        newBoard.setRegName(oldBoard.getRegName());
        newBoard.setRegIp(oldBoard.getRegIp());
        newBoard.setAttaches(oldBoard.getAttaches());
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

        // 오리진 데이터 조회
        Board oldBoard = boardService
                .findBoardBySeq(newBoard.getBoardSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));

        // 답변글인데 부모 일련번호 빈값이면 에러 처리
        if (newBoard.getParentBoardSeq() == null || newBoard.getParentBoardSeq() == 0) {
            throw new InvalidDataException(msg("tps.board.error.min.parentBoardSeq"));
        }

        // 부모 일련번호 DB에 없으면 에러 처리
        boardService
                .findBoardBySeq(newBoard.getParentBoardSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.board.error.no-data.parentBoardSeq")));

        // 기존 상위 게시물 일련번호와 현재 일련번호가 바뀌면 에러 처리
        if (!oldBoard
                .getParentBoardSeq()
                .equals(newBoard.getParentBoardSeq())) {
            throw new InvalidDataException(msg("tps.board.error.unmatched-parentBoardSeq"));
        }

        return processUpdateEntity(newBoard, oldBoard, boardDTO.getAttaches());
    }

    /**
     * 게시판 등록 수정 처리
     *
     * @param board 게시물 정보
     * @return ResponseEntity
     * @throws Exception 공통 에러 처리
     */
    private ResponseEntity<?> processBoardContents(Board board, List<BoardAttachSaveDTO> boardAttachSaveDTOSet)
            throws Exception {
        ActionType actionType = board.getBoardSeq() != null && board.getBoardSeq() > 0 ? ActionType.UPDATE : ActionType.INSERT;
        try {
            // insert or update
            Board returnValue = actionType == ActionType.UPDATE ? boardService.updateBoard(board) : boardService.insertBoard(board);

            saveAttachFiles(returnValue, boardAttachSaveDTOSet);

            // 결과리턴
            BoardDTO dto = modelMapper.map(returnValue, BoardDTO.class);
            ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(actionType);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO " + actionType.code() + " BOARD]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(actionType, e);
            throw new Exception(msg("tps.board.error.save"), e);
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
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE BOARD] boardSeq: {} {}", boardSeq, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.board.error.delete"), e);
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
        board.setRegIp(HttpHelper.getRemoteAddr());
    }

    private void saveAttachFiles(Board board, List<BoardAttachSaveDTO> boardAttachSaveDTOSet) {
        Set<BoardAttach> attaches = board.getAttaches();
        if (boardAttachSaveDTOSet != null && boardAttachSaveDTOSet.size() > 0) {
            boardAttachSaveDTOSet.forEach(boardAttachSaveDTO -> {
                try {
                    if (boardAttachSaveDTO.getAttachFile() != null) {
                        String ext = McpFile.getExtension(boardAttachSaveDTO
                                .getAttachFile()
                                .getOriginalFilename());
                        String yearMonth = McpDate.dateStr(McpDate.now(), "yyyyMM");
                        String saveFilePath = "/board/" + board.getBoardId() + "/" + yearMonth;
                        String filename = UUIDGenerator.uuid() + "." + ext;
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
                            boardService.insertBoardAttach(BoardAttach
                                    .builder()
                                    .boardId(board.getBoardId())
                                    .boardSeq(board.getBoardSeq())
                                    .fileName(filename)
                                    .filePath(saveFilePath)
                                    .orgFileName(boardAttachSaveDTO
                                            .getAttachFile()
                                            .getOriginalFilename())
                                    .build());
                        }
                    } else {
                        attaches.removeIf(boardAttach -> boardAttachSaveDTO
                                .getSeqNo()
                                .equals(boardAttach.getSeqNo()));
                    }
                } catch (IOException ex) {
                    log.error("[FAIL TO FILE UPLOAD BOARD] boardseq: {} {}", board.getBoardSeq(), ex.getMessage());
                }
            });

            if (attaches != null && attaches.size() > 0) {
                boardService.deleteAllBoardAttach(attaches);
            }
        }
    }



}
