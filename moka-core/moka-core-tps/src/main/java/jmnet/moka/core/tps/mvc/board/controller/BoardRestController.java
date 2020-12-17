package jmnet.moka.core.tps.mvc.board.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.board.dto.BoardDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.service.BoardService;
import jmnet.moka.core.tps.mvc.member.service.MemberService;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
@RequestMapping("/api/board")
@Api(tags = {"게시판 API"})
public class BoardRestController extends AbstractCommonController {

    private final BoardService boardService;

    private final MenuService menuService;

    private final MemberService memberService;

    public BoardRestController(BoardService boardService, ModelMapper modelMapper, MessageByLocale messageByLocale, MenuService menuService,
            TpsLogger tpsLogger, MemberService memberService) {
        this.boardService = boardService;
        this.memberService = memberService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.menuService = menuService;
        this.tpsLogger = tpsLogger;
    }

    /**
     * 게시판목록조회
     *
     * @param search 검색조건
     * @return 게시판목록
     */
    @ApiOperation(value = "게시판 목록 조회")
    @GetMapping
    public ResponseEntity<?> getBoardList(@SearchParam BoardSearchDTO search) {

        ResultListDTO<BoardDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Board> returnValue = boardService.findAllBoard(search);

        // 리턴값 설정
        List<BoardDTO> memberDtoList = modelMapper.map(returnValue.getContent(), BoardDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(memberDtoList);


        ResultDTO<ResultListDTO<BoardDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 게시판정보 조회
     *
     * @param request  요청
     * @param boardSeq 게시판아이디 (필수)
     * @return 게시판정보
     * @throws NoDataException 게시판 정보가 없음
     */
    @ApiOperation(value = "게시판 조회")
    @GetMapping("/{boardSeq}")
    public ResponseEntity<?> getBoard(HttpServletRequest request,
            @ApiParam("게시판코드") @PathVariable("boardSeq") @Min(value = 1, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq)
            throws NoDataException {

        String message = msg("tps.common.error.no-data", request);
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
     * @param request  요청
     * @param boardDTO 등록할 게시판정보
     * @return 등록된 게시판정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "게시판 등록")
    @PostMapping
    public ResponseEntity<?> postBoard(HttpServletRequest request, @Valid BoardDTO boardDTO)
            throws InvalidDataException, Exception {

        // BoardDTO -> Board 변환
        Board board = modelMapper.map(boardDTO, Board.class);

        try {
            // insert
            Board returnValue = boardService.insertBoard(board);


            // 결과리턴
            BoardDTO dto = modelMapper.map(returnValue, BoardDTO.class);
            ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT BOARD]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.board.error.save", request), e);
        }
    }

    /**
     * 수정
     *
     * @param request  요청
     * @param boardSeq 게시판아이디
     * @param boardDTO 수정할 게시판정보
     * @return 수정된 게시판정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "게시판 수정")
    @PutMapping("/{boardSeq}")
    public ResponseEntity<?> putBoard(HttpServletRequest request,
            @ApiParam("게시판코드") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq,
            @Valid BoardDTO boardDTO)
            throws Exception {

        // BoardDTO -> Board 변환
        String infoMessage = msg("tps.common.error.no-data", request);
        Board newBoard = modelMapper.map(boardDTO, Board.class);
        newBoard.setBoardSeq(boardSeq);

        // 오리진 데이터 조회
        boardService
                .findBoardBySeq(newBoard.getBoardSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));



        try {
            // update
            Board returnValue = boardService.updateBoard(newBoard);

            // 결과리턴
            BoardDTO dto = modelMapper.map(returnValue, BoardDTO.class);
            ResultDTO<BoardDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE BOARD]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.board.error.save", request), e);
        }
    }


    /**
     * 삭제
     *
     * @param request  요청
     * @param boardSeq 삭제 할 게시판아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 게시판 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "게시판 삭제")
    @DeleteMapping("/{boardSeq}")
    public ResponseEntity<?> deleteBoard(HttpServletRequest request,
            @ApiParam("게시판코드") @PathVariable("boardSeq") @Size(min = 1, max = 3, message = "{tps.board.error.pattern.boardSeq}") Long boardSeq)
            throws InvalidDataException, NoDataException, Exception {


        // 게시판 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data", request);
        Board board = boardService
                .findBoardBySeq(boardSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));



        try {
            // 삭제
            boardService.deleteBoard(board);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE BOARD] boardSeq: {} {}", boardSeq, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.board.error.delete", request), e);
        }
    }


}
