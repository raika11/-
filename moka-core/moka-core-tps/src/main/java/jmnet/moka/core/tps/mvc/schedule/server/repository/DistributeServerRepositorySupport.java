package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 배포서버 Repository
 * 2021. 1. 26. 김정민
 *
 */
public interface DistributeServerRepositorySupport {

    //배포서버목록 조회(조회조건 코드)
    List<DistributeServer> findDistibuteServerList();

    /**
     * 배포서버목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 배포서버목록
     */
    Page<DistributeServer> findList(DistributeServerSearchDTO search, Pageable pageable);
}