package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import jmnet.moka.core.tps.mvc.schedule.server.repository.DistributeServerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

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
    public List<DistributeServer> findDistibuteServerCodeList() {
        return distServerRepository.findDistibuteServerCodeList();
    }

    @Override
    public Page<DistributeServer> findDistibuteServerList(DistributeServerSearchDTO search){
        return distServerRepository.findDistibuteServerList(search, search.getPageable());
    }

    @Override
    public Optional<DistributeServer> findDistributeServerById(Long serverSeq) {
        return distServerRepository.findById(serverSeq);
    }

    @Override
    public DistributeServer saveDistributeServer(DistributeServer distServer){
        return distServerRepository.save(distServer);
    }

    @Override
    public DistributeServer updateDistributeServer(DistributeServer distServer) {
        return distServerRepository.save(distServer);
    }


    @Override
    public Page<DistributeServerDTO> findList2(DistributeServerSearchDTO search) {
        return distServerRepository.findList2(search, search.getPageable());
    }
}
