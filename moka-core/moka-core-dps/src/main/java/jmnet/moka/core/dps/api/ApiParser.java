package jmnet.moka.core.dps.api;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.model.Acl;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.api.model.ApiCallRequest;
import jmnet.moka.core.dps.api.model.ApiConfig;
import jmnet.moka.core.dps.api.model.DbRequest;
import jmnet.moka.core.dps.api.model.DefaultApiConfig;
import jmnet.moka.core.dps.api.model.IpGroup;
import jmnet.moka.core.dps.api.model.ModuleRequest;
import jmnet.moka.core.dps.api.model.Parameter;
import jmnet.moka.core.dps.api.model.PurgeRequest;
import jmnet.moka.core.dps.api.model.Request;
import jmnet.moka.core.dps.api.model.SampleRequest;
import jmnet.moka.core.dps.api.model.ScriptRequest;
import jmnet.moka.core.dps.api.model.UrlRequest;
import jmnet.moka.core.dps.excepton.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpMethod;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class ApiParser {
    public static final Logger logger = LoggerFactory.getLogger(ApiParser.class);
    private static final String EL_API_CONFIG = "apiConfig";
    private static final String EL_API = "api";
    private static final String EL_DESCRIPTION = "description";
    private static final String EL_PARAMETER = "parameter";
    private static final String EL_REF_PARAMETER = "refParameter";
    private static final String EL_PARAMETER_GROUP = "parameterGroup";
    private static final String EL_REQUEST = "request";
    private static final String EL_KEYS = "keys";
    private static final String EL_IP_GROUP = "ipGroup";
    private static final String EL_ACL = "acl";
    private static final String EL_REFERER = "referer";
    private static final String EL_CHILDREN = "./*";
    private static final String ATTR_ID = "id";
    private static final String ATTR_METHOD = "method";
    private static final String ATTR_EXPIRE = "expire";
    private static final String ATTR_RESULTWRAP = "resultWrap";
    private static final String ATTR_NAME = "name";
    private static final String ATTR_PERIOD = "period";
    private static final String ATTR_MEMBERSHIP = "membership";
    private static final String ATTR_TYPE = "type";
    private static final String ATTR_DESCRIPTION = "desc";
    private static final String ATTR_HINTS = "hints";
    private static final String ATTR_REQUIRE = "require";
    private static final String ATTR_RESULTNAME = "resultName";
    private static final String ATTR_SETNAMES = "setNames";
    private static final String ATTR_METHOD_NAME = "methodName";
    private static final String ATTR_SELECTOR = "selector";
    private static final String ATTR_TOTAL = "total";
    private static final String ATTR_DML_TYPE = "dmlType";
    private static final String ATTR_INCLUDE = "include";
    private static final String ATTR_EXCLUDE = "exclude";
    public static final String ATTR_DEFAULT = "default";
    public static final String ATTR_ASYNC = "async";
    public static final String ATTR_EVAL = "eval";
    public static final String ATTR_API_PATH = "apiPath";
    public static final String ATTR_API_ID = "apiId";
    public static final String ATTR_KEYS = "keys";
    public static final String ATTR_IP_GROUP = "ipGroup";
    public static final String ATTR_CONTENT_TYPE = "contentType";
    public static final String ATTR_CORS = "cors";
    public static final String PARAM_TYPE_NUMBER = "number";
    public static final String PARAM_TYPE_STRING = "string";
    public static final String PARAM_TYPE_DATE = "date";
    public static final String PARAM_TYPE_COOKIE = "cookie";
    public static final String PARAM_DEFAULT_DATE_NOW = "now";
    public static final String PARAM_DEFAULT_DATE_TODAY = "today";
    private static DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
    public static final List<String> EMPTY_TOKEN_LIST = new ArrayList<>(0);
    private static XPathFactory xPathFactory = XPathFactory.newInstance();
    private Resource resource;
    private XPath xpath;
    private Document document;
    private DefaultApiConfig defaultApiConfig;

    public ApiParser(Resource resource)
            throws ParserConfigurationException, SAXException, IOException {
        this(resource, null);
    }

    public ApiParser(Resource resource, DefaultApiConfig defaultApiConfig)
            throws ParserConfigurationException, IOException {
        this.resource = resource;
        this.xpath = xPathFactory.newXPath();
        parseDocument();
        this.defaultApiConfig = defaultApiConfig;
    }

    private void parseDocument()
            throws ParserConfigurationException, IOException {
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        try {
            this.document = documentBuilder.parse(resource.getInputStream());
        } catch (Exception e) {
            logger.error("Api parsing error: {} {}", resource
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

    //    private boolean getBool(Element element, String attribute, boolean defaultValue) {
    //    	String value = element.getAttribute(attribute);
    //    	if ( value == null ) return defaultValue;
    //    	if (value.equalsIgnoreCase("true")) return true;
    //    	return false;
    //    }

    public Map<String, Api> getApiMap(ApiConfig apiConfig)
            throws XPathExpressionException, ApiException {
        Node apiConfigNode = getNode(this.document, EL_API_CONFIG);
        NodeList apiNodes = getNodeList(apiConfigNode, "./" + EL_API);
        Map<String, Api> apiMap = new HashMap<String, Api>(64);
        for (int i = 0; i < apiNodes.getLength(); i++) {
            Api api = getApi(apiConfig, apiNodes.item(i));
            apiMap.put(api.getId(), api);
        }
        return apiMap;
    }

    private Api getApi(ApiConfig apiConfig, Node node)
            throws XPathExpressionException, ApiException {
        Element apiEl = (Element) node;
        String id = apiEl.getAttribute(ATTR_ID);
        String methodStr = apiEl.getAttribute(ATTR_METHOD);
        String resultUnwrapStr = apiEl.getAttribute(ATTR_RESULTWRAP);
        HttpMethod method = HttpMethod.GET;
        if (methodStr.equalsIgnoreCase("post")) {
            method = HttpMethod.POST;
        }
        String expireAttr = apiEl.getAttribute(ATTR_EXPIRE);
        long expire = ApiCacheHelper.EXPIRE_UNDEFINED;
        if (McpString.isNotEmpty(expireAttr)) {
            expire = TimeHumanizer.parseLong(expireAttr, ApiCacheHelper.EXPIRE_UNDEFINED);
        }
        String period = apiEl.getAttribute(ATTR_PERIOD);
        Node descriptionNode = getNode(apiEl, "./" + EL_DESCRIPTION);
        String description = descriptionNode.getTextContent();
        String cors = apiEl.getAttribute(ATTR_CORS);
        String contentType = apiEl.getAttribute(ATTR_CONTENT_TYPE);
        boolean resultWrap = true;
        if (McpString.isNotEmpty(resultUnwrapStr) && resultUnwrapStr.equalsIgnoreCase("N")) {
            resultWrap = false;
        }
        String membership = apiEl.getAttribute(ATTR_MEMBERSHIP);
        Api api = new Api(apiConfig, id, method, expire, period, description, contentType, cors, resultWrap, membership);
        setParameter(api, apiEl);
        setRequestList(api, apiEl);
        setKeys(api, apiEl);
        return api;
    }

    private void setParameter(Api api, Element apiEl)
            throws XPathExpressionException {
        List<Parameter> parameterList = getParameterList(apiEl);
        for (Parameter parameter : parameterList) {
            api.addParamer(parameter);
        }
    }


    public List<Parameter> getParameterList(Element parentEl)
            throws XPathExpressionException {
        List<Parameter> parameterList = new ArrayList<Parameter>(8);
        Node parameterNode = getNode(parentEl, EL_PARAMETER);

        if (parameterNode != null) {
            NodeList paremeterNodes = getNodeList(parameterNode, EL_CHILDREN);
            for (int i = 0; i < paremeterNodes.getLength(); i++) {
                Element childEl = (Element) paremeterNodes.item(i);
                String name = childEl.getNodeName();
                String commonAttr = childEl.getAttribute("common");
                if (name.equals(EL_REF_PARAMETER)) {
                    // defaultApiConfig가 있을 경우 refParameter를 처리한다.
                    if (this.defaultApiConfig != null) {
                        List<String> refParamList = getTokenList(childEl);
                        parameterList.addAll(this.defaultApiConfig.getDefaultParameterList(refParamList));
                    }
                } else if (commonAttr.equalsIgnoreCase("Y")) { //common = "Y" 일 경우
                    Parameter parameter = this.defaultApiConfig.getDefaultParameter(name);
                    if (parameter != null) {
                        parameterList.add(parameter);
                    }
                } else { // parameter 요소
                    String filter = childEl.getTextContent();
                    String type = childEl.getAttribute(ATTR_TYPE);
                    String desc = childEl.getAttribute(ATTR_DESCRIPTION);
                    String hints = childEl.getAttribute(ATTR_HINTS);
                    String requireAttr = childEl.getAttribute(ATTR_REQUIRE);
                    String value = childEl.getAttribute(ATTR_DEFAULT);
                    String evalStr = childEl.getAttribute(ATTR_EVAL);
                    if (childEl.hasAttribute(ATTR_DEFAULT) == false || value.equals("null")) {
                        value = null;
                    }
                    if (type == null || type.length() == 0) {
                        type = PARAM_TYPE_STRING;
                    } else if (type.equals(PARAM_TYPE_NUMBER)) {
                        type = PARAM_TYPE_NUMBER;
                    } else if (type.equals(PARAM_TYPE_DATE)) {
                        type = PARAM_TYPE_DATE;
                    } else if (type.equals(PARAM_TYPE_COOKIE)) {
                        type = PARAM_TYPE_COOKIE;
                    } else {
                        type = PARAM_TYPE_STRING;
                    }
                    boolean require = false;
                    if (requireAttr != null && requireAttr.length() > 0) {
                        if (requireAttr.equalsIgnoreCase("Y")) {
                            require = true;
                        }
                    }
                    parameterList.add(new Parameter(name, type, desc, hints, filter, require, value, evalStr));
                }
            }
        }
        return parameterList;
    }

    public List<Parameter> getParameterList()
            throws XPathExpressionException {
        Element doucumentElement = this.document.getDocumentElement();
        List<Parameter> parameterList = getParameterList(doucumentElement);
        return parameterList;
    }

    public Map<String, IpGroup> getIpGroupMap()
            throws XPathExpressionException {
        Element doucumentElement = this.document.getDocumentElement();
        NodeList nodes = getNodeList(doucumentElement, EL_IP_GROUP);
        Map<String, IpGroup> ipGroupMap = new LinkedHashMap<String, IpGroup>();
        for (int i = 0; i < nodes.getLength(); i++) {
            Element ipGroupEl = (Element) nodes.item(i);
            String name = ipGroupEl.getAttribute(ATTR_NAME);
            String text = ipGroupEl.getTextContent();
            if (McpString.isNotEmpty(text)) {
                ipGroupMap.put(name, new IpGroup(name, text));
            }
        }
        return ipGroupMap;
    }

    public Map<String, Acl> getAclMap(Map<String, IpGroup> ipGroupMap)
            throws XPathExpressionException {
        Element doucumentElement = this.document.getDocumentElement();
        NodeList nodes = getNodeList(doucumentElement, EL_ACL);
        Map<String, Acl> aclMap = new LinkedHashMap<String, Acl>();
        for (int i = 0; i < nodes.getLength(); i++) {
            Element aclEl = (Element) nodes.item(i);
            String name = aclEl.getAttribute(ATTR_NAME);
            String ipGroupAttr = aclEl.getAttribute(ATTR_IP_GROUP);
            String apiStr = aclEl.getTextContent();
            if (McpString.isNotEmpty(apiStr)) {
                aclMap.put(name, new Acl(name, ipGroupAttr, apiStr, ipGroupMap));
            }
        }
        return aclMap;
    }


    public HashMap<String, List<String>> getParameterGroupMap()
            throws XPathExpressionException {
        Element doucumentElement = this.document.getDocumentElement();
        NodeList nodes = getNodeList(doucumentElement, EL_PARAMETER_GROUP);
        HashMap<String, List<String>> paramGroupMap = new HashMap<String, List<String>>();
        for (int i = 0; i < nodes.getLength(); i++) {
            Element parameterGroupEl = (Element) nodes.item(i);
            String groupName = parameterGroupEl.getAttribute(ATTR_NAME);
            String text = parameterGroupEl.getTextContent();
            if (McpString.isNotEmpty(text)) {
                String[] paramNames = text
                        .trim()
                        .split("\\s+");
                paramGroupMap.put(groupName, Arrays.asList(paramNames));
            }
        }
        return paramGroupMap;
    }

    public Set<String> getRefererSet()
            throws XPathExpressionException {
        Element doucumentElement = this.document.getDocumentElement();
        NodeList nodes = getNodeList(doucumentElement, EL_REFERER);
        Set<String> refererSet = new HashSet<String>();
        for (int i = 0; i < nodes.getLength(); i++) {
            Element refererEl = (Element) nodes.item(i);
            String referers = refererEl.getTextContent();
            if (McpString.isNotEmpty(referers)) {
                referers = referers.trim();
            }
            Arrays
                    .stream(referers.split(","))
                    .forEach(r -> refererSet.add(r.trim()));
        }
        return refererSet;
    }

    private void setRequestList(Api api, Element apiEl)
            throws ApiException, XPathExpressionException {
        NodeList requestNodes = getNodeList(apiEl, EL_REQUEST);
        for (int i = 0; i < requestNodes.getLength(); i++) {
            Element requestEl = (Element) requestNodes.item(i);
            String type = requestEl.getAttribute(ATTR_TYPE);
            String evalAttr = requestEl.getAttribute(ATTR_EVAL);
            String totalAttr = requestEl.getAttribute(ATTR_TOTAL);
            String asyncAttr = requestEl.getAttribute(ATTR_ASYNC);
            boolean eval = false;
//            boolean total = false;
            boolean async = false;
            String resultName = requestEl.getAttribute(ATTR_RESULTNAME);
            String setNames = requestEl.getAttribute(ATTR_SETNAMES);
            String methodName = requestEl.getAttribute(ATTR_METHOD_NAME);
            String selector = requestEl.getAttribute(ATTR_SELECTOR);
            if (type == null || type.length() == 0) {
                type = Request.TYPE_DB;
            }
            if (evalAttr != null && evalAttr.length() != 0) {
                eval = evalAttr.equalsIgnoreCase("Y") ? true : false;
            }
//            if (totalAttr != null && totalAttr.length() != 0) {
//                total = totalAttr.equalsIgnoreCase("Y") ? true : false;
//            }
            if (asyncAttr != null && asyncAttr.length() != 0) {
                async = asyncAttr.equalsIgnoreCase("Y") ? true : false;
            }
            if (resultName == null || resultName.length() == 0) {
                resultName = ApiResult.MAIN_DATA;
            }
            String apiPath = requestEl.getAttribute(ATTR_API_PATH);
            String apiId = requestEl.getAttribute(ATTR_API_ID);
            String keys = requestEl.getAttribute(ATTR_KEYS);

            String textContent = requestEl
                    .getTextContent()
                    .trim();
            if (type.equals(Request.TYPE_DB)) {
                String dmlType = requestEl.getAttribute(ATTR_DML_TYPE);
                api.addRequest(new DbRequest(type, eval, async, resultName, setNames, textContent, totalAttr, dmlType));
            } else if (type.equals(Request.TYPE_URL)) {
                String include = requestEl.getAttribute(ATTR_INCLUDE);
                String exclude = requestEl.getAttribute(ATTR_EXCLUDE);
                api.addRequest(new UrlRequest(type, async, resultName, textContent, include, exclude, selector));
            } else if (type.equals(Request.TYPE_SCRIPT)) {
                api.addRequest(new ScriptRequest(type, async, resultName, textContent));
            } else if (type.equals(Request.TYPE_PURGE)) {
                api.addRequest(new PurgeRequest(type, apiPath, apiId, keys, async));
            } else if (type.equals(Request.TYPE_MODULE)) {
                if (McpString.isNullOrEmpty(textContent) == false) {
                    textContent = textContent.trim();
                }
                api.addRequest(new ModuleRequest(type, textContent, methodName, async, resultName));
            } else if (type.equals(Request.TYPE_API_CALL)) {
                api.addRequest(new ApiCallRequest(type, async, resultName, apiPath, apiId));
            } else if (type.equals(Request.TYPE_SAMPLE)) {
                api.addRequest(new SampleRequest(type, async, resultName, textContent));
            } else {
                throw new ApiException(String.format("Invalid Request Type: %s, API = %s/%s ", type, api
                        .getApiConfig()
                        .getPath(), api.getId()), api
                        .getApiConfig()
                        .getPath(), api.getId());
            }
        }
    }

    private void setKeys(Api api, Element apiEl)
            throws XPathExpressionException {
        Node keysNode = getNode(apiEl, EL_KEYS);
        List<String> keyList = getTokenList(keysNode);
        // #이 붙은 group에 대한 처리를 한다.
        List<String> groupSplitted = new ArrayList<String>(8);
        for (String key : keyList) {
            if (key.startsWith("#")) {
                groupSplitted.addAll(this.defaultApiConfig.getParameterNameListByParameterGroup(key));
            } else {
                groupSplitted.add(key);
            }
        }
        api.setKeyList(groupSplitted);
    }

    private List<String> getTokenList(Node node) {
        if (node != null) {
            String text = node.getTextContent();
            if (McpString.isNotEmpty(text)) {
                String[] tokens = text
                        .trim()
                        .split("\\s+");
                return Arrays.asList(tokens);
            }
        }
        return EMPTY_TOKEN_LIST;
    }
}
