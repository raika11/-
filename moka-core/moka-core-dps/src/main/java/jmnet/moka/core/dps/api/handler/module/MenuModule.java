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
        String key = (String)parameterMap.get("key");
        if ( type.equals("main")) {
            return getMainSection();
        } else if ( type.equals("mega")) {
            return this.menuMega();
        } else if ( type.equals("svc")) {
            return this.getServiceMain(key);
        }  else if ( type.equals("all")) {
            return this.menuParser.getRootMenu();
        }
        return null;
    }

    private Object getMainSection() {
        List<Map<String,Object>> resultList = new ArrayList<>();
        for ( Menu menu:this.getChildrenMenu("NewsGroup")) {
            if ( menu.isIsShowTopMenu()) {
                resultList.add(convert(menu));
            }
        }
        return resultList;
    }

    private Object getServiceMain(String key) {
        Menu foundMenu = findMenu(this.menuParser.getRootMenu(),key);
        if ( foundMenu == null ) return MenuParser.EMPTY_CHILDREN;
        Menu parentMenu = null;
        Menu highlightMenu = null;
        List<Menu> childrenMenu;
        if ( foundMenu.hasChildren()) { // 상위 메뉴인 경우
            parentMenu = foundMenu;
            childrenMenu = foundMenu.getChildren();
        } else { // 하위 메뉴 인경우
            parentMenu = foundMenu.getParentMenu();
            childrenMenu = parentMenu.getChildren();
            highlightMenu = foundMenu;
        }
        Map<String,Object> resultMap = new HashMap<String,Object>();
        resultMap.put("parent",convert(parentMenu));
        resultMap.put("highlight",highlightMenu == null?"":highlightMenu.getKey());
        List<Map<String,Object>> resultList = new ArrayList<>();
        for ( Menu menu : parentMenu.getChildren()) {
            if ( menu.isIsShowTopMenu()) {
                resultList.add(convert(menu));
            }
        }
        resultMap.put("children",resultList);
        return resultMap;
    }

    public Object menuMega(){
        List<List<Map<String,Object>>> list = new ArrayList<>();
        for ( String[] group : megaMenuKeys ) {
            List<Map<String,Object>> goupList = new ArrayList<>();
            for ( String menuKey : group) {
                collectMegaMap(goupList,menuKey);
            }
            list.add(goupList);
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
            if (foundMenu != null) {
                break;
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
}
