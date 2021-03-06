package jmnet.moka.core.tps.mvc.page.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.template.ParsedItemDTO;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.HistPublishDTO;
import jmnet.moka.core.tps.common.dto.ItemDTO;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.page.dto.PageNode;
import jmnet.moka.core.tps.mvc.page.dto.PageSearchDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.entity.PageHist;
import jmnet.moka.core.tps.mvc.page.entity.PageRel;
import jmnet.moka.core.tps.mvc.page.mapper.PageMapper;
import jmnet.moka.core.tps.mvc.page.mapper.PageRelMapper;
import jmnet.moka.core.tps.mvc.page.repository.PageHistRepository;
import jmnet.moka.core.tps.mvc.page.repository.PageRelRepository;
import jmnet.moka.core.tps.mvc.page.repository.PageRepository;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 * ????????? ?????????
 * 2020. 1. 8. ssc ????????????
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 8. ?????? 2:07:40
 */
@Service
@Slf4j
public class PageServiceImpl implements PageService {

    @Autowired
    PageRepository pageRepository;

    @Autowired
    PageRelRepository pageRelRepository;

    @Autowired
    PageHistRepository pageHistRepository;

    @Autowired
    ContainerService containerService;

    @Autowired
    ComponentService componentService;

    @Autowired
    private PageRelMapper pageRelMapper;

    @Autowired
    private PageMapper pageMapper;

    @Override
    public PageNode makeTree(PageSearchDTO search, List<Long> findPageList) {
        // List<Page> pageList =
        // pageRepository.findWithPageRelationByDomainInfo_DomainIdOrderByPageServiceUrl(
        // search.getDomainId());
        List<Page> pageList = pageRepository.findByDomainId(search.getDomainId());
        return pageList.isEmpty() ? null : makeTree(pageList, search, findPageList);
    }

    private PageNode makeTree(List<Page> pageList, PageSearchDTO search, List<Long> findPageList) {
        PageNode rootNode = null;
        Iterator<Page> it = pageList.iterator();
        while (it.hasNext()) {
            Page page = it.next();
            if (page.getParent() == null || page
                    .getParent()
                    .getPageSeq() == 0) {
                rootNode = new PageNode(page);

                boolean find = getMatch(page, search);
                rootNode.setMatch(find ? "Y" : "N");
                if (find) {
                    findPageList.add(page.getPageSeq());
                }
                rootNode.setParentNodes(page
                        .getPageSeq()
                        .toString());
            } else {
                PageNode parentNode = rootNode.findNode(page
                        .getParent()
                        .getPageSeq(), rootNode);
                if (parentNode != null) {
                    PageNode pageNode = new PageNode(page);
                    boolean find = getMatch(page, search);
                    pageNode.setMatch(find ? "Y" : "N");
                    if (find) {
                        findPageList.add(page.getPageSeq());
                    }
                    pageNode.setParentNodes(parentNode.getParentNodes() + "." + page
                            .getPageSeq()
                            .toString());
                    parentNode.addNode(pageNode);
                }
            }
        }
        rootNode.sort();
        return rootNode;
    }

    private boolean getMatch(Page page, PageSearchDTO search) {
        String searchType = search.getSearchType();
        CharSequence keyword = search.getKeyword() == null
                ? ""
                : search
                        .getKeyword()
                        .trim();
        boolean match = false;

        if (page == null || McpString.isEmpty(searchType) || McpString.isEmpty(keyword)) {
            return false;
        }

        // ????????????
        if (McpString.isNotEmpty(keyword)) {
            // pageId ??????
            if (searchType.equals("pageSeq")) {
                match = page
                        .getPageSeq()
                        .toString()
                        .equals(keyword) ? true : false;
            }
            // pageName ??????
            else if (searchType.equals("pageName")) {
                match = page
                        .getPageName()
                        .contains(keyword);
            }
            // pageUrl ??????
            else if (searchType.equals("pageUrl")) {
                match = page
                        .getPageUrl()
                        .contains(keyword);
            }
            // pageData ??????
            else if (searchType.equals("pageBody")) {
                match = page
                        .getPageBody()
                        .contains(keyword);
            } else {
                match = String
                        .valueOf(page.getPageSeq())
                        .contains(keyword) || page
                        .getPageName()
                        .contains(keyword) || page
                        .getPageUrl()
                        .contains(keyword) || page
                        .getPageBody()
                        .contains(keyword);
            }
        }

        return match;
    }

    @Override
    public Optional<Page> findPageBySeq(Long pageSeq) {
        return pageRepository.findById(pageSeq);
    }

    @Override
    @Transactional
    public Page insertPage(Page page)
            throws TemplateParseException, IOException {
        // 1. ???????????? ??????
        insertPageRel(page);

        // 2. ?????????
        Page savePage = pageRepository.save(page);

        // 3. ??????????????????
        insertPageHist(savePage, TpsConstants.WORKTYPE_INSERT, savePage.getRegId());

        return savePage;
    }

