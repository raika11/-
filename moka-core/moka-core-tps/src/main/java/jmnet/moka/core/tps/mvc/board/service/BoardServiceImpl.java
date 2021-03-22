package jmnet.moka.core.tps.mvc.board.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.dto.JpodNoticeSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.entity.BoardAttach;
import jmnet.moka.core.tps.mvc.board.entity.JpodBoard;
import jmnet.moka.core.tps.mvc.board.repository.BoardAttachRepository;
import jmnet.moka.core.tps.mvc.board.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Page<Board> findAllBoard(Integer boardId, BoardSearchDTO searchDTO) {
        return boardRepository.findAllBoard(boardId, searchDTO);
    }

    @Override
    public List<Board> findAllBoardByParentBoardSeq(Integer boardId, Long parentBoardSeq) {
        return null;
    }

    @Override
    public Page<JpodBoard> findAllJpodNotice(JpodNoticeSearchDTO searchDTO) {
        return boardRepository.findAllJpodNotice(searchDTO);
    }

    @Override
    public Long countAllBoardByParentBoardSeq(Long parentBoardSeq) {
        return boardRepository.countByParentBoardSeq(parentBoardSeq, MokaConstants.NO);
    }

    @Override
    public Optional<Board> findBoardBySeq(Long boardSeq) {
        return boardRepository.findByBoardSeq(boardSeq);
    }

    @Override
    @Transactional
    public Board insertBoard(Board board) {
        return boardRepository.saveAndFlush(board);
    }

    @Override
    @Transactional
    public Board updateBoard(Board board) {
        return boardRepository.save(board);
    }

    @Override
    @Transactional
    public long updateBoardParentSeq(Long boardSeq, Long parentBoardSeq) {
        return boardRepository.updateParentBoardSeq(boardSeq, parentBoardSeq);
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
    public BoardAttach updateBoardAttach(BoardAttach boardAttach) {
        return boardAttachRepository.save(boardAttach);
    }

    @Override
    public void deleteBoardAttach(BoardAttach boardAttach) {
        boardAttachRepository.delete(boardAttach);
    }

    @Override
    public void deleteAllBoardAttach(List<BoardAttach> boardAttachSet) {
        if (boardAttachSet != null && boardAttachSet.size() > 0) {
            boardAttachSet.forEach(boardAttach -> {
                if (boardAttach != null && boardAttach.getSeqNo() > 0) {
                    boardAttachRepository.deleteById(boardAttach.getSeqNo());
                }
            });
        }
    }

    @Override
    public void deleteAllBoardAttach(Long boardSeq) {
        boardAttachRepository.deleteByBoardSeq(boardSeq);
    }


    @Override
    public Optional<Board> findTopBoard(Integer boardId) {
        return boardRepository.findTopByBoardId(boardId);
    }

    @Override
    public long updateOrdNo(Long boardSeq, Integer ordNo) {
        return boardRepository.updateOrdNo(boardSeq, ordNo);
    }

    @Override
    public long updateViewCnt(Long boardSeq) {
        return boardRepository.updateViewCnt(boardSeq);
    }

    @Override
    public long updateRecomCnt(Long boardSeq, boolean add) {
        return boardRepository.updateRecomCnt(boardSeq, add);
    }

    @Override
    public long updateDecomCnt(Long boardSeq, boolean add) {
        return boardRepository.updateDecomCnt(boardSeq, add);
    }

    @Override
    public long updateDeclareCnt(Long boardSeq, boolean add) {
        return boardRepository.updateDeclareCnt(boardSeq, add);
    }
}
