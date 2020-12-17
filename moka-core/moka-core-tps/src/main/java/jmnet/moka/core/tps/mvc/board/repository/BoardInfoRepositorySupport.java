package jmnet.moka.core.tps.mvc.board.repository;

import jmnet.moka.core.tps.mvc.board.dto.BoardInfoSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.repository
 * ClassName : BoardInfoRepositorySupport
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 11:54
 */
public interface BoardInfoRepositorySupport {
    Page<BoardInfo> findAllBoardInfo(BoardInfoSearchDTO searchDTO);
}
