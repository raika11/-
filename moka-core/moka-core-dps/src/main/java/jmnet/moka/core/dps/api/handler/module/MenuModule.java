package jmnet.moka.core.dps.api.handler.module;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;
import jmnet.moka.core.dps.api.menu.Menu;
import jmnet.moka.core.dps.api.menu.MenuParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class MenuModule implements ModuleInterface {
    @Autowired
    @Qualifier("pcMenuParser")
    private MenuParser menuParser;
    private String[][] megaMenuKeys = {{"NewsGroup"},{"SectionGroup"},{"NewsLetter","NewsDigest","Issue",
                                     "Trend","Reporter"},{"User"}};
    @Override
    public Object invoke(ApiContext apiContext, ApiRequestHandler apiRequestHandler,
            ApiRequestHelper apiRequestHelper)
            throws Exception {
        Map<String,Object> parameterMap = apiContext.getCheckedParamMap();
        String type = (String)parameterMap.get("type");
        String categoryKey = (String)parameterMap.get("category");
        if ( type.equals("top")) {
            return getTop();
        } else if ( type.equals("mega")) {
            return getMega();
        } else if ( type.equals("header")) {
            return this.getHeader(categoryKey);
        }  else if ( type.equals("all")) {
            return this.menuParser.getRootMenu();
        }
        return null;
    }

    private Object getTop() {
        List<Map<String,Object>> resultList = new ArrayList<>();
        for ( Menu menu:this.getChildrenMenu("NewsGroup")) {
            if ( menu.isIsShowTopMenu()) {
                resultList.add(convert(menu));
            }
        }
        return resultList;
    }

    private Object getHeader(String categoryKey) {
        Menu foundMenu = findMenuByCategory(this.menuParser.getRootMenu(),categoryKey);
        if ( foundMenu == null ) return MenuParser.EMPTY_CHILDREN;
        Menu sectionMenu = null;
        Menu highlightMenu = null;
        List<Menu> childrenMenu;
        if ( foundMenu.hasChildren()) { // 상위 메뉴인 경우
            sectionMenu = foundMenu;
            childrenMenu = foundMenu.getChildren();
        } else { // 하위 메뉴 인경우
            sectionMenu = foundMenu.getParentMenu();
            childrenMenu = sectionMenu.getChildren();
            highlightMenu = foundMenu;
        }
        Map<String,Object> resultMap = new HashMap<String,Object>();
        resultMap.put("section",convert(sectionMenu));
        resultMap.put("highlight",highlightMenu == null?"":highlightMenu.getKey());
        List<Map<String,Object>> resultList = new ArrayList<>();
        for ( Menu menu : sectionMenu.getChildren()) {
            if ( menu.isIsShowTopMenu()) {
                resultList.add(convert(menu));
            }
        }
        resultMap.put("children",resultList);
        return resultMap;
    }

    public Object getMega(){
        List<Object> list = new ArrayList<>();
        for ( String[] group : megaMenuKeys ) {
            List<Map<String,Object>> groupList = new ArrayList<>();
            for ( String menuKey : group) {
                collectMegaMap(groupList,menuKey);
            }
            list.add(groupList);
        }
        return list;
    }

    private void collectMegaMap(List<Map<String,Object>> resultList, String key) {
        Menu rootMenu = this.menuParser.getRootMenu();
        Menu foundMenu = findMenu(rootMenu, key);
        if ( foundMenu == null ) return ;
        if ( foundMenu.isDummy() ) { // dummy 일경우
            for (Menu menu : this.getChildrenMenu(key)) {
                if (menu.isIsShowMegaMenu()) {
                    Map<String, Object> map = convert(menu);
                    List<Map<String, Object>> subMenu = new ArrayList<>();
                    for (Menu childMenu : menu.getChildren()) {
                        if (childMenu.isIsShowMegaMenu()) {
                            subMenu.add(convert(childMenu));
                        }
                    }
                    map.put("Children", subMenu);
                    resultList.add(map);
                }
            }
        } else { // dummy가 아닐 경우
            if (foundMenu.isIsShowMegaMenu()) {
                Map<String, Object> map = convert(foundMenu);
                List<Map<String, Object>> subMenu = new ArrayList<>();
                for (Menu childMenu : foundMenu.getChildren()) {
                    if (childMenu.isIsShowMegaMenu()) {
                        subMenu.add(convert(childMenu));
                    }
                }
                map.put("Children", subMenu);
                resultList.add(map);
            }
        }
    }

    private Map<String,Object> convert(Menu menu) {
        Map<String,Object> map = new HashMap<>();
        map.put("Key",menu.getKey());
        map.put("Display",menu.getDisplay());
        map.put("Url", menu.getUrl().getPath());
        return map;
    }

    public List<Menu> getChildrenMenu(String parentKey) {
        Menu rootMenu = this.menuParser.getRootMenu();
        Menu foundMenu = findMenu(rootMenu, parentKey);
        if (foundMenu != null) {
            return foundMenu.getChildren();
        }
        return MenuParser.EMPTY_CHILDREN;
    }

    public Menu findMenu(Menu parentMenu, String key) {
          if (!parentMenu
                .hasChildren()) {
            return null;
        }
        Menu foundMenu = null;
          // 상위레벨부터 조회하도록 루프를 두번 수행한다.
        for (Menu menu : parentMenu.getChildren()) {
            if (menu.getKey().equalsIgnoreCase(key)) {
                return menu;
            }
        }
        for (Menu menu : parentMenu.getChildren()) {
            foundMenu = findMenu(menu, key);
            if (foundMenu != null) {
                break;
            }
        }
        return foundMenu;
    }

    public Menu findMenuByCategory(Menu parentMenu, String categoryKey) {
        if (!parentMenu
                .hasChildren()) {
            return null;
        }
        Menu foundMenu = null;
        // 상위레벨부터 조회하도록 루프를 두번 수행한다.
        for (Menu menu : parentMenu.getChildren()) {
            if ( menu.getCategoryKey() != null) {
                if (menu
                        .getCategoryKey()
                        .equalsIgnoreCase(categoryKey)) {
                    return menu;
                }
            }
        }
        for (Menu menu : parentMenu.getChildren()) {
            foundMenu = findMenuByCategory(menu, categoryKey);
            if (foundMenu != null) {
                break;
            }
        }
        return foundMenu;
    }
}
