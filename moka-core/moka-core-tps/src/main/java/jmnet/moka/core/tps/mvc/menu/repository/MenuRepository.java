/**
 * msp-tps MenuRepository.java 2020. 6. 22. 오전 11:22:20 ssc
 */
package jmnet.moka.core.tps.mvc.menu.repository;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;

/**
 * <pre>
 * 
 * 2020. 6. 22. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 22. 오전 11:22:20
 * @author ssc
 */
public interface MenuRepository extends JpaRepository<Menu, Long> {
    public List<Menu> findByUsedYn(String useYn, Sort sort);
}
