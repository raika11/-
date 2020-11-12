package jmnet.moka.core.dps.api.handler.module;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.api.menu.model.Menu;
import jmnet.moka.core.dps.api.menu.model.MenuParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class MenuModule implements ModuleInterface {
    @Autowired
    @Qualifier("pcMenuParser")
    private MenuParser menuParser;

    @Override
    public Object invoke(ApiContext apiContext, ApiRequestHandler apiRequestHandler,
            ApiRequestHelper apiRequestHelper)
            throws Exception {
        Map<String,Object> parameterMap = apiContext.getCheckedParamMap();
        String division = (String)parameterMap.get("division");
        String key = (String)parameterMap.get("key");
        if ( division.equals("top")) {
            return getTopMenu();
        } else if ( division.equals("all")) {
            return this.menuParser.getAllMenu();
        } else if ( division.equals("mega")) {
            return this.menuMega();
        } else if ( division.equals("sub")) {
            return this.getSubMenu(key);
        }
        return null;
    }

    private Object getTopMenu() {
        List<Map<String,Object>> resultList = new ArrayList<>();
        for ( Menu menu:this.menuParser.getChildrenMenu("NewsGroup")) {
            if ( menu.isIsShowTopMenu()) {
                Map<String,Object> map = new HashMap<>();
                map.put("Key",menu.getKey());
                map.put("Display",menu.getDisplay());
                map.put("Url", menu.getUrl().getPath());
                resultList.add(map);
            }
        }
        return resultList;
    }

    private Object getSubMenu(String key) {
        List<Map<String,Object>> resultList = new ArrayList<>();
        for ( Menu menu:this.menuParser.getChildrenMenu(key)) {
            if ( menu.isIsShowTopMenu()) {
                Map<String,Object> map = new HashMap<>();
                map.put("Key",menu.getKey());
                map.put("Display",menu.getDisplay());
                map.put("Url", menu.getUrl().getPath());
                resultList.add(map);
            }
        }
        return resultList;
    }

    public Object menuMega(){
        List<Map<String,Object>> resultList = new ArrayList<>();
        collectMegaMap(resultList,"NewsGroup");
        collectMegaMap(resultList,"SectionGroup");
        collectMegaMap(resultList,"NewsLetter");
        collectMegaMap(resultList,"NewsDigest");
        collectMegaMap(resultList,"Issue");
        collectMegaMap(resultList,"Trend");
        collectMegaMap(resultList,"Reporter");
        collectMegaMap(resultList,"User");
        return resultList;
    }

    private void collectMegaMap(List<Map<String,Object>> resultList, String key) {
        for ( Menu menu:this.menuParser.getChildrenMenu(key)) {
            if ( menu.isIsShowMegaMenu()) {
                Map<String,Object> map = new HashMap<>();
                map.put("Key",menu.getKey());
                map.put("Display",menu.getDisplay());
                map.put("Url", menu.getUrl().getPath());
                List<Map<String,Object>> subMenu = new ArrayList<>();
                for ( Menu childMenu : menu.getChildren()) {
                    if ( childMenu.isIsShowMegaMenu()) {
                        Map<String,Object> subMap = new HashMap<>();
                        subMap.put("Key",childMenu.getKey());
                        subMap.put("Display",childMenu.getDisplay());
                        subMap.put("Url", childMenu.getUrl().getPath());
                        subMenu.add(subMap);
                    }
                }
                map.put("Children", subMenu);
                resultList.add(map);
            }
        }
    }
}
