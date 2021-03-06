/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.rcvarticle.dto.RcvArticleJiSearchDTO;
import jmnet.moka.core.tps.mvc.rcvarticle.dto.RcvArticleJiXmlDTO;
import jmnet.moka.core.tps.mvc.rcvarticle.entity.RcvArticleJiXml;
import jmnet.moka.core.tps.mvc.rcvarticle.service.RcvArticleJiService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JxltEngine.Template;
import org.apache.commons.jexl3.MapContext;
import org.apache.commons.jexl3.internal.Engine;
import org.apache.commons.jexl3.internal.TemplateEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * Description: ??????
 *
 * @author ssc
 * @since 2021-02-18
 */
@Controller
@Validated
@Slf4j
@RequestMapping("/jopan")
@Api(tags = {"??????"})
public class RvcArticleJiController extends AbstractCommonController {

    private static final String RECEIVE_HOST = "http://receive.joins.com/";
    private static final String IMAGE_FOLDER = "cp_data/jajopan/data/img/";
    private static final double nPersPective = 1.9; //?????? X,Y ?????? ??????
    private static final String iDEFAULTFONT = "12"; // ?????? ?????? ?????????
    private static DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
    private static XPathFactory xPathFactory = XPathFactory.newInstance();

    static {
        //????????? ???????????? ?????????.
        //        documentBuilderFactory.setIgnoringElementContentWhitespace(false);
    }

    private TemplateEngine templateEngine;
    private Template htmlTemplate;
    private Map<String, String> specialCodeMap = new LinkedHashMap<>(128);
    private XPath xpath;
    @Autowired
    private RcvArticleJiService rcvArticleJiService;

