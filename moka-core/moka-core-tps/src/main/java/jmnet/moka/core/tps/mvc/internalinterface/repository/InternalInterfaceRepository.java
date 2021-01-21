package jmnet.moka.core.tps.mvc.internalinterface.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.internalinterface.entity.InternalInterface;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * 내부 시스템 API관리 Repository
 */
public interface InternalInterfaceRepository
        extends JpaRepository<InternalInterface, Long>, JpaSpecificationExecutor<InternalInterface>, InternalInterfaceRepositorySupport {

    /**
     * API관리 상세조회
     *
     * @param seqNo API 일련번호
     * @param delYn 삭제여부
     * @return API정보
     */
    Optional<InternalInterface> findBySeqNoAndDelYn(Long seqNo, String delYn);
}
