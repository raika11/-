package jmnet.moka.core.dps.api.category;

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
import jmnet.moka.core.dps.api.menu.Menu;
import jmnet.moka.core.dps.api.menu.MenuParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * <pre>
 *
 * Project : moka-web-bbs
 * Package : jmnet.moka.core.dps.api.category
 * ClassName : CategoryParser
 * Created : 2020-11-13 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-13 오전 8:35
 */
public class CategoryParser {
    public static final Logger logger = LoggerFactory.getLogger(CategoryParser.class);
    private static DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
    private static XPathFactory xPathFactory = XPathFactory.newInstance();
    private XPath xpath;
    private Document document;
    private Resource resource;
    private List<Category> categoryList;
    private Map<String, Category> categoryMap;

    private static final String DEFAULT_CATEGORY = "Society";
    private static final String USAGE_TYPE_RETIREMENT="Retirement";
    private static final String USAGE_TYPE_USAJOONGANG="UsaJoongang";
    private static final String USAGE_TYPE_ONLYJOONGANG="OnlyJoongang";
    private static final String USAGE_TYPE_JOONGANG="Joongang";
    private static final String USAGE_TYPE_ONLYSUNDAY="OnlySunday";

    public CategoryParser(Resource resource)
            throws IOException, ParserConfigurationException, XPathExpressionException {
        this.resource = resource;
        this.xpath = xPathFactory.newXPath();
        this.parseDocument();
        this.loadCategory();
    }

    private void loadCategory()
            throws XPathExpressionException {
        NodeList categoryNodeList = this.getNodeList(document.getDocumentElement(),"//CategoryCondition");
        if ( categoryNodeList.getLength()>0) {
            this.categoryList = new ArrayList<>(64);
            this.categoryMap = new HashMap<>(64);
            for ( int i=0; i < categoryNodeList.getLength(); i++) {
                Category category = new Category(categoryNodeList.item(i), this);
                this.categoryList.add(category);
                this.categoryMap.put(category.getKey(), category);
            }
        } else {
            this.categoryList = new ArrayList<>(0);
            this.categoryMap = new HashMap<>(0);
        }
    }

    public List<Category> getCategoryKeyList(String masterCode, String serviceCode, String sourceCode) {
        String[] masterCodes = (masterCode == null)?null:masterCode.split(",");
        String[] serviceCodes = (masterCode == null)?null:serviceCode.split(",");
        List<Category> categoryList = new ArrayList<>();
        for ( Category category : this.categoryList) {
            if ( category.isMatch(masterCodes,serviceCodes,sourceCode)) {
                categoryList.add(category);
            }
        }
        Collections.reverse(categoryList); // 하위 섹션을 선택하도록 역순으로 보낸다.
        if ( categoryList.size() == 0) {
            categoryList.add(getCategory(DEFAULT_CATEGORY));
        }
        return categoryList;
    }

    public Category getCategory(String key) {
        return this.categoryMap.get(key);
    }

    private void parseDocument() throws ParserConfigurationException, IOException {
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        try {
            this.document = documentBuilder.parse(resource.getInputStream());
        } catch (Exception e) {
            logger.error("Category parsing error: {} {}", resource.getFile().getAbsolutePath(),
                    e.getMessage());
        }
    }

    public NodeList getNodeList(Node node, String xpathStr) throws XPathExpressionException {
        XPathExpression exp = this.xpath.compile(xpathStr);
        Object result = exp.evaluate(node, XPathConstants.NODESET);
        return (NodeList)result;
    }
}
