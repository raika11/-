/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.dps.module;

import java.io.IOException;
import java.io.StringReader;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
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
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.RequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * Description: url의 데이타를 로딩한다
 *
 * @author ssc
 * @since 2021-04-19
 */
@Slf4j
public class UrlModule implements ModuleInterface {

    private static final List<Object> EMPTY_LIST = new ArrayList<>();
    private static DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
    private static XPathFactory xPathFactory = XPathFactory.newInstance();
    private XPath xpath;

    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;

    public UrlModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
        this.xpath = xPathFactory.newXPath();
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {
        return null;
    }

    public Object getXmlLoad(ApiContext apiContext) {
        long startTime = System.currentTimeMillis();
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        ApiResult apiResult = ApiResult.createApiResult(startTime, System.currentTimeMillis(), EMPTY_LIST, true, null);

        try {
            apiResult.put(RequestHandler.PARAM_MAP, checkedParamMap);

            String url = getMostViewedArticleUrl(checkedParamMap
                    .get("cat")
                    .toString());
            Integer count = Integer.parseInt(checkedParamMap
                    .get("count")
                    .toString());

            if (McpString.isEmpty(url)) {
                checkedParamMap.put("_SUCCESS", false);
                checkedParamMap.put("_MESSAGE", "카테고리에 해당하는 XML정보가 없습니다.");
                return apiResult;
            }

            String resultString = moduleRequestHandler
                    .getHttpProxy()
                    .getString(url);

            List<Map<String, Object>> result = parse(resultString, count);

            checkedParamMap.put("_SUCCESS", true);
            apiResult.put(ApiResult.MAIN_DATA, result);
            return apiResult;

        } catch (Exception e) {
            log.error("module exception : {} {} {}", apiContext.getApiPath(), apiContext.getApiId(), e.getMessage(), e);
            checkedParamMap.put("_SUCCESS", false);
            checkedParamMap.put("_MESSAGE", e.getMessage());
            return apiResult;
        }
    }

    private String getMostViewedArticleUrl(String cat)
            throws Exception {
        String server = "https://static.joins.com/joongang_15re/scripts/data/";
        String xmlfile = "";
        switch (cat) {
            case "Retirement":
                xmlfile = "sonagi/xml/article_right_sonagi_retirement.xml";
                break;
            //            default:
            //                xmlfile = "sonagi/xml/article_right_sonagi_total.xml";
        }

        return McpString.isEmpty(xmlfile) ? null : server + xmlfile;
    }

    private List<Map<String, Object>> parse(String resultString, Integer count)
            throws ParserConfigurationException, IOException, SAXException, XPathExpressionException, ParseException {
        List<Map<String, Object>> returnList = new ArrayList<>();
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        Document document = documentBuilder.parse(new InputSource(new StringReader(resultString)));
        Node rootNode = document.getDocumentElement();
        NodeList itemNodeList = getNodeList(rootNode, "//article");
        for (int i = 0; i < itemNodeList.getLength() && i < count; i++) {
            Map<String, Object> map = new HashMap<>();
            Node itemNode = itemNodeList.item(i);
            Node totalIdNode = getNode(itemNode, "total_id");
            //            Node ctgNode = getNode(itemNode, "ctg");
            //            Node categorykeyNode = getNode(itemNode, "categorykey");
            Node thumbnailNode = getNode(itemNode, "thumbnail");
            Node serviceDayNode = getNode(itemNode, "service_day");
            Node serivceTimeNode = getNode(itemNode, "serivce_time");
            Node registeddateNode = getNode(itemNode, "registeddate");
            Node titleNode = getNode(itemNode, "title");

            String serviceDaytime = convertDate(serviceDayNode.getTextContent() + serivceTimeNode.getTextContent());
            String regDt = convertDate(registeddateNode.getTextContent());

            map.put("TOTAL_ID", Integer.parseInt(totalIdNode.getTextContent()));
            map.put("ART_THUMB", thumbnailNode.getTextContent());
            map.put("SERVICE_DAYTIME", serviceDaytime);
            map.put("ART_REG_DT", regDt);
            map.put("ART_TITLE", titleNode.getTextContent());
            returnList.add(map);
        }
        return returnList;
    }

    private String convertDate(String yyyyMMddHHmmss)
            throws ParseException {
        Date dt = McpDate.date("yyyyMMddHHmmss", yyyyMMddHHmmss);
        return McpDate.dateStr(dt, McpDate.DATETIME_FORMAT);
    }

    private NodeList getNodeList(Node node, String xpathStr)
            throws XPathExpressionException {
        XPathExpression exp = this.xpath.compile(xpathStr);
        Object result = exp.evaluate(node, XPathConstants.NODESET);
        return (NodeList) result;
    }

    private Node getNode(Node node, String xpathStr)
            throws XPathExpressionException {
        XPathExpression exp = this.xpath.compile(xpathStr);
        Object result = exp.evaluate(node, XPathConstants.NODE);
        return (Node) result;
    }

    private String getNodeValue(Node node, String xpathStr)
            throws XPathExpressionException {
        XPathExpression exp = this.xpath.compile(xpathStr);
        Object result = exp.evaluate(node, XPathConstants.NODE);
        if (result != null) {
            Node resultNode = (Node) result;
            return getNodeValue(resultNode);
        }
        return "";
    }

    private String getNodeValue(Node node) {
        NodeList children = node.getChildNodes();
        if (children != null && children.getLength() > 0) {
            int childrenCount = children.getLength();
            if (childrenCount == 1) {
                return node.getTextContent();
            } else {
                boolean hasCDATA = false;
                Node cdataNode = null;
                for (int i = 0; i < childrenCount; i++) {
                    Node childNode = children.item(i);
                    if (childNode.getNodeType() == Node.CDATA_SECTION_NODE) {
                        hasCDATA = true;
                        cdataNode = childNode;
                    }
                }
                if (hasCDATA) {
                    return cdataNode.getTextContent();
                }
                return node.getTextContent();
            }
        } else {
            return "";
        }
    }
}
