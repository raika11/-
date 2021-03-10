package jmnet.moka.core.tps.mvc.board.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.dto.JpodNoticeSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.repository
 * ClassName : BoardRepositorySupport
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 11:52
 */
public interface BoardRepositorySupport {
    Page<Board> findAllBoard(Integer boardId, BoardSearchDTO searchDTO);

    Page<Board> findAllJpodNotice(JpodNoticeSearchDTO searchDTO);

    long updateParentBoardSeq(Long boardSeq, Long parentBoardSeq);

    long updateOrdNo(Long boardSeq, Integer ordNo);

    long updateViewCnt(Long boardSeq);

    long updateRecomCnt(Long boardSeq, boolean add);

    long updateDecomCnt(Long boardSeq, boolean add);

    long updateDeclareCnt(Long boardSeq, boolean add);

    Optional<Board> findByBoardSeq(Long boardSeq);

    Long countByParentBoardSeq(Long parentBoardSeq, String delYn);

}
