/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.service;

import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePageHist;
import jmnet.moka.core.tps.mvc.articlepage.service.ArticlePageService;
import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.history.dto.HistDTO;
import jmnet.moka.core.tps.mvc.page.entity.PageHist;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;
import jmnet.moka.core.tps.mvc.template.service.TemplateHistService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Description: 히스토리
 *
 * @author ssc
 * @since 2020-11-02
 */
@Service
@Slf4j
public class HistoryServiceImpl implements HistoryService {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    PageService pageService;

    @Autowired
    ArticlePageService articlePageService;

    @Autowired
    ContainerService containerService;

    @Autowired
    TemplateHistService templateHistService;

    @Override
    public HistDTO findPageHist(Long histSeq)
            throws NoDataException {
        PageHist hist = pageService.findPageHistBySeq(histSeq)
                                   .orElseThrow(() -> new NoDataException(""));

        HistDTO histDTO = modelMapper.map(hist, HistDTO.class);
        histDTO.setBody(hist.getPageBody());
        histDTO.setRegDt(hist.getRegDt());
        histDTO.setRegId(hist.getRegId());
        return histDTO;
    }

    @Override
    public HistDTO findArticlePageHist(Long histSeq) throws NoDataException {
        ArticlePageHist hist = articlePageService.findArticlePageHistBySeq(histSeq)
                                   .orElseThrow(() -> new NoDataException(""));

        HistDTO histDTO = modelMapper.map(hist, HistDTO.class);
        histDTO.setBody(hist.getArtPageBody());
        histDTO.setRegDt(hist.getRegDt());
        histDTO.setRegId(hist.getRegId());
        return histDTO;
    }

    @Override
    public HistDTO findContainerHist(Long histSeq)
            throws NoDataException {
        ContainerHist hist = containerService.findContainerHistBySeq(histSeq)
                                             .orElseThrow(() -> new NoDataException(""));

        HistDTO histDTO = modelMapper.map(hist, HistDTO.class);
        histDTO.setBody(hist.getContainerBody());
        histDTO.setRegDt(hist.getRegDt());
        histDTO.setRegId(hist.getRegId());
        return histDTO;
    }

    @Override
    public HistDTO findTemplateHist(Long histSeq)
            throws NoDataException {
        TemplateHist hist = templateHistService.findTemplateHistBySeq(histSeq)
                                               .orElseThrow(() -> new NoDataException(""));

        HistDTO histDTO = modelMapper.map(hist, HistDTO.class);
        histDTO.setBody(hist.getTemplateBody());
        histDTO.setRegDt(hist.getRegDt());
        histDTO.setRegId(hist.getRegId());
        return histDTO;
    }

}
