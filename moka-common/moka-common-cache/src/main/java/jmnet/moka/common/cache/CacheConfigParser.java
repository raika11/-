package jmnet.moka.common.cache;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import jmnet.moka.common.cache.model.Cache;
import jmnet.moka.common.cache.model.CacheGroup;

public class CacheConfigParser {
	
	private static final String EL_CACHE_CONFIG = "cacheConfig";
	private static final String EL_CACHE_GROUP = "cacheGroup";
	private static final String EL_CACHE = "cache";
	private static final String EL_INSTANCE = "instance";
	private static final String EL_PROPERTY = "property";
	private static final String EL_TYPE = "type";
	private static final String ATTR_EXPIRE = "expire";
	private static final String ATTR_ENABLE = "enable";
	private static final String ATTR_CLASS = "class";
	private static final String ATTR_NAME = "name";
	private static final String ATTR_GC_INTERVAL = "gcInterval";
	private static final String ATTR_VALUE = "value";
	private static final int EXPIRE_DEFAULT = 60*1000; //기본 1분
	private static final int GC_INTERVAL_DEFAULT = 5*60*1000; //기본 5분
	
    private static DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
    private static XPathFactory xPathFactory = XPathFactory.newInstance();
    private XPath xpath;
    private Document document;
    
    public CacheConfigParser(InputStream configXmlStream)
            throws ParserConfigurationException, SAXException, IOException {
        InputSource is = new InputSource(configXmlStream);
        this.xpath = xPathFactory.newXPath();
        parseDocument(is);
    }
    
    private void parseDocument(InputSource is)
            throws ParserConfigurationException, SAXException, IOException {
    	DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        this.document = documentBuilder.parse(is);
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
    
    public Map<String,CacheGroup> getCacheConfig() throws XPathExpressionException {
    	Node cacheConfigNode = getNode(this.document, EL_CACHE_CONFIG);
    	NodeList cacheGroupNodes = getNodeList(cacheConfigNode, "./"+EL_CACHE_GROUP);
    	Map<String, CacheGroup> cacheGroupMap = new HashMap<String, CacheGroup>();
    	for (int i=0; i<cacheGroupNodes.getLength(); i++) {
    		Node cacheGroupNode =  cacheGroupNodes.item(i);
    		CacheGroup cacheGroup = getCacheGroup((Element)cacheGroupNode);
    		cacheGroupMap.put(cacheGroup.getName(), cacheGroup);
    	}
    	return cacheGroupMap;
    }
    
    private CacheGroup getCacheGroup(Element cacheGroupEl) throws XPathExpressionException {
    	CacheGroup cacheGroup = new CacheGroup();
    	String name= cacheGroupEl.getAttribute(ATTR_NAME);
    	String gcInterval= cacheGroupEl.getAttribute(ATTR_GC_INTERVAL);
    	cacheGroup.setName(name);
    	cacheGroup.setGcInterval(parseHumanInterval(gcInterval, GC_INTERVAL_DEFAULT));
    	NodeList cacheNodes = getNodeList(cacheGroupEl, "./"+EL_CACHE);
    	for (int i=0; i<cacheNodes.getLength(); i++) {
    		Node cacheNode =  cacheNodes.item(i);
    		cacheGroup.addCache(getCache((Element)cacheNode));
    	}
    	return cacheGroup;
    }
    
    private Cache getCache(Element cacheEl) throws XPathExpressionException {
    	Cache cache = new Cache();
		String expire = cacheEl.getAttribute(ATTR_EXPIRE);
		String enable = cacheEl.getAttribute(ATTR_ENABLE);
		Element instanceEl = (Element)getNode(cacheEl, "./"+EL_INSTANCE);
		String claz = instanceEl.getAttribute(ATTR_CLASS);
		String name = instanceEl.getAttribute(ATTR_NAME);
		cache.setExpire(parseHumanInterval(expire, EXPIRE_DEFAULT));
		cache.setEnable(enable != null && enable.equalsIgnoreCase("true")?true:false);
		cache.setInstanceClass(claz);
		cache.setInstanceName(name);
		cache.setExpireMap(getType(cacheEl));
		cache.setPropertyMap(getProperty(cacheEl));
		return cache;
    }
    
    private Map<String,String> getProperty(Element cacheEl) throws XPathExpressionException {
    	Map<String, String> propertyMap = new HashMap<String,String>();
    	NodeList propertyNodes = getNodeList(cacheEl, "./"+EL_PROPERTY);
    	for (int i=0; i<propertyNodes.getLength(); i++) {
    		Element propetyEl = (Element)propertyNodes.item(i);
    		String name = propetyEl.getAttribute(ATTR_NAME);
    		String value = propetyEl.getAttribute(ATTR_VALUE);
    		propertyMap.put(name, value);
    	}
    	return propertyMap;
    }
    
    private Map<String,Long> getType(Element cacheEl) throws XPathExpressionException {
    	Map<String, Long> typeMap = new HashMap<String,Long>(16);
    	NodeList typeNodes = getNodeList(cacheEl, "./"+EL_TYPE);
    	for (int i=0; i<typeNodes.getLength(); i++) {
    		Element typeEl = (Element)typeNodes.item(i);
    		String name = typeEl.getAttribute(ATTR_NAME);
    		String expire = typeEl.getAttribute(ATTR_EXPIRE);
    		typeMap.put(name, parseHumanInterval(expire,EXPIRE_DEFAULT));
    	}
    	return typeMap;
    }
    
	private long parseHumanInterval(String time, int defaultValue) {
		if ( time != null && time.length() >= 2) {
			time = time.trim();
			char timeUnit = time.charAt(time.length()-1);
			int timeValue = Integer.parseInt(time.substring(0,time.length()-1)); 
			switch ( timeUnit) {
			case 's' :
			case 'S' :
                    return (long) (timeValue * 1000);
			case 'm' :
			case 'M' :
                    return (long) (timeValue * 1000 * 60);
			case 'h' :
			case 'H' :
                    return (long) (timeValue * 1000 * 60 * 60);
			case 'd' :
			case 'D' :
                    return (long) (timeValue * 1000L * 60 * 60 * 24);
			}
            return (long) defaultValue;
		} else {
			return Long.parseLong(time);
		}
	}
}
