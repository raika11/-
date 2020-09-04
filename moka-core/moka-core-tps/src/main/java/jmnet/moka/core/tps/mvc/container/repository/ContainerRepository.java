package jmnet.moka.core.tps.mvc.container.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.container.entity.Container;

/**
 * 컨테이너 
 * @author ohtah
 *
 */
public interface ContainerRepository
        extends JpaRepository<Container, Long>, ContainerRepositorySupport {
    
    /**
     * 도메인아이디와 관련된 컨테이너 목록 조회
     * @param domainId 도메인아이디
     * @param pageable Pageable
     * @return 컨테이너 목록
     */
    @EntityGraph(attributePaths = {"domain"})
    public Page<Container> findByDomain_DomainId(String domainId, Pageable pageable);
    
    /**
     * 도메인아이디와 관련된 컨테이너수
     * @param domainId 도메인아이디
     * @return 컨테이너수
     */
    public int countByDomain_DomainId(String domainId);
}
