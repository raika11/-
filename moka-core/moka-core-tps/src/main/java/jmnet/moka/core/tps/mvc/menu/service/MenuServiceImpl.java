/**
 * msp-tps MenuService.java 2020. 6. 22. 오전 11:40:40 ssc
 */
package jmnet.moka.core.tps.mvc.menu.service;

import java.util.Iterator;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNode;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import jmnet.moka.core.tps.mvc.menu.repository.MenuRepository;

/**
 * <pre>
 * 
 * 2020. 6. 22. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 22. 오전 11:40:40
 * @author ssc
 */
@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    MenuRepository menuRepository;

    @Override
    public MenuNode makeTree() {
        List<Menu> menuList = menuRepository.findByUseYn("Y", orderByIdAsc());
        return menuList.isEmpty() ? null : makeTree(menuList);
    }

    private MenuNode makeTree(List<Menu> menuList) {
        MenuNode rootNode = new MenuNode();
        rootNode.setSeq((long) 0);
        rootNode.setMenuId("");
        rootNode.setMenuName("ROOT");

        Iterator<Menu> it = menuList.iterator();
        while (it.hasNext()) {
            Menu menu = it.next();
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
        return new Sort(Sort.Direction.ASC, "parentMenuId")
                .and(new Sort(Sort.Direction.ASC, "menuOrder"));
    }

}
