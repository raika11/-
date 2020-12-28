package jmnet.moka.core.tps.mvc.ad.repository;

import jmnet.moka.core.tps.mvc.ad.entity.Ad;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdRepository extends JpaRepository<Ad, Long> {

    /**
     * 도메인아이디와 관련된 광고 목록 조회
     *
     * @param domainId 도메인아이디
     * @param pageable 페이지
     * @return 광고 목록
     */
    public Page<Ad> findByDomain_DomainId(String domainId, Pageable pageable);

    /**
     * 도메인아이디와 관련된 광고수
     *
     * @param domainId 도메인아이디
     * @return 광고수
     */
    public int countByDomain_DomainId(String domainId);
}
