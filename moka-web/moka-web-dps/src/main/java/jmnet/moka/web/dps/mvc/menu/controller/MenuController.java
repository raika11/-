package jmnet.moka.web.dps.mvc.menu.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.dps.mvc.menu.model.Menu;
import jmnet.moka.web.dps.mvc.menu.model.MenuParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * <pre>
 *
 * Project : moka-web-bbs
 * Package : jmnet.moka.web.dps.mvc
 * ClassName : MenuController
 * Created : 2020-11-03 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-03 오전 9:39
 */
@Controller
public class MenuController {
    public static final Logger logger = LoggerFactory.getLogger(MenuController.class);
    private Resource resource;
    private MenuParser menuParser;

    public MenuController()
            throws IOException, ParserConfigurationException, XPathExpressionException {
        ResourcePatternResolver patternResolver = ResourceMapper.getResouerceResolver();
        this.resource = patternResolver.getResource("classpath:/Menu.xml");
        this.menuParser = new MenuParser(this.resource);

    }

    @RequestMapping(method = RequestMethod.GET, path = "/menu.js", produces = "application/json")
    public ResponseEntity<?> menuAll(HttpServletRequest request, HttpServletResponse response){
        return new ResponseEntity<>(ApiResult.createApiResult(this.menuParser.getAllMenu()), HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/menu.top", produces = "application/json")
    public ResponseEntity<?> menuTop(HttpServletRequest request, HttpServletResponse response){
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
        return new ResponseEntity<>(ApiResult.createApiResult(resultList), HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/menu.sub", produces = "application/json")
    public ResponseEntity<?> menuSub(HttpServletRequest request, HttpServletResponse response, @RequestParam String key){
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
        return new ResponseEntity<>(ApiResult.createApiResult(resultList), HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/menu.mega", produces = "application/json")
    public ResponseEntity<?> menuMega(HttpServletRequest request, HttpServletResponse response){
        List<Map<String,Object>> resultList = new ArrayList<>();
        collectMegaMap(resultList,"NewsGroup");
        collectMegaMap(resultList,"SectionGroup");
        collectMegaMap(resultList,"NewsLetter");
        collectMegaMap(resultList,"NewsDigest");
        collectMegaMap(resultList,"Issue");
        collectMegaMap(resultList,"Trend");
        collectMegaMap(resultList,"Reporter");
        collectMegaMap(resultList,"User");
        return new ResponseEntity<>(ApiResult.createApiResult(resultList), HttpStatus.OK);
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
