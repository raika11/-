package jmnet.moka.core.tps.mvc.board.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.board.dto.BoardInfoSearchDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.entity.BoardAttach;
import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import org.springframework.data.domain.Page;

/**
 * <pre>
 * 게시판 Service
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.service
 * ClassName : BoardService
 * Created : 2020-12-15 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-15 17:46
 */
public interface BoardService {

    /**
     * 게시판 정보 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 게시판 정보 목록
     */
    Page<BoardInfo> findAllBoardInfo(BoardInfoSearchDTO searchDTO);

    /**
     * 게시판 정보 상세 조회
     *
     * @param boardId 게시판 ID
     * @return 게시판 정보 상세
     */
    BoardInfo findBoardInfoById(Long boardId);

    /**
     * 게시판 정보 등록
     *
     * @param boardInfo 게시판 정보
     * @return 게시판 정보
     */
    BoardInfo insertBoardInfo(BoardInfo boardInfo);

    /**
     * 게시판 정보 수정
     *
     * @param boardInfo 게시판 정보
     * @return 게시판 정보
     */
    BoardInfo updateBoardInfo(BoardInfo boardInfo);

    /**
     * 게시판 정보 삭제
     *
     * @param boardInfo 게시판 정보
     */
    int deleteBoardInfo(BoardInfo boardInfo);

    /**
     * 게시판 정보 삭제
     *
     * @param boardId 게시판 정보 ID
     * @return 삭제 건수
     */
    int deleteBoardInfo(Long boardId);

    /**
     * 게시물 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 게시물 목록
     */
    Page<Board> findAllBoard(BoardSearchDTO searchDTO);

    /**
     * 게시물 조회
     *
     * @param boardSeq 게시물 일련번호
     * @return 게시물 정보
     */
    Board findBoardBySeq(Long boardSeq);

    /**
     * 게시물 등록
     *
     * @param board 게시물 정보
     * @return 게시물
     */
    Board insertBoard(Board board);

    /**
     * 게시물 수정
     *
     * @param board 게시물 수정
     * @return 게시물
     */
    Board updateBoard(Board board);

    /**
     * 게시물 삭제
     *
     * @param board 게시물 정보
     */
    int deleteBoard(Board board);

    /**
     * 게시물 삭제
     *
     * @param boardSeq 게시물 일련번호
     */
    int deleteBoard(Long boardSeq);

    /**
     * 게시물 첨부파일 목록 조회
     *
     * @param boardSeq 게시물 일련번호
     * @return 게시물 첨부파일 목록
     */
    List<BoardAttach> findAllBoardAttach(Long boardSeq);

    /**
     * 게시물 첨부파일 등록
     *
     * @param boardAttach 게시물
     * @return 게시물 첨부파일
     */
    BoardAttach insertBoardAttach(BoardAttach boardAttach);

    /**
     * 게시물 첨부파일 삭제
     *
     * @param boardAttach 게시물 첨부파일
     * @return 삭제 건수
     */
    int deleteBoardAttach(BoardAttach boardAttach);

    /**
     * 게시물 번호로 첨부파일 삭제
     *
     * @param boardSeq 게시물 일련번호
     * @return 삭제 건수
     */
    int deleteAllBoardAttach(Long boardSeq);
}
