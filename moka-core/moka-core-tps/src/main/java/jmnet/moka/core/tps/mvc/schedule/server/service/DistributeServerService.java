package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;


/**
 * 배포서버 Service
 * 2021. 1. 26. 김정민
 *
 */
public interface DistributeServerService {

    /**
     * 배포서버 목록(코드조회)
     *
     * @param
     * @return 배포서버 목록
     */
    List<DistributeServer> findDistibuteServerCodeList();

    /**
     * 배포서버 목록
     *
     * @param search 조회조건
     * @return 배포서버 목록
     */
    Page<DistributeServer> findDistibuteServerList(DistributeServerSearchDTO search);

    /**
     * 배포서버 상세정보
     *
     * @param serverSeq 서버 일련번호
     * @return 배포서버 상세정보
     */
    Optional<DistributeServer> findDistributeServerById(Long serverSeq);

    /**
     * 배포서버 저장
     *
     * @param distServer 배포서버
     * @return 배포서버 목록
     */
    DistributeServer insertDistributeServer(DistributeServer distServer);

    /**
     * 배포서버 수정
     *
     * @param distServer 배포서버
     * @return 배포서버 목록
     */
    DistributeServer updateDistributeServer(DistributeServer distServer);





    //미사용 추후 삭제예정
    Page<DistributeServerDTO> findList2(DistributeServerSearchDTO search);
}
