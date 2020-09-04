/**
 * msp-tps DatasetInfoRepository.java 2020. 4. 24. 오후 4:21:20 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;

/**
 * <pre>
 * 
 * 2020. 4. 24. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 24. 오후 4:21:20
 * @author ssc
 */
public interface DatasetRepository
        extends JpaRepository<Dataset, Long>, DatasetRepositorySupport {

}
