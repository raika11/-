package jmnet.moka.core.tps.mvc.menu.service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNodeDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuParentNodeDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import jmnet.moka.core.tps.mvc.menu.mapper.MenuMapper;
import jmnet.moka.core.tps.mvc.menu.repository.MenuAuthRepository;
import jmnet.moka.core.tps.mvc.menu.repository.MenuRepository;
import jmnet.moka.core.tps.mvc.menu.vo.MenuVO;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
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

    private final TpsLogger tpsLogger;



    public MenuServiceImpl(MenuRepository menuRepository, MenuAuthRepository menuAuthRepository, MenuMapper menuMapper, ModelMapper modelMapper,
            TpsLogger tpsLogger) {
        this.menuRepository = menuRepository;
        this.menuAuthRepository = menuAuthRepository;
        this.menuMapper = menuMapper;
        this.modelMapper = modelMapper;
        this.tpsLogger = tpsLogger;
    }

    @Override
    public MenuNodeDTO findServiceMenuTree(MenuSearchDTO searchDTO) {
        List<MenuVO> menuList = menuMapper.findAll(searchDTO);
        return menuList.isEmpty() ? null : makeTree(menuList);
    }

    @Override
    public MenuNodeDTO findMenuTree(MenuSearchDTO searchDTO) {
        List<MenuVO> menuList = menuMapper.findAllMenuAuth(searchDTO);
        return menuList.isEmpty() ? null : makeTree(menuList);
    }

    /**
     * 메뉴 목록을 Tree 자료구조로 생성한다.
     *
     * @param menuList 메뉴 목록
     * @return 메뉴 Tree
     */
    private MenuNodeDTO makeTree(List<MenuVO> menuList) {
        Optional<MenuVO> menuVO = menuList
                .stream()
                .max(Comparator.comparingInt(MenuVO::getDepth));
        int maxDepth = menuVO.isPresent() ? menuVO
                .get()
                .getDepth() : 0;
        MenuNodeDTO rootNode = new MenuNodeDTO();
        rootNode.setSeq((long) 0);
        rootNode.setMenuId(ROOT_MENU_ID);
        rootNode.setMenuNm("ROOT");

        for (MenuVO menu : menuList) {
            if (MenuService.ROOT_MENU_ID.equals(menu.getParentMenuId())) {
                MenuNodeDTO menuNodeDTO = new MenuNodeDTO(menu);
                rootNode.addNode(traceMenuNode(menuNodeDTO, menuList, maxDepth));
            }
        }
        rootNode.sort();
        return rootNode;
    }

    /**
     * 전 메뉴를 순회하며 자신의 하위 메뉴를 찾는다.
     *
     * @param menuNodeDTO 메뉴 노드
     * @param menuList    메뉴 목록
     * @param maxDepth    전체 메뉴의 최대 깊이
     * @return MenuNode
     */
    private MenuNodeDTO traceMenuNode(MenuNodeDTO menuNodeDTO, List<MenuVO> menuList, int maxDepth) {
        if (menuNodeDTO.getDepth() < maxDepth) {
            for (MenuVO menu : menuList) {
                if (menu
                        .getParentMenuId()
                        .equals(menuNodeDTO.getMenuId())) {
                    MenuNodeDTO child = new MenuNodeDTO(menu);
                    if (menuNodeDTO.getParents() != null) {
                        menuNodeDTO
                                .getParents()
                                .forEach(parentNodeDTO -> {
                                    child.addParent(parentNodeDTO);
                                });
                    }


                    child.addParent(new MenuParentNodeDTO(menuNodeDTO));
                    menuNodeDTO.addNode(traceMenuNode(child, menuList, maxDepth));
                }
            }
        }
        return menuNodeDTO;
    }

    @Override
    public Page<Menu> findAllMenu(MenuSearchDTO search) {
        return menuRepository.findAll(search);
    }

    @Override
    public List<Menu> findAllMenuByParentId(String parentMenuId) {
        return menuRepository.findAllByParentMenuIdOrderByMenuOrder(parentMenuId);
    }

    @Override
    public Long countMenuByParentId(String parentMenuId) {
        return menuRepository.countByParentMenuId(parentMenuId);
    }

    @Override
    public List<Menu> findAllMenu() {
        return menuRepository.findAll();
    }

    @Override
    public Optional<Menu> findMenuBySeq(Long menuSeq) {
        return menuRepository.findById(menuSeq);
    }

    @Override
    public Optional<Menu> findMenuById(String menuId) {
        return menuRepository.findByMenuId(menuId);
    }

    @Override
    public Menu insertMenu(Menu menu) {
        // 신규 등록시 메뉴 순서는 형제 매뉴 중 가장 큰 순서 + 1
        menu.setMenuOrder(menuRepository.findMaxOrder(menu.getParentMenuId()) + 1);
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
        return menuAuthRepository.countByMenuIdAndUsedYn(menuId, MokaConstants.YES) > 0;
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
    public Long findMenuAuthSeq(MenuSearchDTO searchDTO) {
        return menuMapper.findMenuAuthSeq(searchDTO);
    }

    @Override
    public List<MenuAuth> findMenuAuthList(String menuId) {
        return menuAuthRepository.findAllByMenuId(menuId);
    }

    @Override
    public List<MenuAuth> findMenuAuthList(String groupMemberId, String groupMemberDiv) {
        return menuAuthRepository.findAllByGroupMemberIdAndGroupMemberDiv(groupMemberId, groupMemberDiv);
    }

    @Override
    public Set<String> findAllMenuUrl() {
        List<Menu> menuList = menuRepository.findByUsedYn(MokaConstants.YES);

        return menuList
                .stream()
                .filter(menu -> McpString.isNotEmpty(menu.getMenuUrl()) && !menu
                        .getMenuUrl()
                        .equals("/"))
                .map(menu -> menu
                        .getMenuUrl()
                        .trim())
                .collect(Collectors.toSet());
    }


    @Override
    public void saveMenuAuth(String menuId, MenuAuthTypeCode menuAuthType, MenuAuth menuAuth) {

        menuAuth.setMenuId(menuId);
        menuAuth.setGroupMemberDiv(menuAuthType != null ? menuAuthType.getCode() : menuAuth.getGroupMemberDiv());
        MenuAuth orgMenu = findMenuAuth(menuAuth);
        if (orgMenu != null) {
            orgMenu.setViewYn(menuAuth.getViewYn());
            orgMenu.setEditYn(menuAuth.getEditYn());
            orgMenu.setUsedYn(menuAuth.getUsedYn());
            updateMenuAuth(orgMenu);
        } else {
            insertMenuAuth(menuAuth);
        }
    }


    @Override
    public void saveMenuAuth(String groupMemberId, MenuAuthTypeCode menuAuthType, List<MenuAuth> menuAuths) {

        findMenuAuthList(groupMemberId, menuAuthType.getCode()).forEach(menuAuth -> {
            menuAuth.setUsedYn(MokaConstants.NO);
            menuAuth.setEditYn(MokaConstants.NO);
            menuAuth.setViewYn(MokaConstants.NO);
            updateMenuAuth(menuAuth);
        });
        menuAuths.forEach(menuAuth -> {
            try {
                // 조회 여부는 useYn이 Y이 이면 자동으로 Y
                menuAuth.setViewYn(McpString.isYes(menuAuth.getUsedYn()) ? MokaConstants.YES : MokaConstants.NO);
                // 편집 여부는 useYn이 N이 이면 자동으로 N
                menuAuth.setEditYn(McpString.isYes(menuAuth.getUsedYn()) ? menuAuth.getEditYn() : MokaConstants.NO);
                menuAuth.setGroupMemberId(groupMemberId);
                saveMenuAuth(menuAuth.getMenuId(), menuAuthType, menuAuth);
            } catch (Exception ex) {
                tpsLogger.skip(ex.toString());
            }
        });
    }

}
