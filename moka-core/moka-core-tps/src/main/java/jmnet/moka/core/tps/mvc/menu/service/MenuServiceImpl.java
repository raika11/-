package jmnet.moka.core.tps.mvc.menu.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNode;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import jmnet.moka.core.tps.mvc.menu.repository.MenuAuthRepository;
import jmnet.moka.core.tps.mvc.menu.repository.MenuRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * 2020. 6. 22. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 22. 오전 11:40:40
 */
@Service
public class MenuServiceImpl implements MenuService {

    final MenuRepository menuRepository;

    final MenuAuthRepository menuAuthRepository;

    public MenuServiceImpl(MenuRepository menuRepository, MenuAuthRepository menuAuthRepository) {
        this.menuRepository = menuRepository;
        this.menuAuthRepository = menuAuthRepository;
    }

    @Override
    public MenuNode makeTree() {
        List<Menu> menuList = menuRepository.findByUsedYn("Y", orderByIdAsc());
        return menuList.isEmpty() ? null : makeTree(menuList);
    }

    private MenuNode makeTree(List<Menu> menuList) {
        MenuNode rootNode = new MenuNode();
        rootNode.setSeq((long) 0);
        rootNode.setMenuId("");
        rootNode.setMenuName("ROOT");

        for (Menu menu : menuList) {
            if (McpString.isEmpty(menu.getParentMenuId())) {
                MenuNode menuNode = new MenuNode(menu);
                rootNode.addNode(menuNode);
                // rootNode.setMatch(getMatch(menu, search));
            } else {
                MenuNode parentNode = rootNode.findNode(menu.getParentMenuId(), rootNode);
                if (parentNode != null) {
                    MenuNode menuNode = new MenuNode(menu);
                    // menuNode.setMatch(getMatch(menu, search));
                    parentNode.addNode(menuNode);
                }
            }
        }
        rootNode.sort();
        return rootNode;
    }

    private Sort orderByIdAsc() {
        return new Sort(Sort.Direction.ASC, "parentMenuId").and(new Sort(Sort.Direction.ASC, "menuOrder"));
    }

    @Override
    public Page<Menu> findMenuList(SearchDTO search) {
        return menuRepository.findAll(search.getPageable());
    }

    @Override
    public List<Menu> findMenuList() {
        return menuRepository.findAll();
    }

    @Override
    public Optional<Menu> findMenuById(String menuId) {
        return menuRepository.findByMenuId(menuId);
    }

    @Override
    public Menu insertMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    @Override
    public Menu updateMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    @Override
    @Transactional
    public void deleteMenu(Menu menu) {
        List<MenuAuth> menuAuths = this.findMenuAuthList(menu.getMenuId());

        menuAuths.forEach(this::deleteMenuAuth);
        menuRepository.delete(menu);
    }

    @Override
    public void deleteMenuById(String menuId) {
        this.findMenuById(menuId)
            .ifPresent(this::deleteMenu);
    }

    @Override
    public boolean isDuplicatedId(String menuId) {
        Optional<Menu> existingMenu = this.findMenuById(menuId);
        return existingMenu.isPresent();
    }

    @Override
    public MenuAuth insertMenuAuth(MenuAuth menuAuth) {
        return menuAuthRepository.save(menuAuth);
    }

    @Override
    public MenuAuth updateMenuAuth(MenuAuth menuAuth) {
        return menuAuthRepository.save(menuAuth);
    }

    @Override
    public void deleteMenuAuth(MenuAuth menuAuth) {
        menuAuthRepository.delete(menuAuth);
    }

    @Override
    public void deleteMenuAuth(Long seqNo) {
        menuAuthRepository.deleteById(seqNo);
    }

    @Override
    public List<MenuAuth> findMenuAuthList(String menuId) {
        return menuAuthRepository.findAllByMenuId(menuId);
    }

}