    /**
     * ??????????????? ??????
     *
     * @param page ????????? ?????????
     * @throws TemplateParseException
     * @throws IOException
     * @throws UnsupportedEncodingException
     */
    private void insertPageRel(Page page)
            throws UnsupportedEncodingException, IOException, TemplateParseException {

        List<ParsedItemDTO> parsedItemDTOList = TemplateParserHelper.getItemList(page.getPageBody());
        List<ItemDTO> itemDTOList = ResourceMapper
                .getDefaultObjectMapper()
                .convertValue(parsedItemDTOList, new TypeReference<List<ItemDTO>>() {
                });
        for (ItemDTO item : itemDTOList) {
            PageRel relation = new PageRel();
            relation.setRelType(item.getNodeName());
            relation.setRelSeq(Long.parseLong(item.getId()));
            relation.setRelParentType(TpsConstants.REL_TYPE_UNKNOWN);
            relation.setRelOrd(item.getOrder());

            // ????????? ???????????? ???????????? ?????????.
            if (page.isEqualRel(relation)) {
                continue;
            } else {
                relation.setPage(page);
                relation.setDomain(page.getDomain());
                // page.addPageRel(relation);
            }

            // if (item.getNodeName().equals(MspConstants.ITEM_CONTAINER)) { // ???????????? ????????? ????????? ????????????.
            // List<ContainerRel> containerRelList =
            // containerService.findChildRelList(Long.parseLong(item.getId()));
            //
            // for (ContainerRel containerRel : containerRelList) {
            // PageRel relationCT = new PageRel();
            // relationCT.setRelType(containerRel.getRelType());
            // relationCT.setRelSeq(containerRel.getRelSeq());
            // // ????????? CT??? ??????
            // relationCT.setRelParentType(MspConstants.ITEM_CONTAINER);
            // relationCT.setRelParentSeq(Long.parseLong(item.getId()));
            // relationCT.setRelOrder(item.getOrder());
            //
            // // ????????? ???????????? ???????????? ?????????.
            // if (!page.isEqualRel(relationCT)) {
            // relationCT.setPage(page);
            // relationCT.setDomain(page.getDomain());
            // // page.addPageRel(relationCT);
            // }
            // }
            // } else
            if (item
                    .getNodeName()
                    .equals(MokaConstants.ITEM_COMPONENT)) {    // ???????????? ????????? ?????????
                // ????????????.
                Optional<Component> component = componentService.findComponentBySeq(Long.parseLong(item.getId()));

                if (component.isPresent()) {

                    // template ????????? ??????
                    PageRel relationTP = new PageRel();
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
                    if (!page.isEqualRel(relationTP)) {
                        relationTP.setPage(page);
                        relationTP.setDomain(page.getDomain());
                        // page.addPageRel(relationTP);
                    }

                    // data ????????? ??????
                    if (component
                            .get()
                            .getDataset() != null) {
                        PageRel relatioDS = new PageRel();
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

                        if (!page.isEqualRel(relatioDS)) {
                            relatioDS.setPage(page);
                            relatioDS.setDomain(page.getDomain());
                            // page.addPageRel(relatioDS);
                        }
                    }

                }
            }
        }
    }

    /**
     * ??????????????????
     *
     * @param savePage ?????????
     * @param workType ????????????
     * @param userName ?????????
     */
    private void insertPageHist(Page savePage, String workType, String userName) {
        PageHist hist = new PageHist();
        hist.setPage(savePage);
        hist.setDomain(savePage.getDomain());
        hist.setPageBody(savePage.getPageBody());
        hist.setWorkType(workType);

        if (workType.equals(TpsConstants.WORKTYPE_INSERT)) {
            hist.setRegDt(savePage.getRegDt());
            hist.setRegId(savePage.getRegId());
        } else if (workType.equals(TpsConstants.WORKTYPE_UPDATE)) {
            hist.setRegDt(savePage.getModDt());
            hist.setRegId(savePage.getModId());
        } else if (workType.equals(TpsConstants.WORKTYPE_DELETE)) {
            hist.setRegDt(McpDate.now());
            hist.setRegId(userName);
        }

        pageHistRepository.save(hist);
    }

    @Override
    public Page updatePage(Page page)
            throws Exception {

        // 1. ?????? ?????????????????? ?????? ???, ??????
        Map<String, Object> paramMap = new HashMap<String, Object>();
        Integer returnValue = TpsConstants.PROCEDURE_SUCCESS;
        paramMap.put("pageSeq", page.getPageSeq());
        paramMap.put("returnValue", returnValue);
        pageRelMapper.deleteByPageSeq(paramMap);
        if ((int) paramMap.get("returnValue") < 0) {
            log.debug("DELETE FAIL PAGE RELATION : {} ", returnValue);
            throw new Exception("Failed to delete PAGE RELATION error code: " + returnValue);
        }
        insertPageRel(page);

        // 2. ??????
        Page savePage = pageRepository.save(page);


        // 3. ??????????????????
        insertPageHist(savePage, TpsConstants.WORKTYPE_UPDATE, savePage.getModId());

        return savePage;
    }

