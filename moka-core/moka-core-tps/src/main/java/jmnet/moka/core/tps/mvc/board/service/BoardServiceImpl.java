package jmnet.moka.core.tps.mvc.board.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.entity.BoardAttach;
import jmnet.moka.core.tps.mvc.board.repository.BoardAttachRepository;
import jmnet.moka.core.tps.mvc.board.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.service
 * ClassName : BoardServiceImpl
 * Created : 2020-12-16 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-16 16:28
 */
@Service
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    private final BoardAttachRepository boardAttachRepository;

    @Autowired
    public BoardServiceImpl(BoardRepository boardRepository, BoardAttachRepository boardAttachRepository) {
        this.boardRepository = boardRepository;
        this.boardAttachRepository = boardAttachRepository;
    }



    @Override
    public Page<Board> findAllBoard(BoardSearchDTO searchDTO) {
        return boardRepository.findAllBoard(searchDTO);
    }

    @Override
    public Optional<Board> findBoardBySeq(Long boardSeq) {
        return boardRepository.findById(boardSeq);
    }

    @Override
    public Board insertBoard(Board board) {
        return boardRepository.save(board);
    }

    @Override
    public Board updateBoard(Board board) {
        return boardRepository.save(board);
    }

    @Override
    public void deleteBoard(Board board) {
        boardRepository.delete(board);
    }

    @Override
    public void deleteBoard(Long boardSeq) {
        boardRepository.deleteById(boardSeq);
    }

    @Override
    public List<BoardAttach> findAllBoardAttach(Long boardSeq) {
        return boardAttachRepository.findAllByBoardSeq(boardSeq);
    }

    @Override
    public BoardAttach insertBoardAttach(BoardAttach boardAttach) {
        return boardAttachRepository.save(boardAttach);
    }

    @Override
    public void deleteBoardAttach(BoardAttach boardAttach) {
        boardAttachRepository.delete(boardAttach);
    }

    @Override
    public void deleteAllBoardAttach(Long boardSeq) {
        boardAttachRepository.deleteByBoardSeq(boardSeq);
    }


    @Override
    public Optional<Board> findTopBoard(Integer boardId) {
        return boardRepository.findTopByBoardId(boardId);
    }
}
