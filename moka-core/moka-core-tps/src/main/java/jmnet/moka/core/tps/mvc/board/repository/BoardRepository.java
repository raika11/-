package jmnet.moka.core.tps.mvc.board.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BoardRepository extends JpaRepository<Board, Long>, JpaSpecificationExecutor<Board>, BoardRepositorySupport {

    Optional<Board> findTopByBoardId(Integer boardId);

    Long countByParentBoardSeq(Long parentBoardSeq, String delYn);
}
