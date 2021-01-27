package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import jmnet.moka.core.tps.mvc.schedule.server.repository.DistributeServerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.List;

@Service
@Slf4j
public class DistributeServerServiceImpl implements DistributeServerService{

    @Autowired
    private DistributeServerRepository distServerRepository;

    private final EntityManager entityManager;

    @Autowired
    public DistributeServerServiceImpl(@Qualifier("tpsEntityManagerFactory") EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<DistributeServer> findDistibuteServerList() {
        return distServerRepository.findDistibuteServerList();
    }

    @Override
    public Page<DistributeServer> findList(DistributeServerSearchDTO search){
        return distServerRepository.findList(search, search.getPageable());
    }
}
