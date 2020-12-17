package jmnet.moka.core.tps.mvc.board.repository;

import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BoardInfoRepository extends JpaRepository<BoardInfo, Long>, JpaSpecificationExecutor<BoardInfo>, BoardInfoRepositorySupport {

}
