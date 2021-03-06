/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.articlepage.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.template.ParsedItemDTO;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.ItemDTO;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageSearchDTO;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePageHist;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePageRel;
import jmnet.moka.core.tps.mvc.articlepage.mapper.ArticlePageRelMapper;
import jmnet.moka.core.tps.mvc.articlepage.repository.ArticlePageHistRepository;
import jmnet.moka.core.tps.mvc.articlepage.repository.ArticlePageRelRepository;
import jmnet.moka.core.tps.mvc.articlepage.repository.ArticlePageRepository;
import jmnet.moka.core.tps.mvc.articlepage.vo.ArticlePageVO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Description: ??????????????? ?????????
 *
 * @author ohtah
 * @since 2020. 11. 14.
 */
@Service
@Slf4j
public class ArticlePageServiceImpl implements ArticlePageService {

    @Autowired
    private ArticlePageRepository articlePageRepository;

    @Autowired
    private ArticlePageHistRepository articlePageHistRepository;

    @Autowired
    private ArticlePageRelRepository articlePageRelRepository;

    @Autowired
    ComponentService componentService;

    @Autowired
    ArticlePageRelMapper articlePageRelMapper;

    @Override
    public Page<ArticlePage> findAllArticlePage(ArticlePageSearchDTO search, Pageable pageable) {
        return articlePageRepository.findList(search, pageable);
    }

    @Override
    public Optional<ArticlePage> findArticlePageBySeq(Long artPageSeq) {
        return articlePageRepository.findById(artPageSeq);
    }

    @Override
    public ArticlePage insertArticlePage(ArticlePage articlePage)
            throws IOException, TemplateParseException {

        // 1. ???????????? ??????
        insertArticlePageRel(articlePage);

        // 2. ?????????
        ArticlePage savePage = articlePageRepository.save(articlePage);

        // 3. ??????????????????
        insertArticlePageHist(savePage, TpsConstants.WORKTYPE_INSERT);

        return savePage;
    }

    @Override
    public List<ArticlePageVO> findAllArticlePageRel(RelationSearchDTO search) {
        return articlePageRelMapper.findAll(search);
    }

    @Override
    public Long countArticlePageRel(RelationSearchDTO search) {
        articlePageRelMapper.findAll(search);
        return search.getTotal();
    }

    @Override
    public int countArticlePageByDomainId(String domainId) {
        return articlePageRepository.countByDomain_DomainId(domainId);
    }

    @Override
    public void updateArticlePageRelItems(Component newComponent, Component orgComponent) {
        // ????????? ????????????
        if (!newComponent
                .getTemplate()
                .getTemplateSeq()
                .equals(orgComponent
                        .getTemplate()
                        .getTemplateSeq())) {
            articlePageRelRepository.updateRelTemplates(newComponent);
        }

        // ???????????? ????????????
        boolean updateDS = false;
        if (!newComponent
                .getDataType()
                .equals(orgComponent.getDataType())) {
            updateDS = true;
        }
        if (newComponent.getDataset() != null && orgComponent.getDataset() != null) {
            if (!newComponent
                    .getDataset()
                    .getDatasetSeq()
                    .equals(orgComponent
                            .getDataset()
                            .getDatasetSeq())) {
                updateDS = true;
            }
        }
        if (newComponent.getDataset() == null && orgComponent.getDataset() != null) {
            updateDS = true;
        }
        if (newComponent.getDataset() != null && orgComponent.getDataset() == null) {
            updateDS = true;
        }


        if (updateDS) {
            // datasetSeq??? ????????? ??????: select -> insert. querydsl?????? insert??? ???????????? ????????? ??????
            if (!newComponent
                    .getDataType()
                    .equals(TpsConstants.DATATYPE_NONE) && orgComponent
                    .getDataType()
                    .equals(TpsConstants.DATATYPE_NONE)) {

                List<ArticlePageRel> relList = articlePageRelRepository.findList(MokaConstants.ITEM_COMPONENT, newComponent.getComponentSeq());

                for (ArticlePageRel rel : relList) {
                    ArticlePageRel newRel = ArticlePageRel
                            .builder()
                            .articlePage(rel.getArticlePage())
                            .domain(rel.getDomain())
                            .relType(MokaConstants.ITEM_DATASET)
                            .relSeq(newComponent
                                    .getDataset()
                                    .getDatasetSeq())
                            .relParentType(MokaConstants.ITEM_COMPONENT)
                            .relParentSeq(newComponent.getComponentSeq())
                            .relOrd(rel.getRelOrd())
                            .build();
                    articlePageRelRepository.save(newRel);
                }
            } else {
                articlePageRelRepository.updateRelDatasets(newComponent, orgComponent);
            }
        }
    }

    @Override
    public Optional<ArticlePageHist> findArticlePageHistBySeq(Long histSeq) {
        return articlePageHistRepository.findById(histSeq);
    }

    @Override
    public ArticlePage updateArticlePage(ArticlePage articlePage)
            throws Exception {
        // 1. ?????? ?????????????????? ?????? ???, ??????
        Map<String, Object> paramMap = new HashMap<>();
        Integer returnValue = TpsConstants.PROCEDURE_SUCCESS;
        paramMap.put("artPageSeq", articlePage.getArtPageSeq());
        paramMap.put("returnValue", returnValue);
        articlePageRelMapper.deleteBySeq(paramMap);
        if ((int) paramMap.get("returnValue") < 0) {
            log.debug("DELETE FAIL PAGE RELATION : {} ", returnValue);
            throw new Exception("Failed to delete ARTICLE PAGE RELATION error code: " + returnValue);
        }
        insertArticlePageRel(articlePage);

        // 2. ??????
        ArticlePage savePage = articlePageRepository.save(articlePage);


        // 3. ??????????????????
        insertArticlePageHist(savePage, TpsConstants.WORKTYPE_UPDATE);

        return savePage;
    }

