/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.merge.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tms.merge.MokaPreviewTemplateMerger;
import jmnet.moka.core.tms.merge.item.ArticlePageItem;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.ContainerItem;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.PackageDivCode;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.config.PreviewConfiguration;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.article.vo.ArticleReporterVO;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageDTO;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import jmnet.moka.core.tps.mvc.articlepage.service.ArticlePageService;
import jmnet.moka.core.tps.mvc.code.entity.Mastercode;
import jmnet.moka.core.tps.mvc.code.service.CodeService;
import jmnet.moka.core.tps.mvc.container.dto.ContainerDTO;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.desking.mapper.ComponentWorkMapper;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistCompDTO;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.rcvarticle.dto.RcvArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.rcvarticle.vo.RcvArticleReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.stereotype.Service;

/**
 * Description: merge????????? impl
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

    @Autowired
    private CodeService codeService;

    @Autowired
    private ArticleService articleService;

    @Value("${package.issue.home.url}")
    private String issueHomeUrl;
    @Value("${package.series.home.url}")
    private String seriesHomeUrl;
    @Value("${package.topic.home.url}")
    private String topicHomeUrl;
    @Value("${package.compYn}")
    private String packageCompYn;

    @Override
    public String getMergePage(PageDTO pageDto)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        return getMergePage(pageDto, true);
    }

    @Override
    public String getMergePage(PageDTO pageDto, boolean baseTag)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // ?????????
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

        // ?????????
        PageItem pageItem = pageDto.toPageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_TEMPLATE_MERGER, domainItem);

        // ?????????
        StringBuilder sb = dtm.merge(pageItem, null, true, false, true, baseTag);

        String content = sb.toString();

        return content;
    }

    @Override
    public String getMergePageWork(Long pageSeq, Long areaSeq, String regId, String pageType)
            throws TemplateParseException, DataLoadException, TemplateMergeException, NoDataException {
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);

        // 1. ??????????????????
        Area area = areaService
                .findAreaBySeq(areaSeq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // ?????????
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

        // ?????????
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

        String content = "";
        // ??????????????? ??????????????? ?????? ??????
        if (area
                .getAreaDiv()
                .equals(MokaConstants.ITEM_CONTAINER)) {

            // ???????????? ??????
            ContainerItem containerItem = getContainerItem(area);

            // ?????????????????? ?????????????????? ?????? ??????
            List<String> componentIdList = new ArrayList<String>();
            getComponentItem(areaSeq, regId, componentIdList);

            // merger
            MokaPreviewTemplateMerger dtm =
                    (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_WORK_TEMPLATE_MERGER, domainItem, regId,
                            componentIdList);

            // ?????????
            StringBuilder sb = dtm.merge(pageItem, containerItem, true, false, false, true);
            content = sb.toString();

        } else {
            // ?????????????????? ?????? ??????
            List<String> componentIdList = new ArrayList<String>();
            ComponentItem componentItem = getComponentItem(areaSeq, regId, componentIdList);

            // merger
            MokaPreviewTemplateMerger dtm =
                    (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_WORK_TEMPLATE_MERGER, domainItem, regId,
                            componentIdList);

            // ?????????
            StringBuilder sb = dtm.merge(pageItem, componentItem, true, false, false, true);
            content = sb.toString();
        }

        return content;
    }

    @Override
    public String getMergeComponentWork(Long areaSeq, Long componentWorkSeq, String resourceYn, String regId)
            throws Exception {
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        try {
            // 1. ??????????????????
            Area area = areaService
                    .findAreaBySeq(areaSeq)
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        tpsLogger.fail(message, true);
                        return new NoDataException(message);
                    });

            // ?????????
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

            // ?????????
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

            // ???????????? : work ????????????????????? ?????? ???????????? ?????????.
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
                    (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_WORK_TEMPLATE_MERGER, domainItem, regId,
                            componentIdList);

            // ?????????
            StringBuilder sb = dtm.merge(pageItem, componentItem, false, false, false, true);
            String content = sb.toString();

            // ???????????? ????????? ??????
            String previewRsrc = area.getPreviewRsrc();
            if (McpString.isNotEmpty(previewRsrc) && resourceYn.equals(MokaConstants.YES)) {
                content = dtm.mergePreviewResource(area.getPreviewRsrc(), content);
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

            // 1. ??????????????????
            Area area = areaService
                    .findAreaBySeq(areaSeq)
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        tpsLogger.fail(message, true);
                        return new NoDataException(message);
                    });

            // ?????????
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

            // ?????????
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
            // ??????????????? ??????????????? ?????? ??????
            if (area
                    .getAreaDiv()
                    .equals(MokaConstants.ITEM_CONTAINER)) {

                // ???????????? ??????
                ContainerItem containerItem = getContainerItem(area);

                // ?????????????????? ?????????????????? ?????? ??????
                List<String> componentIdList = new ArrayList<String>();
                getComponentItem(areaSeq, regId, componentIdList);

                // merger
                MokaPreviewTemplateMerger dtm =
                        (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_WORK_TEMPLATE_MERGER, domainItem, regId,
                                componentIdList);

                // ?????????
                StringBuilder sb = dtm.merge(pageItem, containerItem, false, false, false, true);
                content = sb.toString();

                // ???????????? ????????? ??????
                String previewRsrc = area.getPreviewRsrc();
                if (McpString.isNotEmpty(previewRsrc)) {
                    content = dtm.mergePreviewResource(area.getPreviewRsrc(), content);
                }

            } else {
                // ?????????????????? ?????? ??????
                List<String> componentIdList = new ArrayList<String>();
                ComponentItem componentItem = getComponentItem(areaSeq, regId, componentIdList);

                // merger
                MokaPreviewTemplateMerger dtm =
                        (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_WORK_TEMPLATE_MERGER, domainItem, regId,
                                componentIdList);

                // ?????????
                StringBuilder sb = dtm.merge(pageItem, componentItem, false, false, false, true);
                content = sb.toString();

                // ???????????? ????????? ??????
                String previewRsrc = area.getPreviewRsrc();
                if (McpString.isNotEmpty(previewRsrc)) {
                    content = dtm.mergePreviewResource(area.getPreviewRsrc(), content);
                }
            }

            return content;

        } catch (Exception e) {
            log.error("[FAIL TO MERGE] areaSeq: {} {}", areaSeq, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.area"), e);
        }
    }

    // ???????????? ?????? ??????
    private ContainerItem getContainerItem(Area area)
            throws NoDataException {
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
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
        return containerItem;
    }

    // ?????????????????? ?????????????????? ?????? ??????
    private ComponentItem getComponentItem(Long areaSeq, String regId, List<String> componentIdList) {
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        Map paramMap = new HashMap();
        paramMap.put("areaSeq", areaSeq);
        paramMap.put("regId", regId);
        List<ComponentWorkVO> componentWorkVOList = componentWorkMapper.findComponentWorkByArea(paramMap);
        ComponentItem componentItem = null;

        for (ComponentWorkVO workVo : componentWorkVOList) {
            componentIdList.add(workVo
                    .getComponentSeq()
                    .toString());
            componentItem = workVo.toComponentItem();
            componentItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                    .now()
                    .format(df));
        }

        return componentItem;
    }

    @Override
    public String getMergeArticlePage(ArticlePageDTO articlePageDto, Long totalId)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // ?????????
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

        // ??????????????????
        ArticlePageItem articlePageItem = articlePageDto.toArticlePageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        articlePageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_TEMPLATE_MERGER, domainItem);

        // ?????????
        StringBuilder sb = dtm.merge(articlePageItem, totalId);

        String content = sb.toString();

        return content;
    }

    @Override
    public String getMergeRcvArticle(Long rid, RcvArticleBasicUpdateDTO updateDto, String domainId)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // ?????????
        Domain domainInfo = domainService
                .findDomainById(domainId)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // ??????????????? ?????? ??????(?????????????????? ??????)
        ArticlePage articlePage = articlePageService.findByArticePage(TpsConstants.DEFAULT_ART_TYPE, domainId);
        if (articlePage == null) {
            String message = messageByLocale.get("tps.common.error.no-data");
            tpsLogger.fail(message, true);
            throw new NoDataException(message);
        }
        ArticlePageDTO articlePageDto = modelMapper.map(articlePage, ArticlePageDTO.class);

        ArticlePageItem articlePageItem = articlePageDto.toArticlePageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        articlePageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        //???????????? ?????? ??????
        List<Map<String, Object>> categoryList = this.reBuildCategory(rid, updateDto.getCategoryList());

        // ???????????? ??????
        List<Map<String, Object>> reporterList = this.reBuildRcvReporter(updateDto.getReporterList());

        // ???????????? ??????
        List<Map<String, Object>> tagList = this.reBuildTag(rid, updateDto.getTagList());

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_TEMPLATE_MERGER, domainItem);

        // ?????????
        StringBuilder sb = dtm.mergeRcv(articlePageItem, rid, categoryList, reporterList, tagList);

        String content = sb.toString();

        return content;
    }

    @Override
    public String getMergeUpdateArticle(Long totalId, ArticleBasicUpdateDTO updateDto, String domainId, String artType)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // ?????????
        Domain domainInfo = domainService
                .findDomainById(domainId)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // ??????????????? ?????? ??????
        ArticlePage articlePage = articlePageService.findByArticePage(artType, domainId);
        if (articlePage == null) {
            articlePage = articlePageService.findByArticePage(TpsConstants.DEFAULT_ART_TYPE, domainId);
            if (articlePage == null) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(message, true);
                throw new NoDataException(message);
            }
        }
        ArticlePageDTO articlePageDto = modelMapper.map(articlePage, ArticlePageDTO.class);

        ArticlePageItem articlePageItem = articlePageDto.toArticlePageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        articlePageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        //???????????? ?????? ??????
        List<Map<String, Object>> categoryList = this.reBuildCategory(totalId, updateDto.getCategoryList());

        // ???????????? ??????
        List<Map<String, Object>> reporterList = this.reBuildReporter(updateDto.getReporterList());

        // ???????????? ??????
        List<Map<String, Object>> tagList = this.reBuildTag(totalId, updateDto.getTagList());

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_TEMPLATE_MERGER, domainItem);

        // ?????????
        StringBuilder sb =
                dtm.mergeArticle(articlePageItem, totalId, categoryList, reporterList, tagList, updateDto.getArtTitle(), updateDto.getArtSubTitle(),
                        updateDto
                                .getArtContent()
                                .getArtContent());

        String content = sb.toString();

        return content;
    }

    private List<Map<String, Object>> reBuildTag(Long totalId, List<String> tagList) {
        List<Map<String, Object>> retList = new ArrayList<>();
        int sortNo = 1;
        for (String tag : tagList) {
            Map map = new HashMap();
            map.put("TOTAL_ID", totalId);
            map.put("KEYWORD", tag);
            map.put("SORT_NO", sortNo);
            sortNo++;
            retList.add(map);
        }
        return retList;
    }

    private List<Map<String, Object>> reBuildRcvReporter(List<RcvArticleReporterVO> reporterList) {
        List<Map<String, Object>> retList = new ArrayList<>();
        for (RcvArticleReporterVO vo : reporterList) {
            Map map = new HashMap();
            map.put("REP_EMAIL1", vo.getReporterEmail());
            //            map.put("REP_PHOTO", vo.getRepPhoto());
            //            map.put("JPLUS_JOB_INFO", vo.getJplusJobInfo());
            //            map.put("REP_SEQ", vo.getRepSeq());
            map.put("REP_NAME", vo.getReporterName());
            //            map.put("REP_TALK", vo.getRepTalk());
            //            map.put("JPLUS_REP_DIV", vo.getJplusRepDiv());
            //            map.put("CMP_NM", vo.getCmpNm());
            retList.add(map);
        }
        return retList;
    }

    private List<Map<String, Object>> reBuildReporter(List<ArticleReporterVO> reporterList) {
        List<Map<String, Object>> retList = new ArrayList<>();
        for (ArticleReporterVO vo : reporterList) {
            Map map = new HashMap();
            map.put("REP_EMAIL1", vo.getRepEmail1());
            map.put("REP_PHOTO", vo.getRepPhoto());
            map.put("JPLUS_JOB_INFO", vo.getJplusJobInfo());
            map.put("REP_SEQ", vo.getRepSeq());
            map.put("REP_NAME", vo.getRepName());
            map.put("REP_TALK", vo.getRepTalk());
            map.put("JPLUS_REP_DIV", vo.getJplusRepDiv());
            map.put("CMP_NM", vo.getCmpNm());
            retList.add(map);
        }
        return retList;
    }

    private List<Map<String, Object>> reBuildCategory(Long totalId, List<String> categoryList) {

        List<Mastercode> materCodeList = codeService.findAllCode();

        List<Map<String, Object>> retList = new ArrayList<>();
        for (String category : categoryList) {
            Mastercode matercode = materCodeList
                    .stream()
                    .filter(code -> code
                            .getMasterCode()
                            .equals(category))
                    .findFirst()
                    .get();
            Map map = new HashMap();
            map.put("TOTAL_ID", totalId);
            map.put("MASTER_CODE", category);
            map.put("MASTER_PATH", String.join(",", matercode.getServiceKorname(), McpString.defaultValue(matercode.getSectionKorname(), "??????"),
                    McpString.defaultValue(matercode.getContentKorname(), "??????")));
            map.put("SERVICE_KORNAME", matercode.getServiceKorname());
            map.put("SECTION_KORNAME", McpString.defaultValue(matercode.getSectionKorname(), "??????"));
            map.put("CONTENT_KORNAME", McpString.defaultValue(matercode.getContentKorname(), "??????"));
            map.put("SERVICE_CODE", matercode.getServiceCode());
            map.put("SERVICE_PATH", String.join(",", matercode.getFrstKorNm(), McpString.defaultValue(matercode.getScndKorNm(), "??????")));
            map.put("FRST_CODE", matercode.getFrstCode());
            map.put("SCND_CODE", matercode.getScndCode());
            map.put("FRST_KOR_NM", matercode.getFrstKorNm());
            map.put("SCND_KOR_NM", McpString.defaultValue(matercode.getScndKorNm(), "??????"));
            retList.add(map);
        }
        return retList;
    }

    @Override
    public String getMergeArticle(Long totalId, String domainId, String artType)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // ?????????Id??????
        Domain domainInfo = domainService
                .findDomainById(domainId)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // ??????????????? ?????? ??????
        ArticlePage articlePage = articlePageService.findByArticePage(artType, domainId);
        if (articlePage == null) {
            articlePage = articlePageService.findByArticePage(TpsConstants.DEFAULT_ART_TYPE, domainId);
            if (articlePage == null) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(message, true);
                throw new NoDataException(message);
            }
        }
        ArticlePageDTO articlePageDto = modelMapper.map(articlePage, ArticlePageDTO.class);

        ArticlePageItem articlePageItem = articlePageDto.toArticlePageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        articlePageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_TEMPLATE_MERGER, domainItem);

        // ?????????
        StringBuilder sb = dtm.merge(articlePageItem, totalId);

        String content = sb.toString();

        return content;
    }

    @Override
    public String getMergeArticle(Long totalId, String domainId)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // ?????????Id??????
        Domain domainInfo = domainService
                .findDomainById(domainId)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // ??????????????????
        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // ??????????????? ?????? ??????
        ArticlePage articlePage = articlePageService.findByArticePage(articleBasic.getArtType(), domainId);
        if (articlePage == null) {
            articlePage = articlePageService.findByArticePage(TpsConstants.DEFAULT_ART_TYPE, domainId);
            if (articlePage == null) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(message, true);
                throw new NoDataException(message);
            }
        }
        ArticlePageDTO articlePageDto = modelMapper.map(articlePage, ArticlePageDTO.class);

        ArticlePageItem articlePageItem = articlePageDto.toArticlePageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        articlePageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_TEMPLATE_MERGER, domainItem);

        // ?????????
        StringBuilder sb = dtm.merge(articlePageItem, totalId);

        String content = sb.toString();

        return content;
    }

    @Override
    public String getMergeIssue(String domainId, PackageMaster packageMaster, List<IssueDeskingHistCompDTO> deskingDTOList)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException {
        // ?????????Id??????
        Domain domainInfo = domainService
                .findDomainById(domainId)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });
        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
        DomainItem domainItem = domainDto.toDomainItem();

        // pageItem ??????
        String homeUrl = this.issueHomeUrl;
        if (packageMaster
                .getPkgDiv()
                .equals(PackageDivCode.SERIES.getCode())) {
            homeUrl = this.seriesHomeUrl;
        } else if (packageMaster
                .getPkgDiv()
                .equals(PackageDivCode.TOPIC.getCode())) {
            homeUrl = topicHomeUrl;
        }
        Page pageInfo = pageService
                .findPageByPageUrl(homeUrl, domainId)
                .stream()
                .findFirst()
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        PageDTO pageDto = modelMapper.map(pageInfo, PageDTO.class);
        PageItem pageItem = pageDto.toPageItem();
        DateTimeFormatter df = DateTimeFormatter.ofPattern(MokaConstants.JSON_DATE_FORMAT);
        pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime
                .now()
                .format(df));

        // ???????????? ??????
        String compYn = "";
        List<Map<String, Object>> deskingList = new LinkedList<>();
        for (IssueDeskingHistCompDTO dto : deskingDTOList) {
            if (dto.getIssueDeskings() != null && dto
                    .getIssueDeskings()
                    .size() > 0) {
                List<Map<String, Object>> list = toListMap(dto.getIssueDeskings());
                deskingList.addAll(list);
            }
            compYn = compYn + dto.getViewYn();
        }
        if (compYn.length() == 0) {
            compYn = packageCompYn;
        }

        MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean(PreviewConfiguration.PREVIEW_TEMPLATE_MERGER, domainItem);

        // ?????????
        StringBuilder sb = dtm.mergeIssue(pageItem, packageMaster.getPkgSeq(), compYn, deskingList);

        String content = sb.toString();

        return content;
    }

    private List<Map<String, Object>> toListMap(List<IssueDeskingHistDTO> issueDeskings) {
        List<Map<String, Object>> returnList = new ArrayList<>();
        for (IssueDeskingHistDTO dto : issueDeskings) {
            //            Map<String, Object> map = ResourceMapper
            //                    .getDefaultObjectMapper()
            //                    .convertValue(dto, Map.class);
            returnList.add(dto.toItem());
        }
        return returnList;
    }



}
