package jmnet.moka.web.wms.mvc.menu;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.mvc.group.entity.GroupInfo;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.group.service.GroupService;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class MenuTest {

    @Autowired
    private MenuService menuService;

    @Autowired
    private GroupService groupService;

    private static final String ROOT_MENU_ID = "00000000";

    @Test
    public void insertMenuTest() {
        /**
         * 대메뉴
         */
        Menu menu = Menu
                .builder()
                .menuId("04000000")
                .menuNm("test2")
                .menuDisplayNm("test")
                .menuOrder(3)
                .depth(1)
                .parentMenuId(ROOT_MENU_ID)
                .usedYn(MokaConstants.YES)
                .build();
        Menu systemMenu = menuService.insertMenu(menu);

        /**
         * 중메뉴
         */
        menu = Menu
                .builder()
                .menuId("02001000")
                .menuNm("PAGE")
                .menuDisplayNm("페이지 관리")
                .menuOrder(1)
                .menuUrl("/page")
                .depth(2)
                .parentMenuId(systemMenu.getMenuId())
                .usedYn(MokaConstants.YES)
                .build();

        //Menu domainMenu = menuService.insertMenu(menu);
    }

    @Test
    public void insertGroupMenuAuthTest() {
        List<GroupInfo> groups = groupService.findAllGroup();
        List<Menu> menus = menuService.findAllMenu();

        menus.forEach(menu -> {
            groups.forEach(group -> {
                MenuAuth menuAuth = MenuAuth
                        .builder()
                        .groupMemberDiv(MenuAuthTypeCode.GROUP.getCode())
                        .menuId(menu.getMenuId())
                        .groupMemberId(group.getGroupCd())
                        .usedYn(MokaConstants.YES)
                        .build();

                menuService.insertMenuAuth(menuAuth);
            });
        });

    }

    @Test
    public void insertMemberMenuAuthTest() {
        List<Menu> menus = menuService.findAllMenu();
        List<GroupMember> groupMembers = groupService.findAllGroupMember("999");
        menus.forEach(menu -> {
            groupMembers.forEach(gm -> {
                MenuAuth menuAuth = MenuAuth
                        .builder()
                        .groupMemberDiv(MenuAuthTypeCode.MEMBER.getCode())
                        .menuId(menu.getMenuId())
                        .groupMemberId(gm.getMemberId())
                        .usedYn(MokaConstants.YES)
                        .build();
                menuService.insertMenuAuth(menuAuth);
            });
        });


    }

    @Test
    public void updateMenuTest() {
        Optional<Menu> menuOptional = menuService.findMenuById("03000000");
        menuOptional.ifPresent(menu -> {
            menu.setMenuDisplayNm("테스트");
            menuService.updateMenu(menu);
        });


    }

    @Test
    @Rollback(false)
    public void deleteMenuTest() {
        menuService.deleteMenuById("03000000");
    }

}