    @Override
    public void deletePage(Page page, String userName) {

        String domainId = page
                .getDomain()
                .getDomainId();

        Long pageSeq = page.getPageSeq();

        // 1. ??????????????????
        Map paramMap = new HashMap();
        paramMap.put("domainId", domainId);
        paramMap.put("pageSeq", pageSeq);
        List<Long> subNodes = pageMapper.findSubNodes(paramMap);
        for (Long deletePageSeq : subNodes) {
            deleteOnePage(deletePageSeq, userName);
        }
        // mysql
        //        String subNodes = pageRepository.findSubNodes(domainId, pageSeq);
        //        if (!McpString.isEmpty(subNodes)) {
        //            String[] subNodesList = subNodes.split(",");
        //            for (String deletePageSeq : subNodesList) {
        //                deleteOnePage(Long.valueOf(deletePageSeq), userName);
        //            }
        //        }

        // 2. ??????
        deleteOnePage(pageSeq, userName);
    }

    private void deleteOnePage(Long pageSeq, String userName) {
        findPageBySeq(pageSeq).ifPresent(page -> {
            // ??????????????????
            insertPageHist(page, TpsConstants.WORKTYPE_DELETE, userName);

            log.info("[DELETE PAGE] domainId : {} pageSeq : {}", page
                    .getDomain()
                    .getDomainId(), page.getPageSeq());

            // ??????
            pageRepository.deleteById(page.getPageSeq());

        });
    }

    @Override
    public List<Page> findPageByPageUrl(String pageUrl, String domainId) {
        // return pageRepository.findByPageServiceUrlAndDomainInfo_DomainId(pageServiceUrl,
        // domainId);
        return pageRepository.findByPageUrl(pageUrl, domainId);
    }

    @Override
    public Optional<PageHist> findPageHistBySeq(Long histSeq) {
        return pageHistRepository.findById(histSeq);
    }

    @Override
    public org.springframework.data.domain.Page<Page> findAllPage(PageSearchDTO search, Pageable pageable) {
        return pageRepository.findList(search, pageable);
    }

    @Override
    public List<PageVO> findAllPageRel(RelationSearchDTO search) {
        return pageRelMapper.findAll(search);
    }

    @Override
    public Long countPageRel(RelationSearchDTO search) {
        pageRelMapper.findAll(search);
        return search.getTotal();
    }

    @Override
    public void updatePageRelItems(Component newComponent, Component orgComponent) {
        // ????????? ????????????
        if (!newComponent
                .getTemplate()
                .getTemplateSeq()
                .equals(orgComponent
                        .getTemplate()
                        .getTemplateSeq())) {
            pageRelRepository.updateRelTemplates(newComponent);
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

                List<PageRel> relList = pageRelRepository.findList(MokaConstants.ITEM_COMPONENT, newComponent.getComponentSeq());

                for (PageRel rel : relList) {
                    PageRel newRel = PageRel
                            .builder()
                            .page(rel.getPage())
                            .domain(rel.getDomain())
                            .relType(MokaConstants.ITEM_DATASET)
                            .relSeq(newComponent
                                    .getDataset()
                                    .getDatasetSeq())
                            .relParentType(MokaConstants.ITEM_COMPONENT)
                            .relParentSeq(newComponent.getComponentSeq())
                            .relOrd(rel.getRelOrd())
                            .build();
                    pageRelRepository.save(newRel);
                }
            } else {
                pageRelRepository.updateRelDatasets(newComponent, orgComponent);
            }
        }
    }

    @Override
    public void updateViewComponent(Page page)
            throws Exception {
        // ?????? ???????????? ?????? ??????
        ComponentSearchDTO search = ComponentSearchDTO
                .builder()
                .domainId(page
                        .getDomain()
                        .getDomainId())
                .build();
        search.setSearchType("pageSeq");
        search.setKeyword(page
                .getPageSeq()
                .toString());
        search.setUseTotal(MokaConstants.NO);
        search.setSize(99999);
        List<ComponentVO> list = componentService.findAllComponent(search);

        for (ComponentVO componentVO : list) {
            // VIEW_YN = N??? ??????????????? Y??? ????????????
            if (componentVO
                    .getViewYn()
                    .equals(MokaConstants.NO)) {

                Optional<Component> component = componentService.findComponentBySeq(componentVO.getComponentSeq());

                if (component.isPresent()) {
                    component
                            .get()
                            .setViewYn(MokaConstants.YES);
                    HistPublishDTO histPublishDTO = HistPublishDTO
                            .builder()
                            .status(EditStatusCode.PUBLISH)
                            .approvalYn(MokaConstants.YES)
                            .build();
                    componentService.updateComponent(component.get(), histPublishDTO);
                }
            }
        }
    }

    @Override
    public org.springframework.data.domain.Page<Page> findPageByDomainId(String domainId, Pageable pageable) {
        return pageRepository.findByDomain_DomainId(domainId, pageable);
    }
}
