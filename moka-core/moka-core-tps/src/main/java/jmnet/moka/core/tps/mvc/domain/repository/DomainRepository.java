/**
 * msp-tps DomainInfoRepository.java 2020. 1. 8. 오후 2:04:49 ssc
 */
package jmnet.moka.core.tps.mvc.domain.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * 도메인 Repository
 * 2020. 1. 8. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:04:49
 */
@Repository
public interface DomainRepository extends JpaRepository<Domain, String> {
    /**
     * 서비스플랫폼별 도메인조회
     *
     * @param servicePlatform 서비스플랫폼
     * @return 도메인목록
     */
    List<Domain> findByServicePlatformOrderByUsedYn(String servicePlatform);
}
