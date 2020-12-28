/**
 * msp-tps DatasetInfoRepository.java 2020. 4. 24. 오후 4:21:20 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.repository;

import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 데이타셋 2020. 4. 24. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 4. 24. 오후 4:21:20
 */
@Repository
public interface DatasetRepository extends JpaRepository<Dataset, Long>, DatasetRepositorySupport {

}
