package jmnet.moka.core.dps.api.menu.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import jmnet.moka.common.ApiResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * <pre>
 *
 * Project : moka-web-bbs
 * Package : jmnet.moka.web.dps.mvc.menu.model
 * ClassName : MenuParser
 * Created : 2020-11-03 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-03 오후 4:11
 */
public class MenuParser {
    public static final Logger logger = LoggerFactory.getLogger(MenuParser.class);
    private static List<Menu> EMPTY_CHILDREN = new ArrayList<>(0);
    private static DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
    private static XPathFactory xPathFactory = XPathFactory.newInstance();
    private XPath xpath;
    private Document document;
    private Resource resource;
    private Menu menu;

    public MenuParser(Resource resource)
            throws IOException, ParserConfigurationException, XPathExpressionException {
        this.resource = resource;
        this.xpath = xPathFactory.newXPath();
        this.parseDocument();
        loadMenuTree();
    }

    public Menu getAllMenu() {
        return this.menu;
    }

//    @RequestMapping(method = RequestMethod.GET, path = "/menu.mega", produces = "application/json")
    public List<Map<String,Object>> menuMega(HttpServletRequest request, HttpServletResponse response){
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
        for ( Menu menu:this.getChildrenMenu(key)) {
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

    public List<Menu> getChildrenMenu(String parentKey) {
        if ( this.menu.getKey().equalsIgnoreCase(parentKey)) {
            return this.menu.getChildren();
        } else {
            Menu foundMenu =  findMenu(this.menu, parentKey);
            if (foundMenu != null) {
                return foundMenu.getChildren();
            }
        }
        return EMPTY_CHILDREN;
    }

    public Menu findMenu(Menu parentMenu, String key) {
        if ( parentMenu.getChildren().size() == 0 ) return null;
        Menu foundMenu = null;
        for ( Menu menu : parentMenu.getChildren()) {
            if ( menu.getKey().equalsIgnoreCase(key)) {
                return menu;
            } else {
                foundMenu = findMenu(menu, key);
            }
            if ( foundMenu != null) break;
        }
        return foundMenu;
    }

    private void loadMenuTree()
            throws XPathExpressionException {
        Node rootNode = this.getNode(document.getDocumentElement(),"Menu");
        Menu rootMenu = new Menu(rootNode, this);
        this.setChildrenMenu(rootNode, rootMenu);
        this.menu = rootMenu;
    }

    private void setChildrenMenu(Node parentNode, Menu parentMenu)
            throws XPathExpressionException {
        NodeList childrenElList = this.getNodeList(parentNode,"Children/Menu");
        if ( childrenElList.getLength() == 0) {
            parentMenu.setChildren(EMPTY_CHILDREN);
            return ;
        }
        for (int i=0; i<childrenElList.getLength(); i++) {
            Node childNode = childrenElList.item(i);
            Menu childMenu = new Menu(childNode, this);
            parentMenu.addChildMenu(childMenu);
            setChildrenMenu(childNode,childMenu);
        }
    }

    private void parseDocument() throws ParserConfigurationException, IOException {
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        try {
            this.document = documentBuilder.parse(resource.getInputStream());
        } catch (Exception e) {
            logger.error("Api parsing error: {} {}", resource.getFile().getAbsolutePath(),
                    e.getMessage());
        }
    }

    public NodeList getNodeList(Node node, String xpathStr) throws XPathExpressionException {
        XPathExpression exp = this.xpath.compile(xpathStr);
        Object result = exp.evaluate(node, XPathConstants.NODESET);
        return (NodeList)result;
    }

    public Node getNode(Node node, String xpathStr) throws XPathExpressionException {
        XPathExpression exp = this.xpath.compile(xpathStr);
        Object result = exp.evaluate(node, XPathConstants.NODE);
        return (Node)result;
    }

    public String getKeyFromParameter(Node node) throws XPathExpressionException {
        NodeList nodeList = getNodeList(node,"Parameters/Parameter");
        if ( nodeList.getLength() == 0) return null;
        for ( int i=0; i < nodeList.getLength(); i++) {
            Element parameterEl = (Element)nodeList.item(i);
            String name = parameterEl.getAttribute("Name");
            if ( name != null && name.equalsIgnoreCase("Key")) {
                return parameterEl.getAttribute("Value");
            }
        }
        return null;
    }
}
