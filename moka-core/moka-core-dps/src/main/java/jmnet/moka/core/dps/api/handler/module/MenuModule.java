package jmnet.moka.core.dps.api.handler.module;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.module.category.Category;
import jmnet.moka.core.dps.api.handler.module.category.CategoryParser;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.module.menu.Menu;
import jmnet.moka.core.dps.api.handler.module.menu.MenuParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class MenuModule implements ModuleInterface {
    private final static String KEY = "Key";
    private final static String DISPLAY = "Display";
    private final static String URL = "Url";
    private final static String CHILDREN = "Children";
    private final static String CODES = "codes";
    private final static String MENUS = "menus";
    private final static String MEGA_MENU = "megaMenu";
    private final static String GNB_MENU = "gnbMenu";
    private final static String SECTION_MENU = "sectionMenu";
    private final static String SECTION_MENU_SECTION = "section";
    private final static String SECTION_MENU_SUB_MENU = "subMenu";
    private final static String SECTION_MENU_HIGHLIGHT = "highlight";
    private final static String GNB_ROOT_MENU = "NewsGroup";
    @Autowired
    @Qualifier("pcMenuParser")
    private MenuParser pcMenuParser;

    @Autowired
    @Qualifier("categoryParser")
    private CategoryParser categoryParser;

    private String[][] megaMenuKeys = {{"NewsGroup"}, {"SectionGroup"}, {"NewsLetter", "NewsDigest", "Issue", "Trend", "Reporter"}, {"User"}};

    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;

    public MenuModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {
        return this.pcMenuParser.getRootMenu();
    }

    public Object getMenuByCategory(ApiContext apiContext) throws Exception {
        Map<String, Object> paramMap = apiContext.getCheckedParamMap();
        String categoryKey = (String) paramMap.get(MokaConstants.PARAM_CATEGORY);
        CategoryModule categoryModule = (CategoryModule) moduleRequestHandler.getModule(CategoryModule.class.getName());
        Map<String, Object> returnMap = new HashMap<>();
        returnMap.put(CODES, categoryModule.getCodes(categoryKey));
        returnMap.put(MENUS, getFullMenu(categoryKey));
        return returnMap;
    }

    public Object getMenuByCodes(ApiContext apiContext) throws Exception {
        Map<String, Object> paramMap = apiContext.getCheckedParamMap();
        String masterCodes = (String)paramMap.get(MokaConstants.MASTER_CODE_LIST);
        String serviceCodes = (String)paramMap.get(MokaConstants.SERVICE_CODE_LIST);
        String sourceCodes = (String)paramMap.get(MokaConstants.SOURCE_CODE_LIST);
        CategoryModule categoryModule = (CategoryModule) moduleRequestHandler.getModule(CategoryModule.class.getName());
        List<Category> categoryList = categoryModule.getCategoryList(masterCodes,serviceCodes, sourceCodes);
        Map<String, Object> returnMap = new HashMap<>();
        if ( categoryList.size() > 0) {
            Category category = categoryList.get(0);
            returnMap.put(CODES, categoryModule.getCodes(category));
            returnMap.put(MENUS, getFullMenu(category.getKey()));
            return returnMap;
        }
        return returnMap;
    }

    public  Map<String, Object> getSearchParmeterByCategory(String categoryKey) throws Exception {
        Menu foundMenu = findMenuByCategory(this.pcMenuParser.getRootMenu(), categoryKey);
        return foundMenu != null ? foundMenu.getSearchParamMap() : null;
    }

    private Map<String, Object> getFullMenu(String categoryKey) {
        Map<String, Object> fullMap = new HashMap<>();
        fullMap.put(GNB_MENU, getGnbMenu());
        fullMap.put(MEGA_MENU, getMegaMenu());
        fullMap.put(SECTION_MENU, getSectionMenu(categoryKey));
        return fullMap;
    }

    private Object getGnbMenu() {
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (Menu menu : this.getChildrenMenu(GNB_ROOT_MENU)) {
            if (menu.isIsShowTopMenu()) {
                resultList.add(convert(menu));
            }
        }
        return resultList;
    }

    private Object getSectionMenu(String categoryKey) {
        Menu foundMenu = findMenuByCategory(this.pcMenuParser.getRootMenu(), categoryKey);
        if (foundMenu == null) {
            return MenuParser.EMPTY_CHILDREN;
        }
        Menu sectionMenu = null;
        Menu highlightMenu = null;
        List<Menu> childrenMenu;
        if (foundMenu.hasChildren()) { // 상위 메뉴인 경우
            sectionMenu = foundMenu;
            childrenMenu = foundMenu.getChildren();
        } else { // 하위 메뉴 인경우
            sectionMenu = foundMenu.getParentMenu();
            childrenMenu = sectionMenu.getChildren();
            highlightMenu = foundMenu;
        }
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put(SECTION_MENU_SECTION, convert(sectionMenu));
        resultMap.put(SECTION_MENU_HIGHLIGHT, highlightMenu == null ? "" : highlightMenu.getKey());
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (Menu menu : sectionMenu.getChildren()) {
            if (menu.isIsShowTopMenu()) {
                resultList.add(convert(menu));
            }
        }
        resultMap.put(SECTION_MENU_SUB_MENU, resultList);
        return resultMap;
    }

    private Object getMegaMenu() {
        List<Object> list = new ArrayList<>();
        for (String[] group : megaMenuKeys) {
            List<Map<String, Object>> groupList = new ArrayList<>();
            for (String menuKey : group) {
                collectMegaMap(groupList, menuKey);
            }
            list.add(groupList);
        }
        return list;
    }

    private void collectMegaMap(List<Map<String, Object>> resultList, String key) {
        Menu rootMenu = this.pcMenuParser.getRootMenu();
        Menu foundMenu = findMenu(rootMenu, key);
        if (foundMenu == null) {
            return;
        }
        if (foundMenu.isDummy()) { // dummy 일경우
            for (Menu menu : this.getChildrenMenu(key)) {
                if (menu.isIsShowMegaMenu()) {
                    Map<String, Object> map = convert(menu);
                    List<Map<String, Object>> subMenu = new ArrayList<>();
                    for (Menu childMenu : menu.getChildren()) {
                        if (childMenu.isIsShowMegaMenu()) {
                            subMenu.add(convert(childMenu));
                        }
                    }
                    map.put(CHILDREN, subMenu);
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
                map.put(CHILDREN, subMenu);
                resultList.add(map);
            }
        }
    }

    private Map<String, Object> convert(Menu menu) {
        Map<String, Object> map = new HashMap<>();
        map.put(KEY, menu.getKey());
        map.put(DISPLAY, menu.getDisplay());
        map.put(URL, menu
                .getUrl()
                .getPath());
        return map;
    }

    public List<Menu> getChildrenMenu(String parentKey) {
        Menu rootMenu = this.pcMenuParser.getRootMenu();
        Menu foundMenu = findMenu(rootMenu, parentKey);
        if (foundMenu != null) {
            return foundMenu.getChildren();
        }
        return MenuParser.EMPTY_CHILDREN;
    }

    public Menu findMenu(Menu parentMenu, String key) {
        if (!parentMenu.hasChildren()) {
            return null;
        }
        Menu foundMenu = null;
        // 상위레벨부터 조회하도록 루프를 두번 수행한다.
        for (Menu menu : parentMenu.getChildren()) {
            if (menu
                    .getKey()
                    .equalsIgnoreCase(key)) {
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
        if (!parentMenu.hasChildren()) {
            return null;
        }
        Menu foundMenu = null;
        // 상위레벨부터 조회하도록 루프를 두번 수행한다.
        for (Menu menu : parentMenu.getChildren()) {
            if (menu.getCategoryKey() != null) {
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
