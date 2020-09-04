/**
 * msp-tps StyleRepository.java 2020. 4. 29. 오후 2:42:05 ssc
 */
package jmnet.moka.core.tps.mvc.style.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.style.entity.Style;

/**
 * <pre>
 * 
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 29. 오후 2:42:05
 * @author ssc
 */
public interface StyleRepository extends JpaRepository<Style, Long>, StyleRepositorySupport {


}
