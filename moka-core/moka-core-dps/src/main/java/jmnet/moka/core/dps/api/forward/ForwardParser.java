package jmnet.moka.core.dps.api.forward;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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

public class ForwardParser {
    public static final Logger logger = LoggerFactory.getLogger(ForwardParser.class);
	private static final String EL_FORWARD_CONFIG = "forwardConfig";
	private static final String EL_FORWARD = "forward";
	private static final String EL_DESCRIPTION = "description";
	private static final String EL_API = "api";
    private static final String EL_CHILDREN = "./*";
	private static final String EL_PARAMETER = "parameter";
    public static final String ATTR_PATH = "path";
    public static final String ATTR_ID = "id";
    public static final String ATTR_TO = "to";
    private static DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
    public static final List<String> EMPTY_TOKEN_LIST = new ArrayList<>(0);
    private static XPathFactory xPathFactory = XPathFactory.newInstance();
    private Resource resource;
    private XPath xpath;
    private Document document;

    public ForwardParser(Resource resource)
            throws ParserConfigurationException, IOException {
        this.resource = resource;
        this.xpath = xPathFactory.newXPath();
        parseDocument();
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

    public List<Forward> getForwardList() throws XPathExpressionException {
    	Node forwardConfigNode = getNode(this.document, EL_FORWARD_CONFIG);
    	NodeList forwardNodes = getNodeList(forwardConfigNode, "./"+EL_FORWARD);
        List<Forward> forwardList = new ArrayList<Forward>(64);
    	for (  int i=0; i < forwardNodes.getLength(); i++) {
    		Forward forward = getForward(forwardNodes.item(i));
            forwardList.add(forward);
    	}
    	return forwardList;
    }
    
    private Forward getForward(Node node) throws XPathExpressionException {
    	Element forwardEl = (Element)node;
    	String path = forwardEl.getAttribute(ATTR_PATH);
    	Node descriptionNode = getNode(forwardEl, "./"+EL_DESCRIPTION);
    	String description = descriptionNode.getTextContent();
        Element apiEl = (Element)getNode(forwardEl, "./"+EL_API);
        String apiPath = apiEl.getAttribute(ATTR_PATH);
        String apiId = apiEl.getAttribute(ATTR_ID);
        Forward forward = new Forward(path, description, apiPath, apiId);
        Node parameterNode = getNode(forwardEl, "./"+EL_PARAMETER);
        NodeList parameterChildList = getNodeList(parameterNode, EL_CHILDREN);
        for (  int i = 0; i < parameterChildList.getLength(); i++) {
            Element childEl = (Element) parameterChildList.item(i);
            String name = childEl.getNodeName();
            String to = childEl.getAttribute(ATTR_TO);
            forward.addParamer(name, to);
        }
    	return forward;
    }

}
