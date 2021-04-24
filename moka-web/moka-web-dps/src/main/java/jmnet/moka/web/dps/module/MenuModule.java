package jmnet.moka.web.dps.module;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import jmnet.moka.web.dps.module.menu.Category;
import jmnet.moka.web.dps.module.menu.Menu;
import jmnet.moka.web.dps.module.menu.MenuParser;
import jmnet.moka.web.dps.module.menu.PeriodicMenuLoader;
import jmnet.moka.web.dps.module.menu.SearchParameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class MenuModule implements ModuleInterface {
    private static final  String KEY = "Key";
    private static final String DISPLAY = "Display";
    private static final String URL = "Url";
    private static final String LOGO_IMAGE = "LogoImage";
    private static final String WIDTH = "Width";
    private static final String HEIGHT = "Height";
    private static final String CHILDREN = "Children";
    private static final String CODES = "codes";
    private static final String MENUS = "menus";
    private static final String MEGA_MENU = "megaMenu";
    private static final String GNB_MENU = "gnbMenu";
    private static final String SECTION_MENU = "sectionMenu";
    private static final String SECTION_MENU_SECTION = "section";
    private static final String SECTION_MENU_SUB_MENU = "subMenu";
    private static final String SECTION_MENU_HIGHLIGHT = "highlight";
    private static final String GNB_ROOT_MENU = "NewsGroup";

    @Autowired
    private PeriodicMenuLoader periodicMenuLoader;

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
        return this.periodicMenuLoader.getMenuParser().getRootMenu();
    }

    public Object getMenuByCategory(ApiContext apiContext) throws Exception {
        Map<String, Object> paramMap = apiContext.getCheckedParamMap();
        String categoryKey = (String) paramMap.get(MokaConstants.PARAM_CATEGORY);
        Map<String, Object> returnMap = new HashMap<>();
        Menu menu = findMenu(this.periodicMenuLoader.getMenuParser().getRootMenu(), categoryKey);
        returnMap.put(CODES, getCodes(menu, categoryKey));
        returnMap.put(MENUS, getFullMenu(categoryKey));
        return returnMap;
    }

    public Object getMenuByCodes(ApiContext apiContext) throws Exception {
        Map<String, Object> paramMap = apiContext.getCheckedParamMap();
        String masterCodes = (String)paramMap.get(MokaConstants.CATEGORY_MASTER_CODE_LIST);
        String serviceCodes = (String)paramMap.get(MokaConstants.CATEGORY_SERVICE_CODE_LIST);
        String sourceCodes = (String)paramMap.get(MokaConstants.CATEGORY_SOURCE_CODE_LIST);
        List<Category> categoryList = this.periodicMenuLoader.getMenuParser().getCategoryList(masterCodes,serviceCodes, sourceCodes);
        Map<String, Object> returnMap = new HashMap<>();
        if ( categoryList.size() > 0) {
            Category category = categoryList.get(0);
            Menu menu = findMenu(this.periodicMenuLoader.getMenuParser().getRootMenu(), category.getKey());
            returnMap.put(CODES, getCodes(menu, category));
            returnMap.put(MENUS, getFullMenu(category.getKey()));
            return returnMap;
        }
        return returnMap;
    }

    public SearchParameter getSearchParmeterByCategory(String categoryKey) throws Exception {
        Menu foundMenu = findMenuByCategory(this.periodicMenuLoader.getMenuParser().getRootMenu(), categoryKey);
        return foundMenu != null ? foundMenu.getSearchParameter() : null;
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
            if (menu.isTopMenu()) {
                resultList.add(convert(menu));
            }
        }
        return resultList;
    }

    private Object getSectionMenu(String categoryKey) {
        Menu foundMenu = findMenuByCategory(this.periodicMenuLoader.getMenuParser().getRootMenu(), categoryKey);
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
            if (menu.isTopMenu()) {
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
        Menu rootMenu = this.periodicMenuLoader.getMenuParser().getRootMenu();
        Menu foundMenu = findMenu(rootMenu, key);
        if (foundMenu == null) {
            return;
        }
        if (foundMenu.isDummy()) { // dummy 일경우
            for (Menu menu : this.getChildrenMenu(key)) {
                if (menu.isMegaMenu()) {
                    Map<String, Object> map = convert(menu);
                    List<Map<String, Object>> subMenu = new ArrayList<>();
                    for (Menu childMenu : menu.getChildren()) {
                        if (childMenu.isMegaMenu()) {
                            subMenu.add(convert(childMenu));
                        }
                    }
                    map.put(CHILDREN, subMenu);
                    resultList.add(map);
                }
            }
        } else { // dummy가 아닐 경우
            if (foundMenu.isMegaMenu()) {
                Map<String, Object> map = convert(foundMenu);
                List<Map<String, Object>> subMenu = new ArrayList<>();
                for (Menu childMenu : foundMenu.getChildren()) {
                    if (childMenu.isMegaMenu()) {
                        subMenu.add(convert(childMenu));
                    }
                }
                map.put(CHILDREN, subMenu);
                resultList.add(map);
            }
        }
    }

    private Map<String, Object> convert(Menu menu) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put(KEY, menu.getKey());
        map.put(DISPLAY, menu.getDisplay());
        map.put(URL, menu.getUrl());
        map.put(LOGO_IMAGE, menu.getLogoImage());
        map.put(WIDTH, menu.getWidth());
        map.put(HEIGHT, menu.getHeight());
        return map;
    }

    public List<Menu> getChildrenMenu(String parentKey) {
        Menu rootMenu = this.periodicMenuLoader.getMenuParser().getRootMenu();
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
        // child menu를 조사한다.
        for (Menu menu : parentMenu.getChildren()) {
            if (menu
                    .getKey()
                    .equalsIgnoreCase(key)) {
                return menu;
            }
        }
        // 각 child의 child menu를 조사한다.
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
        // child menu를 조사한다.
        for (Menu menu : parentMenu.getChildren()) {
            if (menu.getKey().equalsIgnoreCase(categoryKey)) {
                return menu;
            }
            // subCategory와 key일치할 경우도 조사
            if ( menu.matchedSubCategory(categoryKey)) {
                return menu;
            }
        }
        // child menu의 child를 조사한다.
        for (Menu menu : parentMenu.getChildren()) {
            foundMenu = findMenuByCategory(menu, categoryKey);
            if (foundMenu != null) {
                break;
            }
        }
        return foundMenu;
    }

    public Object getCodes(Menu menu, String categoryKey)
            throws Exception {
        Map<String,String> result = new HashMap<>();
        Category category = this.periodicMenuLoader.getMenuParser().getCategory(categoryKey);
        return getCodes(menu, category);
    }

    public Object getCodes(Menu menu, Category category)
            throws Exception {
        Map<String,Object> result = new LinkedHashMap<>();
        if ( category != null) {
            result.put(MokaConstants.PARAM_CATEGORY, category.getKey());
            result.put(MokaConstants.CATEGORY_MASTER_CODE_LIST, String.join(",", category.getMasterCodeList()));
            result.put(MokaConstants.CATEGORY_SERVICE_CODE_LIST, String.join(",", category.getServiceCodeList()));
            result.put(MokaConstants.CATEGORY_SOURCE_CODE_LIST, String.join(",", category.getSourceCodeList()));
            result.put(MokaConstants.CATEGORY_EXCEPT_SOURCE_CODE_LIST, String.join(",", category.getExceptSourceCodeList()));
            result.put(MokaConstants.CATEGORY_TERM, category.getTerm());
            result.put(MokaConstants.CATEGORY_TERM, category.getStartDate());
            result.put(MokaConstants.CATEGORY_SUB_CATEGORY_ENTRY, category.getSubCategoryEntry());
        } else {
            result.put(MokaConstants.PARAM_CATEGORY, "");
            result.put(MokaConstants.CATEGORY_MASTER_CODE_LIST, "");
            result.put(MokaConstants.CATEGORY_SERVICE_CODE_LIST, "");
            result.put(MokaConstants.CATEGORY_SOURCE_CODE_LIST, "");
            result.put(MokaConstants.CATEGORY_EXCEPT_SOURCE_CODE_LIST, "");
            result.put(MokaConstants.CATEGORY_TERM, "");
            result.put(MokaConstants.CATEGORY_START_DATE, "");
            result.put(MokaConstants.CATEGORY_SUB_CATEGORY_ENTRY, "");
        }
        if ( menu != null) {
            result.put(MokaConstants.CATEGORY_FILTER_ONLY_JOONGANG, menu.isFilterOnlyJoongang());
            result.put(MokaConstants.CATEGORY_FILTER_DATE, menu.isFilterDate());
            result.put(MokaConstants.CATEGORY_SEARCH_PARAMETER, menu.getSearchParameter());
        }
        return result;
    }
}
