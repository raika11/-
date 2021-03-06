/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.service;

import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamWriter;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.entity.AreaComp;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;
import jmnet.moka.core.tps.mvc.desking.service.DeskingService;
import jmnet.moka.core.tps.mvc.merge.service.MergeService;
import jmnet.moka.core.tps.mvc.naver.vo.NaverChannelVO;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Description: ??????
 *
 * @author ssc
 * @since 2020-12-10
 */
@Service
@Slf4j
public class NaverServiceImpl implements NaverService {

    @Autowired
    private DeskingService deskingService;

    @Autowired
    private AreaService areaService;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private TpsLogger tpsLogger;

    @Value("${naver.ftp.key}")
    private String naverFtpKey;

    @Value("${naver.stand.xml.path}")
    private String naverStandXmlPath;

    @Value("${naver.stand.html.path}")
    private String naverStandHtmlPath;

    @Value("${naver.stand.html.url}")
    private String naverStandHtmlUrl;

    @Value("${naver.channel.path}")
    private String naverChannelPath;

    @Value("${naver.channel.editorId}")
    private String naverChannelEditorId;

    @Value("${naver.channel.feedbackEmail}")
    private String naverChannelEmail;

    @Autowired
    private FtpHelper ftpHelper;

    @Autowired
    private MergeService mergeService;

    @Autowired
    private PageService pageService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public boolean publishNaverStand(Long areaSeq)
            throws Exception {
        // ??????????????????
        Area area = areaService
                .findAreaBySeq(areaSeq)
                .orElseThrow(() -> {
                    String messageArea = messageByLocale.get("tps.common.error.no-data");
                    log.error(messageArea, true);
                    return new NoDataException(messageArea);
                });

        // html ??????
        String html = makeHTML(area);

        // html?????? ????????? ??????
        Set<String> domainList = getDomainList(html);

        // xml ??????
        boolean sendXml = false;
        if (McpString.isNotEmpty(html)) {
            sendXml = makeXML(area, domainList);
        }

        // html, xml?????? ????????? ????????? ??????.
        if (McpString.isEmpty(html) || !sendXml) {
            return false;
        }
        return true;
    }

