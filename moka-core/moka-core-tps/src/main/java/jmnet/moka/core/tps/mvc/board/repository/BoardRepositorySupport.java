package jmnet.moka.core.tps.mvc.board.repository;

import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
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
    Page<Board> findAllBoard(BoardSearchDTO searchDTO);

    
}
