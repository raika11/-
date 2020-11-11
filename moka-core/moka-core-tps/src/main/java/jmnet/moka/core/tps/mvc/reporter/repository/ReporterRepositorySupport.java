/**
 * msp-tps ReservedRepositorySupport.java 2020. 6. 17. 오전 11:31:58 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.repository;

import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 * 
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 17. 오전 11:31:58
 * @author ssc
 */
public interface ReporterRepositorySupport {
    // 페이지목록. 페이징O
    public Page<Reporter> findList(ReporterSearchDTO search, Pageable pageable);
}
