package jmnet.moka.core.tps.mvc.container.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.template.ParsedItemDTO;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.ItemDTO;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.container.dto.ContainerSearchDTO;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;
import jmnet.moka.core.tps.mvc.container.entity.ContainerRel;
import jmnet.moka.core.tps.mvc.container.mapper.ContainerMapper;
import jmnet.moka.core.tps.mvc.container.mapper.ContainerRelMapper;
import jmnet.moka.core.tps.mvc.container.repository.ContainerHistRepository;
import jmnet.moka.core.tps.mvc.container.repository.ContainerRelRepository;
import jmnet.moka.core.tps.mvc.container.repository.ContainerRepository;
import jmnet.moka.core.tps.mvc.container.vo.ContainerVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class ContainerServiceImpl implements ContainerService {

    @Autowired
    ContainerRepository containerRepository;

    @Autowired
    ContainerRelRepository containerRelRepository;

    @Autowired
    ContainerHistRepository containerHistRepository;

    @Autowired
    ComponentService componentService;

    @Autowired
    ContainerMapper containerMapper;

    @Autowired
    ContainerRelMapper containerRelMapper;

    @Autowired
    private UploadFileHelper uploadFileHelper;

    @Override
    public List<ContainerVO> findAllContainer(ContainerSearchDTO search) {

        if (search
                .getSearchType()
                .equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) { // ??????????????? ?????? ???????????? ??????
            return containerMapper.findPageChildRelList(search);
        } else if (search
                .getSearchType()
                .equals("artPageSeq") && McpString.isNotEmpty(search.getKeyword())) { // ????????????????????? ?????? ???????????? ??????
            return containerMapper.findArticlePageChildRelList(search);
        } else { // ?????????????????? ??????
            if (search
                    .getSearchType()
                    .equals("pageSeq") || search
                    .getSearchType()
                    .equals("artPageSeq")) {
                search.clearSort();
                search.addSort("containerSeq,desc");
            }
            return containerMapper.findAll(search);
        }
    }

    @Override
    public Optional<Container> findContainerBySeq(Long containerSeq) {
        return containerRepository.findById(containerSeq);
    }

    @Override
    @Transactional
    public Container insertContainer(Container container)
            throws TemplateParseException, IOException {

        // 1. ???????????? ??????
        insertRel(container);

        // 2. ?????????
        Container saveContainer = containerRepository.save(container);

        // 3. ??????????????????
        insertHist(saveContainer, TpsConstants.WORKTYPE_INSERT, saveContainer.getRegId());

        return saveContainer;
    }

    /**
     * ??????????????? ??????
     *
     * @param container ????????? ?????????
     * @throws TemplateParseException
     * @throws IOException
     * @throws UnsupportedEncodingException
     */
    private void insertRel(Container container)
            throws UnsupportedEncodingException, IOException, TemplateParseException {

        List<ParsedItemDTO> parsedItemDTOList = TemplateParserHelper.getItemList(container.getContainerBody());
        List<ItemDTO> itemDTOList = ResourceMapper
                .getDefaultObjectMapper()
                .convertValue(parsedItemDTOList, new TypeReference<List<ItemDTO>>() {
                });
        for (ItemDTO item : itemDTOList) {
            ContainerRel relation = new ContainerRel();
            relation.setRelType(item.getNodeName());
            relation.setRelSeq(Long.parseLong(item.getId()));
            relation.setRelParentType(TpsConstants.REL_TYPE_UNKNOWN);
            relation.setRelOrd(item.getOrder());

            // ????????? ???????????? ???????????? ?????????.
            if (container.isEqualRel(relation)) {
                continue;
            } else {
                relation.setContainer(container);
                relation.setDomain(container.getDomain());
                // container.addContainerRel(relation);
            }

            if (item
                    .getNodeName()
                    .equals(MokaConstants.ITEM_COMPONENT)) {    // ???????????? ????????? ?????????
                // ????????????.
                Optional<Component> component = componentService.findComponentBySeq(Long.parseLong(item.getId()));

                if (component.isPresent()) {

                    // template ????????? ??????
                    ContainerRel relationTP = new ContainerRel();
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

                    if (!container.isEqualRel(relationTP)) {
                        relationTP.setContainer(container);
                        relationTP.setDomain(container.getDomain());
                        // container.addContainerRel(relationTP);
                    }

                    // data ????????? ??????
                    if (component
                            .get()
                            .getDataset() != null) {
                        ContainerRel relatioDS = new ContainerRel();
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

                        if (!container.isEqualRel(relatioDS)) {
                            relatioDS.setContainer(container);
                            relatioDS.setDomain(container.getDomain());
                            // container.addContainerRel(relatioDS);
                        }
                    }

                }
            }
        }
    }

    /**
     * ??????????????????
     *
     * @param saveContainer ??????????????????
     * @param workType      ?????? ????????????
     * @param userName      ?????????
     */
    private void insertHist(Container saveContainer, String workType, String userName) {
        ContainerHist hist = new ContainerHist();
        hist.setContainer(saveContainer);
        hist.setDomain(saveContainer.getDomain());
        hist.setContainerBody(saveContainer.getContainerBody());
        hist.setWorkType(workType);

        if (workType.equals(TpsConstants.WORKTYPE_INSERT)) {
            hist.setRegDt(saveContainer.getRegDt());
            hist.setRegId(saveContainer.getRegId());
        } else if (workType.equals(TpsConstants.WORKTYPE_UPDATE)) {
            hist.setRegDt(saveContainer.getModDt());
            hist.setRegId(saveContainer.getModId());
        } else if (workType.equals(TpsConstants.WORKTYPE_DELETE)) {
            hist.setRegDt(McpDate.now());
            hist.setRegId(userName);
        }

        containerHistRepository.save(hist);
    }

    @Override
    @Transactional
    public Container updateContainer(Container container, boolean historySave)
            throws Exception {

        // 1. ?????? ?????????????????? ?????? ???, ??????
        Map<String, Object> paramMap = new HashMap<String, Object>();
        Integer returnValue = TpsConstants.PROCEDURE_SUCCESS;
        paramMap.put("containerSeq", container.getContainerSeq());
        paramMap.put("returnValue", returnValue);
        containerRelMapper.deleteByContainerSeq(paramMap);
        if ((int) paramMap.get("returnValue") < 0) {
            log.debug("DELETE FAIL CONTAINER RELATION : {} ", returnValue);
            throw new Exception("Failed to delete CONTAINER RELATION error code: " + returnValue);
        }
        insertRel(container);

        // 2. ??????
        Container saveContainer = containerRepository.save(container);

        // 3. ??????????????????
        if (historySave) {
            insertHist(saveContainer, TpsConstants.WORKTYPE_UPDATE, saveContainer.getModId());
        }

        return saveContainer;
    }

    @Override
    public void deleteContainer(Container container, String name) {

        log.info("[DELETE Container] domainId : {} containerSeq : {}", container
                .getDomain()
                .getDomainId(), container.getContainerSeq());

        // ??????????????????
        insertHist(container, TpsConstants.WORKTYPE_DELETE, name);

        // ??????
        containerRepository.deleteById(container.getContainerSeq());

    }

    @Override
    public Optional<ContainerHist> findContainerHistBySeq(Long histSeq) {
        return containerHistRepository.findById(histSeq);
    }

    @Override
    public void updateRelItems(Component newComponent, Component orgComponent) {

        // ????????? ????????????
        if (!newComponent
                .getTemplate()
                .getTemplateSeq()
                .equals(orgComponent
                        .getTemplate()
                        .getTemplateSeq())) {
            containerRelRepository.updateRelTemplates(newComponent);
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

                List<ContainerRel> relList = containerRelRepository.findList(MokaConstants.ITEM_COMPONENT, newComponent.getComponentSeq());

                for (ContainerRel rel : relList) {
                    ContainerRel newRel = ContainerRel
                            .builder()
                            .container(rel.getContainer())
                            .domain(rel.getDomain())
                            .relType(MokaConstants.ITEM_DATASET)
                            .relSeq(newComponent
                                    .getDataset()
                                    .getDatasetSeq())
                            .relParentType(MokaConstants.ITEM_COMPONENT)
                            .relParentSeq(newComponent.getComponentSeq())
                            .relOrd(rel.getRelOrd())
                            .build();
                    containerRelRepository.save(newRel);
                }
            } else {
                containerRelRepository.updateRelDatasets(newComponent, orgComponent);
            }
        }
    }

    @Override
    public int countContainerByDomainId(String domainId) {
        return containerRepository.countByDomain_DomainId(domainId);
    }

    //??????????????? ???????????? ???????????? ???????????? ???????????? ?????? ??????(????????????)
    // : ????????????,?????????,????????????,???????????? ???????????? ??????
    @Override
    public Page<Container> findAllContainerRel(RelationSearchDTO search, Pageable pageable) {
        return containerRepository.findRelList(search, pageable);
    }

    @Override
    public String saveContainerImage(Container container, MultipartFile thumbFile)
            throws Exception {
        String extension = McpFile
                .getExtension(thumbFile.getOriginalFilename())
                .toLowerCase();

        String filename = UUIDGenerator.uuid() + "." + extension;

        // ???????????? ????????? ?????? ?????? ??????
        String imageRealPath = uploadFileHelper.getRealPath(TpsConstants.CONTAINER_BUSINESS, container
                .getDomain()
                .getDomainId(), filename);

        if (uploadFileHelper.saveImage(imageRealPath, thumbFile.getBytes())) {
            String uri = uploadFileHelper.getDbUri(TpsConstants.CONTAINER_BUSINESS, container
                    .getDomain()
                    .getDomainId(), filename);
            return uri;
        } else {
            return "";
        }
    }

    @Override
    public boolean deleteContainerImage(Container container)
            throws Exception {
        // ????????? ?????? ?????? ??????
        String imageRealPath = uploadFileHelper.getRealPathByDB(container.getContainerThumb());
        return uploadFileHelper.deleteFile(imageRealPath);
    }
}
