/**
 * msp-tps DomainInfoRepository.java 2020. 1. 8. 오후 2:04:49 ssc
 */
package jmnet.moka.core.tps.mvc.bulk.repository;

import jmnet.moka.core.tps.mvc.bulk.dto.BulkSearchDTO;
import jmnet.moka.core.tps.mvc.bulk.entity.Bulk;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *  벌크 문구 Repository
 * 2020. 11. 10. ssc 최초생성
 * </pre>
 * <p>
 * 2020. 11. 10. 오후 2:04:49
 *
 * @author ssc
 */
@Repository
public interface BulkRepository extends JpaRepository<Bulk, Long>, JpaSpecificationExecutor<Bulk>, BulkRepositorySupport {

    Page<Bulk> findAllBulkList(BulkSearchDTO search);
}
