package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;


/**
 * 배포서버 Service
 * 2021. 1. 26. 김정민
 *
 */
public interface DistributeServerService {

    public List<DistributeServer> findDistibuteServerList();

    public Page<DistributeServer> findList(DistributeServerSearchDTO search);

    public Optional<DistributeServer> findDistributeServerById(Long serverSeq);

    public DistributeServer saveDistributeServer(DistributeServer distServer);

    public DistributeServer updateDistributeServer(DistributeServer distServer);






    Page<DistributeServerDTO> findList2(DistributeServerSearchDTO search);
}
