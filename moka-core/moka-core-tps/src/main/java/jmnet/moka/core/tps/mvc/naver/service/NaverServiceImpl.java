/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.service;

import java.util.List;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamWriter;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.entity.AreaComp;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;
import jmnet.moka.core.tps.mvc.desking.service.DeskingService;
import lombok.extern.slf4j.Slf4j;
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

    @Value("${wimage.url}")
    private String wimageUrl;

    @Override
    public void publishNaverStand(String source, Long areaSeq)
            throws NoDataException, XMLStreamException {
        // 편집영역조회
        Area area = areaService
                .findAreaBySeq(areaSeq)
                .orElseThrow(() -> {
                    String messageArea = messageByLocale.get("tps.common.error.no-data");
                    log.error(messageArea, true);
                    return new NoDataException(messageArea);
                });

        // 편집영역 headline 기사 데이타셋 조회
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

        // xml 생성
        if (topDatasetSeq != null && subDatasetSeq != null) {
            makeXML(topDatasetSeq, subDatasetSeq);
        }

        // html 생성
    }

    private void makeXML(Long topDatasetSeq, Long subDatasetSeq)
            throws XMLStreamException {

        XMLStreamWriter xml = XMLOutputFactory
                .newFactory()
                .createXMLStreamWriter(System.out);
        xml.writeStartElement("headline_articles");
        xml.writeStartElement("headline_article");

        // top 기사
        List<Desking> topDeskingList = deskingService.findByDatasetSeq(topDatasetSeq);
        if (topDeskingList.size() > 0) {
            xml.writeCharacters(System.lineSeparator());

            xml.writeStartElement("url");
            xml.writeCharacters(topDeskingList
                    .get(0)
                    .getLinkUrl());
            xml.writeEndElement();

            xml.writeStartElement("title");
            xml.writeCharacters(topDeskingList
                    .get(0)
                    .getTitle());
            xml.writeEndElement();

            // 첫번째 기사만 넣기
            String imgUrl = wimageUrl + topDeskingList
                    .get(0)
                    .getThumbFileName();
            xml.writeStartElement("img");
            xml.writeCharacters(imgUrl);
            xml.writeEndElement();
        }

        // 서브기사
        List<Desking> subDeskingList = deskingService.findByDatasetSeq(subDatasetSeq);
        for (Desking desking : subDeskingList) {
            xml.writeCharacters(System.lineSeparator());

            xml.writeStartElement("url");
            xml.writeCharacters(desking.getLinkUrl());
            xml.writeEndElement();

            xml.writeStartElement("title");
            xml.writeCharacters(desking.getTitle());
            xml.writeEndElement();

            // 첫번째 기사만 넣기
            String imgUrl = wimageUrl + desking.getThumbFileName();
            xml.writeStartElement("img");
            xml.writeCharacters(imgUrl);
            xml.writeEndElement();
        }


        xml.writeEndElement();  // </headline_article>
        xml.writeEndElement();  // </headline_articles>
        xml.close();
    }
}
