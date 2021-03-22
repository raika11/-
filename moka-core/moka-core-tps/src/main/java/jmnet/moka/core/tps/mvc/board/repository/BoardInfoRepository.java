package jmnet.moka.core.tps.mvc.board.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BoardInfoRepository extends JpaRepository<BoardInfo, Integer>, JpaSpecificationExecutor<BoardInfo>, BoardInfoRepositorySupport {

    List<BoardInfo> findAllByChannelTypeAndUsedYn(String channelType, String usedYn);
}