    @Override
    public boolean publishNaverChannel(Long areaSeq)
            throws IOException, NoDataException {
        // ??????????????????
        Area area = areaService
                .findAreaBySeq(areaSeq)
                .orElseThrow(() -> {
                    String messageArea = messageByLocale.get("tps.common.error.no-data");
                    log.error(messageArea, true);
                    return new NoDataException(messageArea);
                });

        NaverChannelVO channel = NaverChannelVO
                .builder()
                .editorId(naverChannelEditorId)
                .feedbackEmail(naverChannelEmail)
                .build();

        if (area
                .getAreaComps()
                .size() > 0) {
            AreaComp comp = area
                    .getAreaComps()
                    .get(0);
            // ???????????? ??????
            String templateName = comp
                    .getComponent()
                    .getTemplate()
                    .getTemplateName();
            channel.setTemplate(templateName);

            // ???????????? ??????
            List<Map<String, String>> headlineArticles = new ArrayList<>();
            Long datasetSeq = comp
                    .getComponent()
                    .getDataset()
                    .getDatasetSeq();
            List<Desking> deskingList = deskingService.findByDatasetSeq(datasetSeq);
            for (Desking desking : deskingList) {
                if (desking.getParentContentId() == null) {
                    Map<String, String> article = new HashMap<>();
                    article.put("nsid", desking.getContentId());
                    headlineArticles.add(article);
                }
            }
            if (headlineArticles.size() > 0) {
                channel.setHeadlineArticles(headlineArticles);
            }
        }

        File jsonFile = File.createTempFile("naverChannel", ".json");
        try {
            ResourceMapper
                    .getDefaultObjectMapper()
                    .writerWithDefaultPrettyPrinter()
                    .writeValue(jsonFile, channel);
            //            ResourceMapper.writeJson(jsonFile, channel);

            // ?????? ??????
            String fileName = naverChannelPath.substring(naverChannelPath.lastIndexOf("/") + 1);
            String remotePath = naverChannelPath.substring(0, naverChannelPath.lastIndexOf("/"));
            BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(jsonFile));
            boolean upload = ftpHelper.upload(naverFtpKey, fileName, bufferedInputStream, remotePath);
            if (upload) {
                tpsLogger.success(ActionType.UPLOAD, true);
                log.debug("SEND NAVER_CHANNEL_JSON TO FTP: {}", jsonFile.getPath());
                return false;
            } else {
                tpsLogger.error(ActionType.UPLOAD, "FAIL TO SEND NAVER_CHANNEL_JSON TO FTP", true);
                log.debug("FAIL TO SEND NAVER_CHANNEL_JSON TO FTP: {}", jsonFile.getPath());
            }
            jsonFile.deleteOnExit(); // ????????? ??????????????? ????????? ?????? ??????.
        } catch (IOException e) {
            log.error("FAIL TO SEND NAVER_CHANNEL_JSON");
        }
        return true;

    }

    /**
     * ?????????????????? HTML?????? ??????
     *
     * @param area ??????????????????
     * @return html?????? ??????
     * @throws NoDataException
     * @throws TemplateMergeException
     * @throws DataLoadException
     * @throws TemplateParseException
     * @throws IOException
     */
    private String makeHTML(Area area)
            throws NoDataException, TemplateMergeException, DataLoadException, TemplateParseException, IOException {
        Page page = pageService
                .findPageBySeq(area
                        .getPage()
                        .getPageSeq())
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    log.error(message, true);
                    return new NoDataException(message);
                });

        PageDTO dto = modelMapper.map(page, PageDTO.class);

        String html = mergeService.getMergePage(dto, false);

        html = html.replace("nv_arti=\"\"", "nv_arti");
        html = html.replace("</li>nn<li>", "</li><li>");

        File htmlFile = File.createTempFile("newsStand", ".html");
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(htmlFile))) {
            writer.write(html);
            writer.close();

            // ?????? ??????
            String fileName = naverStandHtmlPath.substring(naverStandHtmlPath.lastIndexOf("/") + 1);
            String remotePath = naverStandHtmlPath.substring(0, naverStandHtmlPath.lastIndexOf("/"));
            BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(htmlFile));
            boolean upload = ftpHelper.upload(naverFtpKey, fileName, bufferedInputStream, remotePath);
            if (upload) {
                tpsLogger.success(ActionType.UPLOAD, true);
                log.debug("SEND NAVER_STAND_HTML TO FTP: {}", htmlFile.getPath());
                return html;
            } else {
                tpsLogger.error(ActionType.UPLOAD, "FAIL TO SEND NAVER_STAND_HTML TO FTP", true);
                log.debug("FAIL TO SEND NAVER_STAND_HTML TO FTP: {}", htmlFile.getPath());
            }
            htmlFile.deleteOnExit(); // ????????? ??????????????? ????????? ?????? ??????.
        } catch (IOException e) {
            log.error("FAIL TO SEND NAVER_STAND_HTML");
        }
        return null;
    }

    /**
     * ?????????????????? xml??????
     *
     * @param area       ????????????
     * @param domainList ???????????????
     * @return xml?????? ????????????
     * @throws XMLStreamException
     * @throws IOException
     */
    private boolean makeXML(Area area, Set<String> domainList)
            throws XMLStreamException, IOException {

        // 1. ???????????? headline ?????? ???????????? ??????
        Long topDatasetSeq = null;
        Long subDatasetSeq = null;
        if (area
                .getAreaComps()
                .size() > 1) {
            AreaComp topComp = area
                    .getAreaComps()
                    .get(0);
            topDatasetSeq = topComp
                    .getComponent()
                    .getDataset()
                    .getDatasetSeq();

            AreaComp subComp = area
                    .getAreaComps()
                    .get(1);
            subDatasetSeq = subComp
                    .getComponent()
                    .getDataset()
                    .getDatasetSeq();
        }
        List<Desking> topDeskingList = deskingService.findByDatasetSeq(topDatasetSeq);
        List<Desking> subDeskingList = deskingService.findByDatasetSeq(subDatasetSeq);

        // 3. xml ??????
        File tmpFile = File.createTempFile("newsStand", ".xml");
        XMLOutputFactory factory = XMLOutputFactory.newFactory();
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(tmpFile))) {
            XMLStreamWriter xml = factory.createXMLStreamWriter(writer);
            // <?xml version="1.0" ?> ??????
            xml.writeStartDocument();

            // <newsstand>
            xml.writeStartElement("newsstand");

            // <status>
            xml.writeStartElement("status");
            xml.writeCData("on");
            xml.writeEndElement();

            // <cause>
            xml.writeStartElement("cause");
            xml.writeCData("");
            xml.writeEndElement();

            // <source>
            xml.writeStartElement("source");
            xml.writeCData(naverStandHtmlUrl);
            xml.writeEndElement();

            // <modified>
            xml.writeStartElement("modified");
            xml.writeCData(McpDate.dateStr(McpDate.now(), MokaConstants.JSON_DATE_FORMAT));
            xml.writeEndElement();

            // <domains>
            xml.writeStartElement("domains");
            for (String domain : domainList) {
                xml.writeStartElement("domain");
                xml.writeCData(domain);
                xml.writeEndElement();
            }
            xml.writeEndElement();

            // headline_articles ?????????
            xml.writeStartElement("headline_articles");

            // top ??????
            xml.writeStartElement("headline_article");
            if (topDeskingList.size() > 0) {
                Desking desking = topDeskingList.get(0);
                xml.writeCharacters(System.lineSeparator());

                xml.writeStartElement("url");
                xml.writeCData(desking.getLinkUrl() == null ? "" : desking.getLinkUrl());
                xml.writeEndElement();

                xml.writeStartElement("title");
                xml.writeCData(trimTitle(desking.getTitle()));
                xml.writeEndElement();

                String imgUrl = desking.getThumbFileName();
                if (McpString.isNotEmpty(imgUrl)) {
                    xml.writeStartElement("img");
                    xml.writeCData(imgUrl);
                    xml.writeEndElement();
                }
            }
            xml.writeEndElement();  // </headline_article>

            // ????????????
            for (Desking desking : subDeskingList) {
                xml.writeCharacters(System.lineSeparator());

                xml.writeStartElement("url");
                xml.writeCData(desking.getLinkUrl() == null ? "" : desking.getLinkUrl());
                xml.writeEndElement();

                xml.writeStartElement("title");
                xml.writeCData(trimTitle(desking.getTitle()));
                xml.writeEndElement();
            }

            xml.writeEndElement();  // </headline_articles>
            xml.writeEndElement();  // </newsstand>

            xml.flush();
            xml.close();

            // ?????? ??????
            String fileName = naverStandXmlPath.substring(naverStandXmlPath.lastIndexOf("/") + 1);
            String remotePath = naverStandXmlPath.substring(0, naverStandXmlPath.lastIndexOf("/"));
            BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(tmpFile));
            boolean upload = ftpHelper.upload(naverFtpKey, fileName, bufferedInputStream, remotePath);
            if (upload) {
                tpsLogger.success(ActionType.UPLOAD, true);
                log.debug("SEND NAVER_STAND_XML TO FTP: {}", tmpFile.getPath());
                return true;
            } else {
                tpsLogger.error(ActionType.UPLOAD, "FAIL TO SEND NAVER_STAND_XML TO FTP", true);
                log.debug("FAIL TO SEND NAVER_STAND_XML TO FTP: {}", tmpFile.getPath());
            }
            tmpFile.deleteOnExit(); // ????????? ??????????????? ????????? ?????? ??????.
        } catch (IOException e) {
            log.error("FAIL TO SEND NAVER_STAND_XML TO FTP");
        }
        return false;
    }

    /**
     * ???????????? ????????????(xml?????? ??????)
     *
     * @param title ??????
     * @return ??????????????? ??????
     */
    private String trimTitle(String title) {
        String retTitle = title;

        retTitle = retTitle.replaceAll("<strong>", "");
        retTitle = retTitle.replaceAll("</strong>", "");
        retTitle = retTitle.replaceAll("<span>", "");
        retTitle = retTitle.replaceAll("</span>", "");

        retTitle = retTitle.replaceAll("(?i)<img\\s[^>]*>(?:\\s*?</img>)?", "");
        retTitle = retTitle.replaceAll("(?i)<strong\\s[^>]*>(?:\\s*?</strong>)?", "");
        retTitle = retTitle.replaceAll("(?i)<span\\s[^>]*>(?:\\s*?</span>)?", "");
        retTitle = retTitle.replaceAll("(?i)<font\\s[^>]*>(?:\\s*?</font>)?", "");
        retTitle = retTitle.replaceAll("(?i)<br/>", "");
        retTitle = retTitle.replaceAll("(?i)<br>", "");

        return retTitle;
    }

    /**
     * html?????? ?????? ????????? ??????
     *
     * @param html html??????
     * @return ???????????????
     * @throws MalformedURLException
     */
    private Set<String> getDomainList(String html)
            throws MalformedURLException {
        Set<String> domainList = new LinkedHashSet<>();
        appendDomain(domainList, html, "<a href=\\\"(?<entry>.*?)\\\"");
        appendDomain(domainList, html, "src=\\\"(?<entry>.*?)\\\"");
        appendDomain(domainList, html, "src='(?<entry>.*?)'");
        return domainList;
    }

    /**
     * ???????????? ?????? host??? ????????????.
     *
     * @param domainList ???????????????
     * @param html       html??????
     * @param regx       ????????? ?????????
     * @throws MalformedURLException
     */
    private void appendDomain(Set<String> domainList, String html, String regx)
            throws MalformedURLException {
        Pattern pattern1 = Pattern.compile(regx, Pattern.CASE_INSENSITIVE);
        Matcher matcher1 = pattern1.matcher(html);
        String url = "";
        while (matcher1.find()) {
            url = matcher1.group(1);
            if (!url.equals("#") && McpString.isNotEmpty(url)) {
                if (!url.startsWith("http") && !url.startsWith("https")) {
                    url = "http:" + url;
                }
                URL netUrl = new URL(url);
                String host = netUrl.getHost();
                if (McpString.isNotEmpty(host)) {
                    domainList.add(host);
                }
            }
        }
    }


}
