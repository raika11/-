package jmnet.moka.core.tps.mvc.board.repository;

import jmnet.moka.core.tps.mvc.board.entity.BoardAttach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BoardAttachRepository extends JpaRepository<BoardAttach, Long>, JpaSpecificationExecutor<BoardAttach> {

}