    public RvcArticleJiController()
            throws IOException, XPathExpressionException, SAXException, ParserConfigurationException {
        this.templateEngine = new TemplateEngine(new Engine(new JexlBuilder()), false, 0, '$', '#');
        Resource resource = ResourceMapper.getResource("classpath:/jopan/html.tmpl");
        String htmlTemplateContent = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining(System.lineSeparator()));
        this.htmlTemplate = this.templateEngine.createTemplate(htmlTemplateContent);
        this.xpath = xPathFactory.newXPath();
        this.loadSpecialCodeMap();
    }

    private void loadSpecialCodeMap()
            throws ParserConfigurationException, IOException, SAXException, XPathExpressionException {
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        Resource resource = ResourceMapper.getResource("classpath:/jopan/jajopan_code_convert.xml");
        Document document = documentBuilder.parse(resource.getInputStream());
        Node rootNode = document.getDocumentElement();
        NodeList itemNodeList = getNodeList(rootNode, "//ITEM");
        for (int i = 0; i < itemNodeList.getLength(); i++) {
            Node itemNode = itemNodeList.item(i);
            Node fromNode = getNode(itemNode, "FROM");
            Node toNode = getNode(itemNode, "TO");
            this.specialCodeMap.put(fromNode.getTextContent(), toNode.getTextContent());
        }
    }


    @GetMapping
    public void getRcvArticleJi(@Valid RcvArticleJiSearchDTO search, @ApiParam(hidden = true) HttpServletResponse response)
            throws Exception {
        try {
            //            RcvArticleJiSearchDTO sch = RcvArticleJiSearchDTO
            //                    .builder()
            //                    .sourceCode("1")
            //                    .ho(17149)
            //                    .pressDate(McpDate.date("2020-09-07 00:00:00"))
            //                    .myun("01")
            //                    .section("D1025")
            //                    .revision("02")
            //                    .build();
            Page<RcvArticleJiXml> returnValue = rcvArticleJiService.findAllRcvArticleJi(search);

            List<RcvArticleJiXmlDTO> dtoList = modelMapper.map(returnValue.getContent(), RcvArticleJiXmlDTO.TYPE);

            if (dtoList != null && dtoList.size() > 0) {
                RcvArticleJiXmlDTO rcvArticleJiXmlDTO = dtoList.get(0);

                response.setHeader("X-XSS-Protection", "0");
                response.setContentType("text/html; charset=UTF-8");
                previewHtml(rcvArticleJiXmlDTO, response);
            } else {
                Writer writer = response.getWriter();
                writer.write("<script type='text/javascript'>\nalert('???????????? ????????????.');</script>");
                writer.close();
            }
        } catch (Exception e) {
            log.error("[FAIL TO LOAD RCV ARTICLE JI XML]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD RCV ARTICLE JI XML]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }

    }

    private void previewHtml(RcvArticleJiXmlDTO rcvArticleJiXmlDTO, HttpServletResponse response)
            throws IOException, XPathExpressionException, SAXException, ParserConfigurationException {

        MapContext context = new MapContext();
        context.set("preview", getHtml(rcvArticleJiXmlDTO));
        context.set("info", getJopanInfo(rcvArticleJiXmlDTO));
        this.htmlTemplate.evaluate(context, response.getWriter());
    }

    private String getHtml(RcvArticleJiXmlDTO rcvArticleJiXmlDTO)
            throws ParserConfigurationException, IOException, SAXException, XPathExpressionException {
        String pressDate = rcvArticleJiXmlDTO.getPressDate();
        String pressYear = pressDate.substring(0, 4);
        String pressMonth = pressDate.substring(4, 6);
        String pressDay = pressDate.substring(6);
        String xmlBody = rcvArticleJiXmlDTO.getXmlBody();
        StringBuilder sb = new StringBuilder(1024);
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        BufferedReader sr = new BufferedReader(new StringReader(xmlBody));
        String xmlPi = sr.readLine();
        ByteArrayInputStream bi = null;
        if (xmlPi.contains("EUC-KR")) {
            bi = new ByteArrayInputStream(xmlBody.getBytes("EUC-KR"));
        } else {
            bi = new ByteArrayInputStream(xmlBody.getBytes("UTF-8"));
        }
        Document document = documentBuilder.parse(bi);
        Node rootNode = document.getDocumentElement();
        NodeList newsComponentList = getNodeList(rootNode, "//NewsItem/NewsComponent/NewsComponent");
        double fontSize = 0;
        int index = 1;
        for (int i = 0; i < newsComponentList.getLength(); i++) {
            String content = null;
            Node newsComponentNode = newsComponentList.item(i);
            String headLine = getNodeValue(newsComponentNode, "NewsLines/HeadLine"); //?????????????????? ?????? ???????????????
            String byLine = getNodeValue(newsComponentNode, "NewsLines/ByLine"); //ByLine
            String byLineEmail = getNodeValue(newsComponentNode, "NewsLines/ByLineAddress"); //?????????
            String byLineDept = getNodeValue(newsComponentNode, "NewsLines/ByLineDept"); //??????
            String kisaType = getNodeValue(newsComponentNode, "NewsLines/KisaType"); //element type ??????/?????????/??????/??????
            String orgId = getNodeValue(newsComponentNode, "NewsLines/OrgID"); //element type OrgID
            String pageCoord = getNodeValue(newsComponentNode, "ContentItem/Characteristics/PageCoordinate"); //element type OrgID
            pageCoord = removeBracket(pageCoord);
            String mediaType = getAttributeValue(newsComponentNode, "ContentItem/MediaType/@FormalName"); //Image - Text ??????
            String[] arrPageCoord = pageCoord.split(" ");
            String xSize = scale(arrPageCoord[2]);
            String ySize = scale(arrPageCoord[3]);
            if (index == 1) {
                sb.append("<div id=\"JContent\" style=\"float:left;position:relative;border:1px solid #000;width:" + xSize + "px;height:" + ySize
                        + "px;\">");
            }

            String itemCoord = getNodeValue(newsComponentNode, "ContentItem/Characteristics/ItemCoordinate");
            itemCoord = removeBracket(itemCoord);
            String[] arrItemCoord = itemCoord.split(" ");
            String xPos = scale(arrItemCoord[0]);
            String yPos = scale(arrItemCoord[1]);
            String xWidth = scale(arrItemCoord[2]);
            String yHeight = scale(arrItemCoord[3]);
            Node propertyNode = getNode(newsComponentNode, "ContentItem/Characteristics/Property");
            if (propertyNode != null) {
                String propertyAttr = getAttributeValue(newsComponentNode, "ContentItem/Characteristics/Property/@FormalName");
                if (McpString.isNotEmpty(propertyAttr) && propertyAttr.equals("FontSize")) {
                    String fontSizeStr = getAttributeValue(newsComponentNode, "ContentItem/Characteristics/Property/@Value");
                    fontSize = convertDobule(fontSizeStr, 0);
                }
            }
            Node orgIdNode = getNode(newsComponentNode, "NewsLines/OrgID");
            if (orgIdNode != null) {
                orgId = getNodeValue(orgIdNode);
            }

            String imageFile = getAttributeValue(newsComponentNode, "ContentItem/@Href");
            if (mediaType.equals("Image")) {
                imageFile = imageFile.substring(imageFile.lastIndexOf("/") + 1) + ".jpg";
                content = "<img src=\"" + RECEIVE_HOST + IMAGE_FOLDER + pressYear + pressMonth + "/" + imageFile + "\" width='100%'>";
            } else {
                Node dataContentNode = getNode(newsComponentNode, "ContentItem/DataContent");
                if (dataContentNode != null) {
                    content = getNodeValue(dataContentNode); // ??????
                }
                if (McpString.isNotEmpty(content)) {
                    //                    content = content.replace("\r", "\n");
                    content = content.replace("\n", "\n\n");
                    content = content.replace("\n\n\n\n", "\n\n\n");
                    int nbreak = 0; // ?????? 10?????? \n ??????
                    while (content.endsWith("\n") && nbreak < 10) {
                        nbreak++;
                        content = content.substring(0, content.length() - 1);
                    }
                    content = content.replaceAll("( *)([a-z0-9.]*)@(joongang.co.kr|jcubei.com)", "$1&lt;$2@$3&gt;"); //?????? ???????????? <>??? ?????????
                }
            }

            if (content != null && content
                    .trim()
                    .length() > 0) {
                String jCompCssColor = "";
                String jCompCssZindex = "z-index:1;";
                String jCompCssBorder = "border:1px dashed #00f;";
                String jCompCssFontSz = "font-size:" + iDEFAULTFONT + "px;";
                String jCompCssFontBd = "";
                String jCompCssStyle = "";
                String jCompCssName = "jcomp";
                String jCompTypeCode =
                        "";   //?????? ?????? ??????????????? {"Image": "IM", "ImageDesc": "ID", "Contents": "CO", "Reporter": "RE", "SubTitle": "ST", "Title": "TT"}
                if (Double.parseDouble(yPos) > 33) {
                    if (mediaType.equals("Image")) {
                        jCompTypeCode = "IM";  //?????????
                        jCompCssColor = "background-color:#F6FFCC;";
                    } else {
                        if (kisaType.equals("??????")) {
                            if (fontSize < 19) {
                                jCompTypeCode = "ST";  //?????????
                                jCompCssColor = "background-color:#FFD8D8;";
                            } else {
                                jCompTypeCode = "TT";  //??????
                                jCompCssColor = "background-color:#FF9DFF;";
                                jCompCssFontBd = "font-weight:bold;";
                            }
                        } else if (kisaType.equals("??????")) {
                            if (fontSize < 10) {
                                if (fontSize == 8.6) {
                                    jCompTypeCode = "ID";  //????????????
                                    jCompCssColor = "background-color:#D2E5A8;";
                                } else {
                                    jCompTypeCode = "OT";  //?????????
                                    jCompCssColor = "background-color:#C29F6D;";
                                }
                            } else {
                                if (fontSize >= 12) {
                                    jCompTypeCode = "ST";  //?????????
                                    jCompCssColor = "background-color:#FFD8D8;";
                                } else {
                                    jCompTypeCode = "CO";  //??????
                                    jCompCssZindex = "z-index:0;";
                                }
                            }
                        } else {
                            if (content
                                    .replaceAll("[a-z]", "")
                                    .length() < 30 && content.indexOf("??????") > 0 || content.indexOf("@joongang.co.kr") > 0) {
                                jCompTypeCode = "RE";  //????????????
                                jCompCssColor = "background-color:#FAED7D;";
                                content = content.replace("\n\n", "\n");
                            } else {
                                if (fontSize < 10) {
                                    if (fontSize == 8.6) {
                                        jCompTypeCode = "ID";  //????????????
                                        jCompCssColor = "background-color:#D2E5A8;";
                                    } else if (fontSize < 8.6) {
                                        jCompTypeCode = "OT";  //?????????
                                        jCompCssColor = "background-color:#C29F6D;";
                                    } else {
                                        jCompTypeCode = "CO";  //??????
                                        jCompCssZindex = "z-index:0;";
                                    }
                                } else if (fontSize >= 10 && fontSize < 12) {
                                    jCompTypeCode = "CO";  //??????
                                    jCompCssZindex = "z-index:0;";
                                    jCompCssColor = "background-color:#FFFFFF;";
                                } else if (fontSize >= 12 && fontSize < 19) {
                                    jCompTypeCode = "ST";  //?????????
                                    jCompCssColor = "background-color:#FFD8D8;";
                                } else if (fontSize >= 19) {
                                    jCompTypeCode = "TT";  //??????
                                    jCompCssColor = "background-color:#FF9DFF;";
                                    jCompCssFontBd = "font-weight:bold;";
                                } else {
                                    jCompTypeCode = "OT";  //???????
                                    jCompCssColor = "background-color:black;";
                                }
                            }
                        }
                    }
                } else {
                    //???????????? ?????????
                    jCompCssName = "jcompSectionTitle";
                    jCompCssBorder = "";
                    jCompTypeCode = "XX";
                    jCompCssZindex = "z-index:0;";
                }
                jCompCssStyle = "style=\"" + jCompCssColor + jCompCssZindex + jCompCssFontSz + jCompCssFontBd + jCompCssBorder
                        + "position:absolute;overflow:hidden;left:" + xPos + "px;top:" + yPos + "px;width:" + xWidth + "px;height:" + yHeight
                        + "px;\"";
                content = convertSpecialTag(content); // ??????????????? ??????
                sb.append("<div class=\"" + jCompCssName + "\" id=\"JComp" + index + "\" CustomCD=\"" + jCompTypeCode + "\" OrgID=\"" + orgId
                        + "\" kysatype=\"" + kisaType + "\" FontSize=\"" + Double.toString(fontSize) + "\" MediaType=\"" + mediaType
                        + "\" ImageFile=\"" + imageFile + "\" HeadLine=\"" + headLine + "\" ByLine=\"" + byLine + "\" ByLineAddress=\"" + byLineEmail
                        + "\" ByLineDept=\"" + byLineDept + "\" " + jCompCssStyle + ">" + content + "</div>");
                index++;
            }
        } // ??????
        sb.append("<input type=\"hidden\" id=\"tCompCnt\" value=\"" + (index - 1) + "\" />");
        return sb.toString();
    }

    private String scale(String value) {
        //        return Integer.toString((int) Math.ceil(Double.parseDouble(value) * nPersPective));
        return Double.toString(Double.parseDouble(value) * nPersPective);
    }

    private String getJopanInfo(RcvArticleJiXmlDTO rcvArticleJiXmlDTO) {
        String pressDate = rcvArticleJiXmlDTO.getPressDate();
        String pressYear = pressDate.substring(0, 4);
        String pressMonth = pressDate.substring(4, 6);
        String pressDay = pressDate.substring(6);
        String sectionCode = rcvArticleJiXmlDTO
                .getId()
                .getSection();
        String myun = rcvArticleJiXmlDTO
                .getId()
                .getMyun();
        String pan = rcvArticleJiXmlDTO
                .getId()
                .getPan();
        String revision = rcvArticleJiXmlDTO
                .getId()
                .getRevision();
        return String.format("%s??? %s??? %s??? - %s - %s??? - %s???(Ver.%s)", pressYear, pressMonth, pressDay, getJoongangSectionName(sectionCode), myun, pan,
                revision);
    }

    private String getJoongangSectionName(String sectionCode) {
        String joongangSectionName = "??????";
        if (McpString.isNotEmpty(sectionCode)) {
            if (sectionCode.equals("W5007")) {
                joongangSectionName = "S?????????";
            }
        }
        return joongangSectionName;
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

    private String getAttributeValue(Node node, String xpathStr)
            throws XPathExpressionException {
        XPathExpression exp = this.xpath.compile(xpathStr);
        Object result = exp.evaluate(node, XPathConstants.NODE);
        if (result != null) {
            Node resultNode = (Node) result;
            return resultNode.getNodeValue();
        }
        return "";
    }

    private String removeBracket(String text) {
        return text
                .replace("[", "")
                .replace("]", "");
    }

    private double convertDobule(String value, double defaultValue) {
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private String convertSpecialTag(String content) {
        for (Entry<String, String> entry : this.specialCodeMap.entrySet()) {
            content = content.replace(entry.getKey(), entry.getValue());
        }
        return content;
    }
}
