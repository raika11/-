/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.relation.service;

import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.ad.service.AdService;
import jmnet.moka.core.tps.mvc.articlepage.service.ArticlePageService;
import jmnet.moka.core.tps.mvc.articlepage.vo.ArticlePageVO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import jmnet.moka.core.tps.mvc.reserved.service.ReservedService;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-10-29
 */
@Service
@Slf4j
public class RelationServiceImpl implements RelationService {
    @Autowired
    PageService pageService;

    @Autowired
    ArticlePageService articlePageService;

    @Autowired
    ContainerService containerService;

    @Autowired
    ComponentService componentService;

    @Autowired
    TemplateService templateService;

    @Autowired
    AdService adService;

    @Autowired
    ReservedService reservedService;


    @Override
    public List<PageVO> findAllPage(RelationSearchDTO search) {
        return pageService.findAllPageRel(search);
    }

    @Override
    public List<ArticlePageVO> findAllArticlePage(RelationSearchDTO search) {
        return articlePageService.findAllArticlePageRel(search);
    }

    @Override
    public Page<Container> findAllContainer(RelationSearchDTO search, Pageable pageable) {
        return containerService.findAllContainerRel(search, pageable);
    }

    @Override
    public Page<Component> findAllComponent(RelationSearchDTO search, Pageable pageable) {
        return componentService.findAllComponentRel(search, pageable);
    }
    //    public List<ComponentVO> findAllComponent(RelationSearchDTO search) {
    //        String itemType = search.getRelSeqType();
    //        if (itemType.equals(MokaConstants.ITEM_TEMPLATE) || itemType.equals(MokaConstants.ITEM_DATASET)) {
    //            search.setDefaultSort("componentSeq,desc");
    //            Pageable pageable = search.getPageable();
    //            Page<Component> cpList = componentService.findAllComponentRel(search, pageable);
    //            List<ComponentVO> retList = new ArrayList<ComponentVO>();
    //            Integer relOrd = 0;
    //            for(Component cp: cpList) {
    //                ComponentVO vo = ComponentVO.builder()
    //                    .componentSeq(cp.getComponentSeq())
    //                    .componentName(cp.getComponentName())
    //                    .templateGroupName(cp.getTemplate().getTemplateGroupName())
    ////                    .useYn(MokaConstants.YES)
    //                    .templateSeq(cp.getTemplate().getTemplateSeq())
    //                    .relOrd(relOrd)
    //                    .build();
    //                retList.add(vo);
    //            }
    //            search.setTotal((long) retList.size());
    //            return retList;
    //        } else {
    //            String searchType;
    //            switch (search.getRelSeqType()) {
    //                case MokaConstants.ITEM_PAGE: searchType = "pageSeq"; break;
    //                case MokaConstants.ITEM_CONTENT_SKIN: searchType = "skinSeq"; break;
    //                case MokaConstants.ITEM_CONTAINER: searchType = "containerSeq"; break;
    //                default: searchType = "pageSeq";
    //            }
    //            ComponentSearchDTO cpSearch = ComponentSearchDTO.builder().searchType(searchType).keyword(search.getRelSeq().toString()).build();
    //            return componentService.findAllComponent(cpSearch);
    //        }
    //    }

