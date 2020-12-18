package jmnet.moka.core.tps.mvc.board.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.board.dto.BoardInfoSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import jmnet.moka.core.tps.mvc.board.repository.BoardInfoRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.service
 * ClassName : BoardInfoServiceImpl
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 11:30
 */
@Service
public class BoardInfoServiceImpl implements BoardInfoService {

    private final BoardInfoRepository boardInfoRepository;

    private final BoardService boardService;

    public BoardInfoServiceImpl(BoardInfoRepository boardInfoRepository, BoardService boardService) {
        this.boardInfoRepository = boardInfoRepository;
        this.boardService = boardService;
    }

    @Override
    public Page<BoardInfo> findAllBoardInfo(BoardInfoSearchDTO searchDTO) {
        return boardInfoRepository.findAllBoardInfo(searchDTO);
    }

    @Override
    public Optional<BoardInfo> findBoardInfoById(Integer boardId) {
        return boardInfoRepository.findById(boardId);
    }

    @Override
    public BoardInfo insertBoardInfo(BoardInfo boardInfo) {
        return boardInfoRepository.save(boardInfo);
    }

    @Override
    public BoardInfo updateBoardInfo(BoardInfo boardInfo) {
        return boardInfoRepository.save(boardInfo);
    }

    @Override
    public void deleteBoardInfo(BoardInfo boardInfo) {
        boardInfoRepository.delete(boardInfo);
    }

    @Override
    public void deleteBoardInfo(Integer boardId) {
        boardInfoRepository.deleteById(boardId);
    }

    @Override
    public boolean hasContents(Integer boardId) {
        return boardService
                .findTopBoard(boardId)
                .isPresent();
    }
}
