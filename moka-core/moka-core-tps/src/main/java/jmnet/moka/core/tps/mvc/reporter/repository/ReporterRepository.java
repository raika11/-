/**
 * msp-tps DomainInfoRepository.java 2020. 1. 8. 오후 2:04:49 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.repository;

import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * 기자관리 Repository
 * 2020. 11. 10. ssc 최초생성
 * </pre>
 * 
 * 2020. 11. 10. 오후 2:04:49
 * @author ssc
 */
@Repository
public interface ReporterRepository extends JpaRepository<Reporter, String>, ReporterRepositorySupport {
    // 페이지목록. 페이징O
    public Page<Reporter> findList(ReporterSearchDTO search, Pageable pageable);

}