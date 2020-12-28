/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.merge.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tms.merge.MokaPreviewTemplateMerger;
import jmnet.moka.core.tms.merge.item.ArticlePageItem;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.ContainerItem;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageDTO;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import jmnet.moka.core.tps.mvc.articlepage.service.ArticlePageService;
import jmnet.moka.core.tps.mvc.container.dto.ContainerDTO;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.desking.mapper.ComponentWorkMapper;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicUpdateDTO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.stereotype.Service;

/**
 * Description: merge서비스 impl
 *
 * @author ssc
 * @since 2020-12-03
 */
@Service
@Slf4j
public class MergeServiceImpl implements MergeService {
    @Autowired
    private DomainService domainService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private PageService pageService;

    @Autowired
    private AreaService areaService;

    @Autowired
    private ComponentWorkMapper componentWorkMapper;

    @Autowired
    private ContainerService containerService;

    @Autowired
    private GenericApplicationContext appContext;

    @Autowired
    private TpsLogger tpsLogger;

    @Autowired
    private ArticlePageService articlePageService;


    @Override
    public String getMergePage(PageDTO pageDto)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        return getMergePage(pageDto, true);
    }

    @Override
    public String getMergePage(PageDTO pageDto, boolean baseTag)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // 도메인
        Domain domainInfo = domainService
                .findDomainById(pageDto
                        .getDomain()
                        .getDomainId())
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // 페이지
        PageItem pageItem = pageDto.toPageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean("previewTemplateMerger", domainItem);

        // 랜더링
        StringBuilder sb = dtm.merge(pageItem, null, true, false, true, baseTag);

        String content = sb.toString();

        return content;
    }

    @Override
    public String getMergePageWork(Long pageSeq, String regId, String pageType)
            throws TemplateParseException, DataLoadException, TemplateMergeException, NoDataException {
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);

        // 페이지
        Page pageInfo = pageService
                .findPageBySeq(pageSeq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });
        PageDTO pageDto = modelMapper.map(pageInfo, PageDTO.class);
        PageItem pageItem = pageDto.toPageItem();
        pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        // 도메인
        Domain domainInfo = domainService
                .findDomainById(pageDto
                        .getDomain()
                        .getDomainId())
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // merger
        MokaPreviewTemplateMerger dtm =
                (MokaPreviewTemplateMerger) appContext.getBean("previewWorkTemplateMerger", domainItem, regId, new ArrayList<String>());

        // 랜더링
        StringBuilder sb = dtm.merge(pageItem, null, true);

        String content = sb.toString();
        pageType = pageDto.getPageType();

        return content;
    }

    @Override
    public String getMergeComponentWork(Long areaSeq, Long componentWorkSeq, String resourceYn, String regId)
            throws Exception {
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        try {
            // 1. 편집영역조회
            Area area = areaService
                    .findAreaBySeq(areaSeq)
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        tpsLogger.fail(message, true);
                        return new NoDataException(message);
                    });

            // 페이지
            Page pageInfo = pageService
                    .findPageBySeq(area
                            .getPage()
                            .getPageSeq())
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        tpsLogger.fail(ActionType.SELECT, message, true);
                        return new NoDataException(message);
                    });

            PageDTO pageDto = modelMapper.map(pageInfo, PageDTO.class);
            PageItem pageItem = pageDto.toPageItem();
            pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                    .now()
                    .format(df));

            // 도메인
            Domain domainInfo = domainService
                    .findDomainById(area
                            .getDomain()
                            .getDomainId())
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        tpsLogger.fail(ActionType.SELECT, message, true);
                        return new NoDataException(message);
                    });
            DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
            DomainItem domainItem = domainDto.toDomainItem();

            // 컴포넌트 : work 컴포넌트정보를 모두 보내지는 않는다.
            ComponentWorkVO componentVO = componentWorkMapper.findComponentWorkBySeq(componentWorkSeq);
            if (componentVO == null) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(ActionType.SELECT, message, true);
                throw new NoDataException(message);
            }
            ComponentItem componentItem = componentVO.toComponentItem();
            componentItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                    .now()
                    .format(df));

            List<String> componentIdList = new ArrayList<String>(1);
            componentIdList.add(componentVO
                    .getComponentSeq()
                    .toString());

            // merger
            MokaPreviewTemplateMerger dtm =
                    (MokaPreviewTemplateMerger) appContext.getBean("previewWorkTemplateMerger", domainItem, regId, componentIdList);

            // 랜더링
            StringBuilder sb = dtm.merge(pageItem, componentItem, false, false, false, true);

            String content = sb.toString();

            // 미리보기 리소스 추가
            if (content.length() > 0 && resourceYn.equals(MokaConstants.YES)) {
                content = area.getPreviewRsrc() + content;
            }

            return content;

        } catch (Exception e) {
            log.error("[FAIL TO MERGE] componentWorkSeq: {} {}", componentWorkSeq, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.component"), e);
        }
    }

    @Override
    public String getMergeAreaWork(Long areaSeq, String regId)
            throws Exception {
        try {
            DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

            // 1. 편집영역조회
            Area area = areaService
                    .findAreaBySeq(areaSeq)
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        tpsLogger.fail(message, true);
                        return new NoDataException(message);
                    });

            // 페이지
            Page pageInfo = pageService
                    .findPageBySeq(area
                            .getPage()
                            .getPageSeq())
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        tpsLogger.fail(ActionType.SELECT, message, true);
                        return new NoDataException(message);
                    });

            PageDTO pageDto = modelMapper.map(pageInfo, PageDTO.class);
            PageItem pageItem = pageDto.toPageItem();
            pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                    .now()
                    .format(df));

            // 도메인
            Domain domainInfo = domainService
                    .findDomainById(area
                            .getDomain()
                            .getDomainId())
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        tpsLogger.fail(ActionType.SELECT, message, true);
                        return new NoDataException(message);
                    });
            DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
            DomainItem domainItem = domainDto.toDomainItem();

            String content = "";
            // 편집영역이 컨테이너인 경우 머지
            if (area
                    .getAreaDiv()
                    .equals(MokaConstants.ITEM_CONTAINER)) {
                // 컨테이너 조회
                Long containerSeq = area
                        .getContainer()
                        .getContainerSeq();
                Container container = containerService
                        .findContainerBySeq(containerSeq)
                        .orElseThrow(() -> {
                            String message = messageByLocale.get("tps.common.error.no-data");
                            tpsLogger.fail(ActionType.SELECT, message, true);
                            return new NoDataException(message);
                        });
                ContainerDTO dto = modelMapper.map(container, ContainerDTO.class);
                ContainerItem containerItem = dto.toContainerItem();
                containerItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                        .now()
                        .format(df));

                // 컨테이너안의 작업컴포넌트 목록 조회
                Map paramMap = new HashMap();
                paramMap.put("areaSeq", areaSeq);
                paramMap.put("regId", regId);
                List<ComponentWorkVO> componentWorkVOList = componentWorkMapper.findComponentWorkByArea(paramMap);
                List<String> componentIdList = new ArrayList<String>();

                for (ComponentWorkVO workVo : componentWorkVOList) {
                    componentIdList.add(workVo
                            .getComponentSeq()
                            .toString());
                }

                // merger
                MokaPreviewTemplateMerger dtm =
                        (MokaPreviewTemplateMerger) appContext.getBean("previewWorkTemplateMerger", domainItem, regId, componentIdList);

                // 랜더링
                StringBuilder sb = dtm.merge(pageItem, containerItem, false, false, false, true);

                content = sb.toString();

                // 미리보기 리소스 추가
                if (content.length() > 0) {
                    content = area.getPreviewRsrc() + content;
                }

            } else {
                // 작업컴포넌트 목록 조회
                Map paramMap = new HashMap();
                paramMap.put("areaSeq", areaSeq);
                paramMap.put("regId", regId);
                List<ComponentWorkVO> componentWorkVOList = componentWorkMapper.findComponentWorkByArea(paramMap);
                List<String> componentIdList = new ArrayList<String>();
                ComponentItem componentItem = null;

                if (componentWorkVOList.size() > 0) {
                    for (ComponentWorkVO workVo : componentWorkVOList) {
                        componentIdList.add(workVo
                                .getComponentSeq()
                                .toString());
                        componentItem = workVo.toComponentItem();
                    }

                    componentItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                            .now()
                            .format(df));

                    // merger
                    MokaPreviewTemplateMerger dtm =
                            (MokaPreviewTemplateMerger) appContext.getBean("previewWorkTemplateMerger", domainItem, regId, componentIdList);

                    // 랜더링
                    StringBuilder sb = dtm.merge(pageItem, componentItem, false, false, false, true);

                    content = sb.toString();

                    // 미리보기 리소스 추가
                    if (content.length() > 0) {
                        content = area.getPreviewRsrc() + content;
                    }
                }
            }

            return content;

        } catch (Exception e) {
            log.error("[FAIL TO MERGE] areaSeq: {} {}", areaSeq, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.area"), e);
        }
    }

    @Override
    public String getMergeArticlePage(ArticlePageDTO articlePageDto, Long totalId)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // 도메인
        Domain domainInfo = domainService
                .findDomainById(articlePageDto
                        .getDomain()
                        .getDomainId())
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // 기사사페이지
        ArticlePageItem articlePageItem = articlePageDto.toArticlePageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        articlePageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean("previewTemplateMerger", domainItem);

        // 랜더링
        StringBuilder sb = dtm.merge(articlePageItem, totalId);

        String content = sb.toString();

        return content;
    }

    @Override
    public String getMergeArticlePageWithRcv(Long rid, RcvArticleBasicUpdateDTO updateDto, String domainType)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // 도메인Id조회
        Domain domainInfo = domainService.findByServiceFlatform(domainType);
        String domainId = domainInfo != null ? domainInfo.getDomainId() : null;
        if (domainInfo == null) {
            String message = messageByLocale.get("tps.common.error.no-data");
            tpsLogger.fail(message, true);
            throw new NoDataException(message);
        }
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // 기사페이지 정보 조회(기본타입으로 조회)
        ArticlePage articlePage = articlePageService.findByArticePageByArtType(domainId, TpsConstants.DEFAULT_ART_TYPE);
        if (articlePage == null) {
            String message = messageByLocale.get("tps.common.error.no-data");
            tpsLogger.fail(message, true);
            throw new NoDataException(message);
        }
        ArticlePageDTO articlePageDto = modelMapper.map(articlePage, ArticlePageDTO.class);

        // 기사사페이지
        ArticlePageItem articlePageItem = articlePageDto.toArticlePageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        articlePageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        // 기자정보 변환
        List<Map<String, Object>> reporterList = modelMapper.map(updateDto.getReporterList(), new TypeReference<List<Map<String, Object>>>() {
        }.getType());

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean("previewTemplateMerger", domainItem);

        // 랜더링
        StringBuilder sb = dtm.mergeRcv(articlePageItem, rid, updateDto.getCategoryList(), reporterList, updateDto.getTagList());

        String content = sb.toString();

        return content;
    }
}
