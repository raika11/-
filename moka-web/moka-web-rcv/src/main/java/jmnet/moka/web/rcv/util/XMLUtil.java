package jmnet.moka.web.rcv.util;

import java.io.File;
import java.io.IOException;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.util
 * ClassName : XMLUtil
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 3:01
 */
public class XMLUtil {
    private XPath xpath;
    private DocumentBuilderFactory factory;
    private DocumentBuilder builder;

    public Document getDocument(File file)
            throws ParserConfigurationException, IOException, SAXException {
        if (factory == null) {
            factory = DocumentBuilderFactory.newInstance();
        }
        if (builder == null) {
            builder = factory.newDocumentBuilder();
        }

        return builder.parse(file);
    }

    public XPath getXPath() {
        if (xpath == null) {
            xpath = XPathFactory
                    .newInstance()
                    .newXPath();
        }
        return xpath;
    }

    public NodeList getNodeList(Document doc, String xpath)
            throws XPathExpressionException {
        XPathExpression exp = getXPath().compile(xpath);
        return (NodeList) exp.evaluate(doc, XPathConstants.NODESET);
    }

    public String getString(Node doc, String xpath, String val)
            throws XPathExpressionException {
        if (doc == null) {
            return val;
        }
        XPathExpression exp = getXPath().compile(xpath);
        Object result = exp.evaluate(doc, XPathConstants.STRING);
        return result == null || ((String) result).length() < 1 ? val : (String) result;
    }

    public Node getChildNode(Node node, String childName) {
        NodeList childNodeList = node.getChildNodes();
        for (int i = 0; i < childNodeList.getLength(); i++) {
            if (childNodeList.item(i).getNodeName().equals(childName)) {
                return childNodeList.item(i);
            }
        }
        return null;
    }
}
