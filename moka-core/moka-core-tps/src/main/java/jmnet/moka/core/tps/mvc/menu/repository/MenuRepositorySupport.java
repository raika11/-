package jmnet.moka.core.tps.mvc.menu.repository;

import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.menu.repository
 * ClassName : MenuRepositorySupport
 * Created : 2020-10-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-23 09:38
 */
public interface MenuRepositorySupport {
    public Page<Menu> findAll(MenuSearchDTO searchDTO);

    public int findMaxOrder(String parentMenuId);
}
