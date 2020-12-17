package jmnet.moka.core.tps.mvc.board.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.entity.BoardAttach;
import jmnet.moka.core.tps.mvc.board.repository.BoardAttachRepository;
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

    //private final BoardRepository boardRepository;

    private final BoardAttachRepository boardAttachRepository;

    @Autowired
    public BoardServiceImpl(BoardAttachRepository boardAttachRepository) {
        //this.boardRepository = boardRepository;
        this.boardAttachRepository = boardAttachRepository;
    }



    @Override
    public Page<Board> findAllBoard(BoardSearchDTO searchDTO) {
        return null;
    }

    @Override
    public Optional<Board> findBoardBySeq(Long boardSeq) {
        return null;
    }

    @Override
    public Board insertBoard(Board board) {
        return null;
    }

    @Override
    public Board updateBoard(Board board) {
        return null;
    }

    @Override
    public int deleteBoard(Board board) {
        return 0;
    }

    @Override
    public int deleteBoard(Long boardSeq) {
        return 0;
    }

    @Override
    public List<BoardAttach> findAllBoardAttach(Long boardSeq) {
        return null;
    }

    @Override
    public BoardAttach insertBoardAttach(BoardAttach boardAttach) {
        return null;
    }

    @Override
    public int deleteBoardAttach(BoardAttach boardAttach) {
        return 0;
    }

    @Override
    public int deleteAllBoardAttach(Long boardSeq) {
        return 0;
    }
}
