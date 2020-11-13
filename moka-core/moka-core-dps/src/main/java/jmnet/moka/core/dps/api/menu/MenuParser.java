package jmnet.moka.core.dps.api.menu;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
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
    private XPath xpath;
    private Document document;
    private Resource resource;
    private Menu rootMenu;

    public MenuParser(Resource resource)
            throws IOException, ParserConfigurationException, XPathExpressionException {
        this.resource = resource;
        this.xpath = xPathFactory.newXPath();
        this.parseDocument();
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

    private void parseDocument()
            throws ParserConfigurationException, IOException {
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        try {
            this.document = documentBuilder.parse(resource.getInputStream());
        } catch (Exception e) {
            logger.error("Menu parsing error: {} {}", resource
                    .getFile()
                    .getAbsolutePath(), e.getMessage());
        }
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

    public String getKeyFromParameter(Node node)
            throws XPathExpressionException {
        NodeList nodeList = getNodeList(node, "Parameters/Parameter");
        if (nodeList.getLength() == 0) {
            return null;
        }
        for (int i = 0; i < nodeList.getLength(); i++) {
            Element parameterEl = (Element) nodeList.item(i);
            String name = parameterEl.getAttribute("Name");
            if (name != null && name.equalsIgnoreCase("Key")) {
                return parameterEl.getAttribute("Value");
            }
        }
        return null;
    }
}
