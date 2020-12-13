/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.service;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamWriter;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.entity.AreaComp;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;
import jmnet.moka.core.tps.mvc.desking.service.DeskingService;
import jmnet.moka.core.tps.mvc.merge.service.MergeService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
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

    @Value("${naverStand.ftp.key}")
    private String naverFtpKey;

    @Value("${naverStand.xml.path}")
    private String naverStandXmlPath;

    @Value("${naverStand.html.path}")
    private String naverStandHtmlPath;

    @Value("${naverStand.html.url}")
    private String naverStandHtmlUrl;

    @Autowired
    private FtpHelper ftpHelper;

    @Autowired
    private MergeService mergeService;

    @Autowired
    private PageService pageService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void publishNaverStand(String source, Long areaSeq)
            throws NoDataException, XMLStreamException, IOException, TemplateParseException, DataLoadException, TemplateMergeException {
        // 편집영역조회
        Area area = areaService
                .findAreaBySeq(areaSeq)
                .orElseThrow(() -> {
                    String messageArea = messageByLocale.get("tps.common.error.no-data");
                    log.error(messageArea, true);
                    return new NoDataException(messageArea);
                });

        // html 생성
        File tmpHtmlFile = File.createTempFile("newsStand",".html");
        makeHTML(area, tmpHtmlFile);

        // xml 생성
        makeXML(area);
    }

    private void makeHTML(Area area, File htmlFile)
            throws NoDataException, TemplateMergeException, DataLoadException, TemplateParseException, IOException {
        Page page = pageService.findPageBySeq(area.getPage().getPageSeq())
                               .orElseThrow(() -> {
                                   String message = messageByLocale.get("tps.common.error.no-data");
                                   log.error(message, true);
                                   return new NoDataException(message);
                               });

        PageDTO dto = modelMapper.map(page, PageDTO.class);

        String html = mergeService.getMergePage(dto);

        File tmpFile = File.createTempFile("newsStand",".html");
        try (FileWriter writer = new FileWriter(tmpFile.getName(), true)) {
            writer.write(html);
            writer.flush();
            writer.close();

            // 파일 저장
            String fileName = naverStandHtmlPath.substring(naverStandHtmlPath.lastIndexOf("/")+1);
            String remotePath = naverStandHtmlPath.substring(0, naverStandHtmlPath.lastIndexOf("/"));
            BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(tmpFile));
            boolean upload = ftpHelper.upload(naverFtpKey, fileName, bufferedInputStream, remotePath);
            if (upload) {
                log.debug("SAVE NAVER STAND HTML FTP SEND");
            } else {
                log.debug("SAVE FAIL NAVER STAND HTML FTP SEND");
            }
            tmpFile.deleteOnExit(); // 생성된 임시파일은 종료와 함께 삭제.
        } catch (IOException e) {
            log.error("FAIL TO SAVE THE NAVER STAND HTML FILE");
        }
    }

    private void makeXML(Area area)
            throws XMLStreamException, IOException {

        // 1. 편집영역 headline 기사 데이타셋 조회
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

        // 2. 사용된 도메인 조회
        Set<String> domainList = getDomainList(topDeskingList, subDeskingList);

        // 3. xml 생성
        File tmpFile = File.createTempFile("newsStand",".xml");
        XMLOutputFactory factory = XMLOutputFactory.newFactory();
        try (FileWriter writer = new FileWriter(tmpFile.getName(), true)) {
            XMLStreamWriter xml = factory.createXMLStreamWriter(writer);
            // <?xml version="1.0" ?> 작성
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
            for(String domain: domainList) {
                xml.writeStartElement("domain");
                xml.writeCData(domain);
                xml.writeEndElement();
            }
            xml.writeEndElement();

            // headline_articles 작성성
            xml.writeStartElement("headline_articles");
            xml.writeStartElement("headline_article");

            // top 기사
            if (topDeskingList.size() > 0) {
                Desking desking = topDeskingList.get(0);
                xml.writeCharacters(System.lineSeparator());

                xml.writeStartElement("url");
                xml.writeCData(desking.getLinkUrl() == null ? "" : desking.getLinkUrl() );
                xml.writeEndElement();

                xml.writeStartElement("title");
                xml.writeCData(desking
                        .getTitle());
                xml.writeEndElement();

                String imgUrl = desking
                        .getThumbFileName();
                if(McpString.isNotEmpty(imgUrl)) {
                    xml.writeStartElement("img");
                    xml.writeCData(imgUrl);
                    xml.writeEndElement();
                }
            }

            // 서브기사
            for (Desking desking : subDeskingList) {
                xml.writeCharacters(System.lineSeparator());

                xml.writeStartElement("url");
                xml.writeCData(desking.getLinkUrl() == null ? "" : desking.getLinkUrl() );
                xml.writeEndElement();

                xml.writeStartElement("title");
                xml.writeCData(desking.getTitle());
                xml.writeEndElement();
            }

            xml.writeEndElement();  // </headline_article>
            xml.writeEndElement();  // </headline_articles>
            xml.writeEndElement();  // </newsstand>

            xml.flush();
            xml.close();

            // 파일 저장
            String fileName = naverStandXmlPath.substring(naverStandXmlPath.lastIndexOf("/")+1);
            String remotePath = naverStandXmlPath.substring(0, naverStandXmlPath.lastIndexOf("/"));
            BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(tmpFile));
            boolean upload = ftpHelper.upload(naverFtpKey, fileName, bufferedInputStream, remotePath);
            if (upload) {
                log.debug("SAVE NAVER STAND XML FTP SEND");
            } else {
                log.debug("SAVE FAIL NAVER STAND XML FTP SEND");
            }
            tmpFile.deleteOnExit(); // 생성된 임시파일은 종료와 함께 삭제.
        } catch (IOException e) {
            log.error("FAIL TO SAVE THE NAVER STAND XML FILE");
        }

    }

    private Set<String> getDomainList(List<Desking> topDeskingList, List<Desking> subDeskingList) {
        Set<String> domainList = new LinkedHashSet<>();

        // top 1 기사 link url
        Set<String> topDomainList = topDeskingList.stream()
                      .filter(item-> McpString.isNotEmpty(item.getLinkUrl()))
                      .map(item->item.getLinkUrl())
                      .collect(Collectors.toSet());
        domainList.addAll(topDomainList);

        // top 1 기사 thumbnail url
        Set<String> topImgDomainList = topDeskingList.stream()
                       .filter(item-> McpString.isNotEmpty(item.getThumbFileName()))
                       .map(item->item.getThumbFileName())
                       .collect(Collectors.toSet());
        domainList.addAll(topImgDomainList);

        // top 서브기사 link url
        Set<String> subDomainList = subDeskingList.stream()
                                                   .filter(item-> McpString.isNotEmpty(item.getLinkUrl()))
                                                   .map(item->item.getLinkUrl())
                                                   .collect(Collectors.toSet());
        domainList.addAll(subDomainList);

        return domainList;
    }
}
