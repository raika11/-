/**
 * msp-tps StyleRefRepository.java 2020. 4. 29. 오후 2:44:32 ssc
 */
package jmnet.moka.core.tps.mvc.style.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.style.entity.StyleRef;

/**
 * <pre>
 * 
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 29. 오후 2:44:32
 * @author ssc
 */
public interface StyleRefRepository extends JpaRepository<StyleRef, Long> {

}
