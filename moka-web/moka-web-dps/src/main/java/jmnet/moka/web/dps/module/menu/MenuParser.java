package jmnet.moka.web.dps.module.menu;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
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
    public static List<Menu> EMPTY_CHILDREN = new ArrayList<>(0);
    private static DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
    private static XPathFactory xPathFactory = XPathFactory.newInstance();
    private String url;
    private Resource resource;
    private XPath xpath;
    private Document document;
    private Menu rootMenu;
    private Map<String, Category> categoryMap;
    private List<Category> categoryList;
    private static final String DEFAULT_CATEGORY = "Society";
    private static final String ONLY_JOONGANG_SOURCES = "1,3,61";

    public MenuParser(String url)
            throws IOException, ParserConfigurationException, XPathExpressionException {
        this.url = url;
        loadMenu();
    }

    public MenuParser(Resource resource)
            throws IOException, ParserConfigurationException, XPathExpressionException {
        this.resource = resource;
        loadMenu();
    }

    private void loadMenu()
            throws ParserConfigurationException, IOException, XPathExpressionException {
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        this.xpath = xPathFactory.newXPath();
        this.categoryMap = new HashMap<>(128);
        this.categoryList = new ArrayList<>(128);
        if ( this.url != null) {
            try {
                this.document = documentBuilder.parse(url);
            } catch (Exception e) {
                logger.error("Menu parsing error: {} {}", url, e.getMessage());
            }
        } else {
            try {
                this.document = documentBuilder.parse(resource.getInputStream());
            } catch (Exception e) {
                logger.error("Menu parsing error: {} {}", resource
                        .getFile()
                        .getAbsolutePath(), e.getMessage());
            }
        }
        loadMenuTree();
    }

    public Menu getRootMenu() {
        return this.rootMenu;
    }

    private void loadMenuTree()
            throws XPathExpressionException {
        Node rootNode = this.getNode(document.getDocumentElement(), "Menu");
        Menu rootMenu = new Menu(null, rootNode, this);
        this.setChildrenMenu(rootNode, rootMenu);
        this.rootMenu = rootMenu;
    }

    private void setChildrenMenu(Node parentNode, Menu parentMenu)
            throws XPathExpressionException {
        NodeList childrenElList = this.getNodeList(parentNode, "Children/Menu");
        if (childrenElList.getLength() == 0) {
            parentMenu.setChildren(EMPTY_CHILDREN);
            return;
        }
        for (int i = 0; i < childrenElList.getLength(); i++) {
            Node childNode = childrenElList.item(i);
            Menu childMenu = new Menu(parentMenu, childNode, this);
            parentMenu.addChildMenu(childMenu);
            setChildrenMenu(childNode, childMenu);
        }
    }

    public void addCategory(String key, Category category) {
        this.categoryMap.put(key, category);
        this.categoryList.add(category);
    }

    public List<Category> getCategoryList(String masterCode, String serviceCode, String sourceCode) {
        String[] masterCodes = (masterCode == null)?null:masterCode.split(",");
        String[] serviceCodes = (serviceCode == null)?null:serviceCode.split(",");
        List<Category> matchedCategoryList = new ArrayList<>();
        for ( Category category : this.categoryList) {
            if ( category.isMatch(masterCodes,serviceCodes,sourceCode)) {
                matchedCategoryList.add(category);
            }
        }
        Collections.reverse(matchedCategoryList); // 하위 섹션을 선택하도록 역순으로 보낸다.
        if ( matchedCategoryList.size() == 0) {
            matchedCategoryList.add(getCategory(DEFAULT_CATEGORY));
        }
        return matchedCategoryList;
    }

    public Category getCategory(String key) {
        Category matchedCategory = this.categoryMap.get(key);
        // case insensitive 처리를 위해 리스트에서 조회
        if ( matchedCategory == null) {
            for ( Category category :this.categoryList) {
                if ( category.getKey().equalsIgnoreCase(key)) {
                    matchedCategory = category;
                    break;
                }
            }
        }
        return matchedCategory;
    }

    public NodeList getNodeList(Node node, String xpathStr)
            throws XPathExpressionException {
        XPathExpression exp = this.xpath.compile(xpathStr);
        Object result = exp.evaluate(node, XPathConstants.NODESET);
        return (NodeList) result;
    }

    public Node getNode(Node node, String xpathStr)
            throws XPathExpressionException {
        XPathExpression exp = this.xpath.compile(xpathStr);
        Object result = exp.evaluate(node, XPathConstants.NODE);
        return (Node) result;
    }

}
