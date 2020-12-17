package jmnet.moka.core.tps.mvc.board.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.board.dto.BoardInfoSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.service
 * ClassName : BoardInfoService
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 11:29
 */
public interface BoardInfoService {
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
    Optional<BoardInfo> findBoardInfoById(Integer boardId);

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
    void deleteBoardInfo(BoardInfo boardInfo);

    /**
     * 게시판 정보 삭제
     *
     * @param boardId 게시판 정보 ID
     * @return 삭제 건수
     */
    void deleteBoardInfo(Integer boardId);

    boolean hasBoard(Integer boardId);
}
