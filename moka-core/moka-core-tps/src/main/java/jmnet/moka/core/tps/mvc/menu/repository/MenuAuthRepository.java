package jmnet.moka.core.tps.mvc.menu.repository;

import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MenuAuthRepository extends JpaRepository<MenuAuth, Integer>,
    JpaSpecificationExecutor<MenuAuth> {

}
