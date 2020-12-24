package jmnet.moka.core.tps.mvc.board.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.entity.BoardAttach;
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
     * 게시물 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 게시물 목록
     */
    Page<Board> findAllBoard(Integer boardId, BoardSearchDTO searchDTO);

    /**
     * 게시물의 하위 게시 목록 건수 조회
     *
     * @param parentBoardSeq 부모 게시물 일련번호
     * @return 게시물 건수
     */
    Long countAllBoardByParentBoardSeq(Long parentBoardSeq);

    /**
     * 게시물 조회
     *
     * @param boardSeq 게시물 일련번호
     * @return 게시물 정보
     */
    Optional<Board> findBoardBySeq(Long boardSeq);

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
     * 부모 게시물 일련번호 변경
     *
     * @param boardSeq       게시물 일련번호
     * @param parentBoardSeq 부모 게시물 일련번호
     * @return 성공 여부
     */
    long updateBoardParentSeq(Long boardSeq, Long parentBoardSeq);

    /**
     * 게시물 삭제
     *
     * @param board 게시물 정보
     */
    void deleteBoard(Board board);

    /**
     * 게시물 삭제
     *
     * @param boardSeq 게시물 일련번호
     */
    void deleteBoard(Long boardSeq);

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
     * 게시물 첨부파일 수정
     *
     * @param boardAttach 게시물
     * @return 게시물 첨부파일
     */
    BoardAttach updateBoardAttach(BoardAttach boardAttach);

    /**
     * 게시물 첨부파일 삭제
     *
     * @param boardAttach 게시물 첨부파일
     * @return 삭제 건수
     */
    void deleteBoardAttach(BoardAttach boardAttach);

    /**
     * 게시물 번호로 첨부파일 삭제
     *
     * @param boardSeq 게시물 일련번호
     * @return 삭제 건수
     */
    void deleteAllBoardAttach(Long boardSeq);

    /**
     * 첨부파일 정보 삭제
     *
     * @param boardAttachSet 첨부파일 Set
     */
    void deleteAllBoardAttach(List<BoardAttach> boardAttachSet);

    /**
     * 게시판 첫번째 글을 조회한다.
     *
     * @param boardId 게시판 ID
     * @return Board
     */
    Optional<Board> findTopBoard(Integer boardId);

    /**
     * 조회수 증가
     *
     * @param boardSeq 게시물 일련번호
     * @return 수정 결과
     */
    long updateViewCnt(Long boardSeq);

    /**
     * 추천수 증가/제거
     *
     * @param boardSeq 게시물 일련번호
     * @param add      증가/감소 여부
     * @return 수정 결과
     */
    long updateRecomCnt(Long boardSeq, boolean add);

    /**
     * 비추천수 증가/제거
     *
     * @param boardSeq 게시물 일련번호
     * @param add      증가/감소 여부
     * @return 수정 결과
     */
    long updateDecomCnt(Long boardSeq, boolean add);

    /**
     * 신고수 증가/제거
     *
     * @param boardSeq 게시물 일련번호
     * @param add      증가/감소 여부
     * @return 수정 결과
     */
    long updateDeclareCnt(Long boardSeq, boolean add);
}
