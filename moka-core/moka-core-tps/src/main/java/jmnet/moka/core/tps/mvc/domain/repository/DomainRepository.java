/**
 * msp-tps DomainInfoRepository.java 2020. 1. 8. 오후 2:04:49 ssc
 */
package jmnet.moka.core.tps.mvc.domain.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;

/**
 * <pre>
 * 도메인 Repository
 * 2020. 1. 8. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 1. 8. 오후 2:04:49
 * @author ssc
 */
public interface DomainRepository extends JpaRepository<Domain, String> {

    // 매체별 도메인 전체 조회. 페이징
    public Page<Domain> findByMediaId(String mediaId, Pageable pageable);

    // 매체별 도메인 전체 조회(공통도메인 제외). 페이징X
    public List<Domain> findByMediaId(String mediaId);
    
    // 볼륨으로 도메인 개수 검사
    public int countByVolumeId(String volumeId);
}
