package jmnet.moka.core.tps.mvc.menu.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.mvc.menu.dto.MenuDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNode;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import jmnet.moka.core.tps.mvc.menu.mapper.MenuMapper;
import jmnet.moka.core.tps.mvc.menu.repository.MenuAuthRepository;
import jmnet.moka.core.tps.mvc.menu.repository.MenuRepository;
import jmnet.moka.core.tps.mvc.menu.vo.MenuVO;
import org.modelmapper.ModelMapper;
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

    final MenuMapper menuMapper;

    final ModelMapper modelMapper;

    public MenuServiceImpl(MenuRepository menuRepository, MenuAuthRepository menuAuthRepository, MenuMapper menuMapper, ModelMapper modelMapper) {
        this.menuRepository = menuRepository;
        this.menuAuthRepository = menuAuthRepository;
        this.menuMapper = menuMapper;
        this.modelMapper = modelMapper;
    }

    @Override
    public MenuNode findServiceMenuTree(MenuSearchDTO searchDTO) {
        List<MenuVO> menuList = menuMapper.findAll(searchDTO);
        return menuList.isEmpty() ? null : makeTree(modelMapper.map(menuList, MenuDTO.TYPE));
    }

    @Override
    public MenuNode findMenuTree() {
        List<Menu> menuList = menuRepository.findAll(orderByIdAsc());
        return menuList.isEmpty() ? null : makeTree(modelMapper.map(menuList, MenuDTO.TYPE));
    }

    private MenuNode makeTree(List<MenuDTO> menuList) {
        MenuNode rootNode = new MenuNode();
        rootNode.setSeq((long) 0);
        rootNode.setMenuId("00000000");
        rootNode.setMenuNm("ROOT");

        for (MenuDTO menu : menuList) {
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
    public Page<Menu> findAllMenu(SearchDTO search) {
        return menuRepository.findAll(search.getPageable());
    }

    @Override
    public List<Menu> findAllMenu() {
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
        this
                .findMenuById(menuId)
                .ifPresent(this::deleteMenu);
    }

    @Override
    public boolean isDuplicatedId(String menuId) {
        Optional<Menu> existingMenu = this.findMenuById(menuId);
        return existingMenu.isPresent();
    }

    @Override
    public boolean isUsedGroupOrMember(String menuId) {
        return menuAuthRepository.countByMenuId(menuId) > 0 ? true : false;
    }

    @Override
    public MenuAuth insertMenuAuth(MenuAuth menuAuth) {
        return menuAuthRepository.save(menuAuth);
    }

    @Override
    public int appendMemberMenuAuth(String memberId, String[] menuIds) {
        final AtomicInteger atomicInteger = new AtomicInteger(0);
        for (String menuId : menuIds) {
            if (appendMenuAuth(memberId, menuId, MenuAuthTypeCode.MEMBER) != null) {
                atomicInteger.addAndGet(1);
            }
        }

        return atomicInteger.get();

    }

    @Override
    public int appendGroupMenuAuth(String groupCd, String[] menuIds) {
        final AtomicInteger atomicInteger = new AtomicInteger(0);
        for (String menuId : menuIds) {
            if (appendMenuAuth(groupCd, menuId, MenuAuthTypeCode.MEMBER) != null) {
                atomicInteger.addAndGet(1);
            }
        }

        return atomicInteger.get();
    }

    @Override
    public int appendMemberMenuAuth(String[] memberIds, String menuId) {
        return appendMenuAuth(memberIds, menuId, MenuAuthTypeCode.MEMBER);
    }

    @Override
    public int appendGroupMenuAuth(String[] groupCds, String menuId) {
        return appendMenuAuth(groupCds, menuId, MenuAuthTypeCode.GROUP);
    }

    @Override
    public int appendMenuAuth(String[] groupMemberIds, String menuId, MenuAuthTypeCode menuAuthTypeCode) {
        final AtomicInteger atomicInteger = new AtomicInteger(0);
        this
                .findMenuById(menuId)
                .ifPresent(menu -> {
                    for (String groupMemberId : groupMemberIds) {
                        if (appendMenuAuth(groupMemberId, menu.getMenuId(), menuAuthTypeCode) != null) {
                            atomicInteger.addAndGet(1);
                        }
                    }
                });
        return atomicInteger.get();
    }

    @Override
    public int appendMenuAuth(String[] groupMemberIds, Menu menu, MenuAuthTypeCode menuAuthTypeCode) {
        final AtomicInteger atomicInteger = new AtomicInteger(0);
        for (String groupMemberId : groupMemberIds) {
            if (appendMenuAuth(groupMemberId, menu.getMenuId(), menuAuthTypeCode) != null) {
                atomicInteger.addAndGet(1);
            }
        }
        return atomicInteger.get();
    }

    @Override
    public MenuAuth appendMenuAuth(String groupMemberId, String menuId, MenuAuthTypeCode menuAuthTypeCode) {
        Optional<Menu> menu = this.findMenuById(menuId);
        return menu
                .map(value -> appendMenuAuth(groupMemberId, value, menuAuthTypeCode))
                .orElse(null);
    }

    @Override
    public MenuAuth appendMenuAuth(String groupMemberId, Menu menu, MenuAuthTypeCode menuAuthTypeCode) {
        MenuAuth menuAuth = MenuAuth
                .builder()
                .usedYn(MokaConstants.YES)
                .groupMemberId(groupMemberId)
                .menuId(menu.getMenuId())
                .groupMemberDiv(menuAuthTypeCode.getCode())
                .build();
        Optional<MenuAuth> menuAuthOptional = menuAuthRepository.findGroupMemberDivMenu(groupMemberId, menu.getMenuId(), menuAuthTypeCode.getCode());

        if (menuAuthOptional.isPresent()) {
            menuAuth = menuAuthOptional.get();
            menuAuth.setUsedYn(MokaConstants.YES);
        }
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
    public MenuAuth findMenuAuth(MenuAuth menuAuth) {
        return menuAuthRepository
                .findGroupMemberDivMenu(menuAuth)
                .orElse(null);
    }

    @Override
    public List<MenuAuth> findMenuAuthList(String menuId) {
        return menuAuthRepository.findAllByMenuId(menuId);
    }

}
