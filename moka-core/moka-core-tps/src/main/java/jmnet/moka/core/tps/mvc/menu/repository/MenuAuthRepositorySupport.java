package jmnet.moka.core.tps.mvc.menu.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;

public interface MenuAuthRepositorySupport {
    public Optional<MenuAuth> findGroupMemberDivMenu(String groupMemberId, String menuId, String groupMemberDiv);

    public Optional<MenuAuth> findGroupMemberDivMenu(MenuAuth menuAuth);
}