    @Override
    public void deleteArticlePage(ArticlePage articlePage) {

        insertArticlePageHist(articlePage, TpsConstants.WORKTYPE_DELETE);

        log.info("[DELETE ARTICLE PAGE] domainId : {} artPageSeq : {}", articlePage
                .getDomain()
                .getDomainId(), articlePage.getArtPageSeq());

        // ??????
        articlePageRepository.deleteById(articlePage.getArtPageSeq());
    }

    /**
     * ??????????????? ??????
     *
     * @param articlePage ??????????????? ??????
     * @throws IOException            ???????????????
     * @throws TemplateParseException tems?????? ????????????
     */
    private void insertArticlePageRel(ArticlePage articlePage)
            throws IOException, TemplateParseException {

        List<ParsedItemDTO> parsedItemDTOList = TemplateParserHelper.getItemList(articlePage.getArtPageBody());
        List<ItemDTO> itemDTOList = ResourceMapper
                .getDefaultObjectMapper()
                .convertValue(parsedItemDTOList, new TypeReference<List<ItemDTO>>() {
                });
        for (ItemDTO item : itemDTOList) {
            ArticlePageRel relation = new ArticlePageRel();
            relation.setRelType(item.getNodeName());
            relation.setRelSeq(Long.parseLong(item.getId()));
            relation.setRelParentType(TpsConstants.REL_TYPE_UNKNOWN);
            relation.setRelOrd(item.getOrder());

            // ????????? ???????????? ???????????? ?????????.
            if (articlePage.isEqualRel(relation)) {
                continue;
            } else {
                relation.setArticlePage(articlePage);
                relation.setDomain(articlePage.getDomain());
                // page.addPageRel(relation);
            }

            if (item
                    .getNodeName()
                    .equals(MokaConstants.ITEM_COMPONENT)) {    // ???????????? ????????? ?????????
                // ????????????.
                Optional<Component> component = componentService.findComponentBySeq(Long.parseLong(item.getId()));

                if (component.isPresent()) {

                    // template ????????? ??????
                    ArticlePageRel relationTP = new ArticlePageRel();
                    relationTP.setRelType(MokaConstants.ITEM_TEMPLATE);
                    relationTP.setRelSeq(component
                            .get()
                            .getTemplate()
                            .getTemplateSeq());
                    relationTP.setRelParentType(MokaConstants.ITEM_COMPONENT);
                    relationTP.setRelParentSeq(component
                            .get()
                            .getComponentSeq());
                    relationTP.setRelOrd(item.getOrder());

                    // ????????? ???????????? ???????????? ?????????.
                    if (!articlePage.isEqualRel(relationTP)) {
                        relationTP.setArticlePage(articlePage);
                        relationTP.setDomain(articlePage.getDomain());
                        // page.addPageRel(relationTP);
                    }

                    // data ????????? ??????
                    if (component
                            .get()
                            .getDataset() != null) {
                        ArticlePageRel relatioDS = new ArticlePageRel();
                        relatioDS.setRelType(MokaConstants.ITEM_DATASET);
                        relatioDS.setRelSeq(component
                                .get()
                                .getDataset()
                                .getDatasetSeq());
                        relatioDS.setRelParentType(MokaConstants.ITEM_COMPONENT);
                        relatioDS.setRelParentSeq(component
                                .get()
                                .getComponentSeq());
                        relatioDS.setRelOrd(item.getOrder());

                        if (!articlePage.isEqualRel(relatioDS)) {
                            relatioDS.setArticlePage(articlePage);
                            relatioDS.setDomain(articlePage.getDomain());
                            // page.addPageRel(relatioDS);
                        }
                    }

                }
            }
        }
    }

    /**
     * ??????????????? ????????????.
     *
     * @param savePage ????????? ???????????????
     * @param workType ????????????
     */
    private void insertArticlePageHist(ArticlePage savePage, String workType) {
        ArticlePageHist hist = new ArticlePageHist();
        hist.setArticlePage(savePage);
        hist.setDomain(savePage.getDomain());
        hist.setArtPageBody(savePage.getArtPageBody());
        hist.setWorkType(workType);

        //        if (workType.equals(TpsConstants.WORKTYPE_INSERT)) {
        //            hist.setRegDt(savePage.getRegDt());
        //            hist.setRegId(savePage.getRegId());
        //        } else if (workType.equals(TpsConstants.WORKTYPE_UPDATE)) {
        //            hist.setRegDt(savePage.getModDt());
        //            hist.setRegId(savePage.getModId());
        //        } else if (workType.equals(TpsConstants.WORKTYPE_DELETE)) {
        //            hist.setRegDt(McpDate.now());
        //            hist.setRegId(userName);
        //        }

        articlePageHistRepository.save(hist);
    }

    @Override
    public boolean existArtTypes(String domainId, String artTypes, Long artPageSeq) {
        return articlePageRepository.countByArtTypes(domainId, artTypes, artPageSeq) > 0;
    }

    @Override
    public ArticlePage findByArticePage(String artType, String domainId) {
        List<ArticlePage> pageList = articlePageRepository.findByDomainDomainIdAndArtType(domainId, artType);
        ArticlePage returnPage = null;
        if (pageList.size() > 0) {
            for (ArticlePage page : pageList) {
                String[] artTypeList = page
                        .getArtTypes()
                        .split(",");
                long count = Arrays
                        .stream(artTypeList)
                        .filter(t -> t.equals(artType))
                        .count();
                if (count > 0) {
                    return page;
                }
            }

            return pageList.get(0);
        }

        return returnPage;
    }
}
