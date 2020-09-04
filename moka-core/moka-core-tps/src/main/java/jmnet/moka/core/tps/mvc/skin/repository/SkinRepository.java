package jmnet.moka.core.tps.mvc.skin.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.skin.entity.Skin;

public interface SkinRepository extends JpaRepository<Skin, Long>, SkinRepositorySupport {
    
    /**
     * 서비스명과 도메인아이디로 콘텐츠스킨 목록 조회
     * @param skinServiceName 서비스명
     * @param domainId 도메인아이디
     * @return 콘텐츠스킨 목록
     */
    public List<Skin> findBySkinServiceNameAndDomain_DomainId(String skinServiceName, String domainId);
    
    /**
     * 도메인아이디와 관련된 콘텐츠스킨 목록 조회
     * @param domainId 도메인아이디
     * @param pageable Pageable
     * @return 콘텐츠스킨 목록
     */
    public Page<Skin> findByDomain_DomainId(String domainId, Pageable pageable);
    
    /**
     * 도메인아이디와 관련된 콘텐츠스킨수
     * @param domainId 도메인아이디
     * @return 콘텐츠스킨 수
     */
    public int countByDomain_DomainId(String domainId);
}
