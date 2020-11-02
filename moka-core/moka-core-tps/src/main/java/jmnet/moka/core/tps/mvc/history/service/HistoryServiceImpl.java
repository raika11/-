/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.history.dto.HistDTO;
import jmnet.moka.core.tps.mvc.history.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.history.dto.HistSimpleDTO;
import jmnet.moka.core.tps.mvc.page.entity.PageHist;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.skin.entity.SkinHist;
import jmnet.moka.core.tps.mvc.skin.service.SkinService;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;
import jmnet.moka.core.tps.mvc.template.service.TemplateHistService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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
    SkinService skinService;

    @Autowired
    ContainerService containerService;

    @Autowired
    TemplateHistService templateHistService;

    @Override
    public List<HistSimpleDTO> findAllPageHist(HistSearchDTO search) {
        // 히스토리 조회
        org.springframework.data.domain.Page<PageHist> histList = pageService.findAllPageHist(search, search.getPageable());

        // entity -> DTO
        List<HistSimpleDTO> histDTOList = histList.stream()
                                                  .map((hist) -> {
                                                      // History Entity -> History DTO 변환
                                                      HistSimpleDTO histDTO = modelMapper.map(hist, HistSimpleDTO.class);
                                                      histDTO.setRegDt(hist.getRegDt());
                                                      histDTO.setRegId(hist.getRegId());
                                                      return histDTO;
                                                  })
                                                  .collect(Collectors.toList());

        search.setTotal(histList.getTotalElements());

        return histDTOList;
    }

    @Override
    public List<HistSimpleDTO> findAllSkinHist(HistSearchDTO search) {
        // 히스토리 조회
        org.springframework.data.domain.Page<SkinHist> histList = skinService.findAllSkinHist(search, search.getPageable());

        // entity -> DTO
        List<HistSimpleDTO> histDTOList = histList.stream()
                                                  .map((hist) -> {
                                                      // History Entity -> History DTO 변환
                                                      HistSimpleDTO histDTO = modelMapper.map(hist, HistSimpleDTO.class);
                                                      histDTO.setRegDt(hist.getRegDt());
                                                      histDTO.setRegId(hist.getRegId());
                                                      return histDTO;
                                                  })
                                                  .collect(Collectors.toList());

        search.setTotal(histList.getTotalElements());

        return histDTOList;
    }

    @Override
    public List<HistSimpleDTO> findAllContainerHist(HistSearchDTO search) {
        // 히스토리 조회
        org.springframework.data.domain.Page<ContainerHist> histList = containerService.findAllContainerHist(search, search.getPageable());

        // entity -> DTO
        List<HistSimpleDTO> histDTOList = histList.stream()
                                                  .map((hist) -> {
                                                      // History Entity -> History DTO 변환
                                                      HistSimpleDTO histDTO = modelMapper.map(hist, HistSimpleDTO.class);
                                                      histDTO.setRegDt(hist.getRegDt());
                                                      histDTO.setRegId(hist.getRegId());
                                                      return histDTO;
                                                  })
                                                  .collect(Collectors.toList());

        search.setTotal(histList.getTotalElements());

        return histDTOList;
    }

    @Override
    public List<HistSimpleDTO> findAllTemplateHist(HistSearchDTO search) {
        List<String> sort = new ArrayList<String>();
        sort.add("seq,desc");
        search.setSort(sort);
        Pageable pageable = search.getPageable();

        // 히스토리 조회
        org.springframework.data.domain.Page<TemplateHist> histList = templateHistService.findAllTemplateHist(search.getSeq(), search, pageable);

        // entity -> DTO
        List<HistSimpleDTO> histDTOList = histList.stream()
                                                  .map((hist) -> {
                                                      // History Entity -> History DTO 변환
                                                      HistSimpleDTO histDTO = modelMapper.map(hist, HistSimpleDTO.class);
                                                      histDTO.setRegDt(hist.getRegDt());
                                                      histDTO.setRegId(hist.getRegId());
                                                      return histDTO;
                                                  })
                                                  .collect(Collectors.toList());

        search.setTotal(histList.getTotalElements());

        return histDTOList;
    }

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
    public HistDTO findSkinHist(Long histSeq) {
        //        PageHist hist = skinService.findSkinHistBySeq(histSeq)
        //                                   .orElseThrow(() -> new NoDataException(""));
        //
        //        HistDTO histDTO = modelMapper.map(hist, HistDTO.class);
        //        histDTO.setBody(hist.getPageBody());
        //        histDTO.setRegDt(hist.getRegDt());
        //        histDTO.setRegId(hist.getRegId());
        //        return histDTO;
        return null;
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
