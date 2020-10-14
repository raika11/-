/**
 * msp-tps MenuRepository.java 2020. 6. 22. 오전 11:22:20 ssc
 */
package jmnet.moka.core.tps.mvc.menu.repository;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * <pre>
 *
 * 2020. 6. 22. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 22. 오전 11:22:20
 */
public interface MenuRepository extends JpaRepository<Menu, Long> {
    public List<Menu> findByUsedYn(String useYn, Sort sort);

    public Optional<Menu> findByMenuId(String menuId);
}