    @Override
    public Boolean hasRelations(Long seq, String itemType) {

        if (itemType.equals(MokaConstants.ITEM_TEMPLATE) || itemType.equals(MokaConstants.ITEM_DATASET)) {

            // 관련 컴포넌트가 있는지 확인한다
            RelationSearchDTO search = RelationSearchDTO.builder()
                                                        .relSeq(seq)
                                                        .relSeqType(itemType)
                                                        .relType(MokaConstants.ITEM_COMPONENT)
                                                        .build();
            if (this.isRelated(search)) {
                return true;
            }
        }

        if (itemType.equals(MokaConstants.ITEM_TEMPLATE) || itemType.equals(MokaConstants.ITEM_DATASET) || itemType.equals(
                MokaConstants.ITEM_COMPONENT) || itemType.equals(MokaConstants.ITEM_AD)) {

            // 관련 컨테이너가 있는지 확인한다
            RelationSearchDTO search = RelationSearchDTO.builder()
                                                        .relSeq(seq)
                                                        .relSeqType(itemType)
                                                        .relType(MokaConstants.ITEM_CONTAINER)
                                                        .build();
            if (this.isRelated(search)) {
                return true;
            }
        }

        if (itemType.equals(MokaConstants.ITEM_TEMPLATE) || itemType.equals(MokaConstants.ITEM_DATASET) || itemType.equals(
                MokaConstants.ITEM_COMPONENT) || itemType.equals(MokaConstants.ITEM_AD) || itemType.equals(MokaConstants.ITEM_CONTAINER)) {

            // 관련 본문스킨이 있는지 확인한다
            RelationSearchDTO search = RelationSearchDTO.builder()
                                                        .relSeq(seq)
                                                        .relSeqType(itemType)
                                                        .relType(MokaConstants.ITEM_ARTICLE_PAGE)
                                                        .build();
            if (this.isRelated(search)) {
                return true;
            }
        }

        if (itemType.equals(MokaConstants.ITEM_TEMPLATE) || itemType.equals(MokaConstants.ITEM_DATASET) || itemType.equals(
                MokaConstants.ITEM_COMPONENT) || itemType.equals(MokaConstants.ITEM_AD) || itemType.equals(MokaConstants.ITEM_CONTAINER)) {

            // 관련 페이지가 있는지 확인한다
            RelationSearchDTO search = RelationSearchDTO.builder()
                                                        .relSeq(seq)
                                                        .relSeqType(itemType)
                                                        .relType(MokaConstants.ITEM_PAGE)
                                                        .build();
            if (this.isRelated(search)) {
                return true;
            }
        }

        return false;
    }

    public boolean isRelated(RelationSearchDTO search) {
        String relType = search.getRelType();

        if (relType.equals(MokaConstants.ITEM_PAGE)) {

            // 페이지 목록 조회
            search.setEntityClass(PageVO.class);
            search.setDefaultSort("pageSeq,desc");
            Long totalCount = pageService.countPageRel(search);
            if (totalCount > 0) {
                return true;
            }

        } else if (relType.equals(MokaConstants.ITEM_ARTICLE_PAGE)) {

            // 콘텐츠스킨 목록 조회
            search.setEntityClass(ArticlePageVO.class);
            search.setDefaultSort("artPageSeq,desc");
            Long totalCount = articlePageService.countArticlePageRel(search);
            if (totalCount > 0) {
                return true;
            }

        } else if (relType.equals(MokaConstants.ITEM_CONTAINER)) {

            // 컨테이너 목록 조회
            search.setDefaultSort("containerSeq,desc");
            Pageable pageable = search.getPageable();
            Page<Container> containers = containerService.findAllContainerRel(search, pageable);
            if (containers.getTotalElements() > 0) {
                return true;
            }

        } else if (relType.equals(MokaConstants.ITEM_COMPONENT)) {

            // 컴포넌트 목록 조회
            search.setDefaultSort("componentSeq,desc");
            Pageable pageable = search.getPageable();
            Page<Component> components = componentService.findAllComponentRel(search, pageable);
            if (components.getTotalElements() > 0) {
                return true;
            }

        }

        return false;
    }

    /**
     * 관련 아이템이 있는 도메인인지 체크
     *
     * @param domainId 도메인아이디
     * @return 유무
     */
    public Boolean isRelatedDomain(String domainId) {

        // 템플릿 체크
        if (templateService.countTemplateByDomainId(domainId) > 0) {
            return true;
        }

        // 컴포넌트 체크
        if (componentService.countComponentByDomainId(domainId) > 0) {
            return true;
        }

        // 컨테이너 체크
        if (containerService.countContainerByDomainId(domainId) > 0) {
            return true;
        }

        // 페이지 체크
        RelationSearchDTO search = RelationSearchDTO.builder()
                                                    .relSeqType(MokaConstants.ITEM_DOMAIN)
                                                    .domainId(domainId)
                                                    .build();
        search.setDefaultSort("pageSeq,desc");
        Page<jmnet.moka.core.tps.mvc.page.entity.Page> pages = pageService.findPageByDomainId(domainId, search.getPageable());

        if (pages.getContent()
                 .size() > 1) {
            return true;
        } else if (pages.getContent()
                        .size() == 1) {
            jmnet.moka.core.tps.mvc.page.entity.Page one = pages.getContent()
                                                                .get(0);
            if (one.getParent() != null) {
                // 루트 페이지 체크
                return true;
            }
        }

        // 콘텐츠스킨 체크
        if (articlePageService.countArticlePageByDomainId(domainId) > 0) {
            return true;
        }

        // 광고 체크
        if (adService.countByDomainId(domainId) > 0) {
            return true;
        }

        // 예약어 체크
        if (reservedService.countReservedByDomainId(domainId) > 0) {
            return true;
        }

        return false;
    }
}
