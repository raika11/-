/**
 * msp-tps ReservedRepository.java 2020. 6. 17. 오전 11:29:31 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.reserved.entity.Reserved;

/**
 * <pre>
 * 
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 17. 오전 11:29:31
 * @author ssc
 */
public interface ReservedRepository
        extends JpaRepository<Reserved, Long>, ReservedRepositorySupport {

    /**
     * 도메인아이디와 관련된 예약어 목록 조회
     * @param domainId 도메인아이디
     * @param pageable 페이지
     * @return 예약어 목록
     */
    public Page<Reserved> findByDomain_DomainId(String domainId, Pageable pageable);
    
    /**
     * 도메인아이디와 관련된 예약어수
     * @param domainId 도메인아이디
     * @return 예약어수
     */
    public int countByDomain_DomainId(String domainId);
}
