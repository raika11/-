/**
 * msp-tps ReservedRepositorySupport.java 2020. 6. 17. 오전 11:31:58 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.repository;

import jmnet.moka.core.tps.mvc.reserved.dto.ReservedSearchDTO;
import jmnet.moka.core.tps.mvc.reserved.entity.Reserved;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 17. 오전 11:31:58
 */
public interface ReservedRepositorySupport {
    // 페이지목록. 페이징O
    public Page<Reserved> findList(ReservedSearchDTO search, Pageable pageable);
}
