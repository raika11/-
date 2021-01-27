package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


/**
 * 배포서버 Service
 * 2021. 1. 26. 김정민
 *
 */
public interface DistributeServerService {

    public List<DistributeServer> findDistibuteServerList();

    public Page<DistributeServer> findList(DistributeServerSearchDTO search);
}
