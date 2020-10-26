package jmnet.moka.core.tps.mvc.container.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.template.ParsedItemDTO;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.common.dto.ItemDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    @Override
    public List<ContainerVO> findAllContainer(ContainerSearchDTO search) {

        if (search.getSearchType()
                  .equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) { // 페이지에서 관련 컨테이너 검색
            return containerMapper.findPageChildRelList(search);
        } else if (search.getSearchType()
                         .equals("skinSeq") && McpString.isNotEmpty(search.getKeyword())) { // 콘텐츠스킨에서 관련 컨테이너 검색
            return containerMapper.findSkinChildRelList(search);
        } else { // 컨테이너목록 조회
            if (search.getSearchType()
                      .equals("pageSeq") || search.getSearchType()
                                                  .equals("skinSeq")) {
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
    public Container insertContainer(Container container)
            throws TemplateParseException, UnsupportedEncodingException, IOException {

        // 1. 관련정보 추가
        insertRel(container);

        // 2. 페이지
        Container saveContainer = containerRepository.save(container);

        // 3. 히스토리저장
        insertHist(saveContainer, TpsConstants.WORKTYPE_INSERT, saveContainer.getRegId());

        return saveContainer;
    }

    /**
     * 관련아이템 저장
     *
     * @param container 페이지 엔티티
     * @throws TemplateParseException
     * @throws IOException
     * @throws UnsupportedEncodingException
     */
    private void insertRel(Container container)
            throws UnsupportedEncodingException, IOException, TemplateParseException {

        List<ParsedItemDTO> parsedItemDTOList = TemplateParserHelper.getItemList(container.getContainerBody());
        List<ItemDTO> itemDTOList = ResourceMapper.getDefaultObjectMapper()
                                                  .convertValue(parsedItemDTOList, new TypeReference<List<ItemDTO>>() {
                                                  });
        for (ItemDTO item : itemDTOList) {
            ContainerRel relation = new ContainerRel();
            relation.setRelType(item.getNodeName());
            relation.setRelSeq(Long.parseLong(item.getId()));
            relation.setRelParentType(TpsConstants.REL_TYPE_UNKNOWN);
            relation.setRelOrd(item.getOrder());

            // 동일한 아이템은 추가하지 않는다.
            if (container.isEqualRel(relation)) {
                continue;
            } else {
                relation.setContainer(container);
                relation.setDomain(container.getDomain());
                // container.addContainerRel(relation);
            }

            if (item.getNodeName()
                    .equals(MokaConstants.ITEM_COMPONENT)) {    // 컴포넌트 자식을 찾아서
                // 추가한다.
                Optional<Component> component = componentService.findComponentBySeq(Long.parseLong(item.getId()));

                if (component.isPresent()) {

                    // template 아이템 추가
                    ContainerRel relationTP = new ContainerRel();
                    relationTP.setRelType(MokaConstants.ITEM_TEMPLATE);
                    relationTP.setRelSeq(component.get()
                                                  .getTemplate()
                                                  .getTemplateSeq());
                    relationTP.setRelParentType(MokaConstants.ITEM_COMPONENT);
                    relationTP.setRelParentSeq(component.get()
                                                        .getComponentSeq());
                    relationTP.setRelOrd(item.getOrder());

                    if (!container.isEqualRel(relationTP)) {
                        relationTP.setContainer(container);
                        relationTP.setDomain(container.getDomain());
                        // container.addContainerRel(relationTP);
                    }

                    // data 아이템 추가
                    if (component.get()
                                 .getDataset() != null) {
                        ContainerRel relatioDS = new ContainerRel();
                        relatioDS.setRelType(MokaConstants.ITEM_DATASET);
                        relatioDS.setRelSeq(component.get()
                                                     .getDataset()
                                                     .getDatasetSeq());
                        relatioDS.setRelParentType(MokaConstants.ITEM_COMPONENT);
                        relatioDS.setRelParentSeq(component.get()
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
     * 히스토리저장
     *
     * @param saveContainer 컨테이너정보
     * @param workType      새로 등록여부
     * @param userName      작업자
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
    public Container updateContainer(Container container)
            throws Exception {

        // 1. 기존 관련아이템은 삭제 후, 저장
        Long returnValue = containerRelMapper.deleteByContainerSeq(container.getContainerSeq());
        if (returnValue < 0) {
            log.debug("DELETE FAIL CONTAINER_REL : {} ", returnValue);
            throw new Exception("Failed to delete CONTAINER_REL. error code: " + returnValue);
        }
        insertRel(container);

        // 2. 저장
        Container saveContainer = containerRepository.save(container);

        // 3. 히스토리저장
        insertHist(saveContainer, TpsConstants.WORKTYPE_UPDATE, saveContainer.getModId());

        return saveContainer;
    }

    @Override
    public void deleteContainer(Container container, String name) {

        log.info("[DELETE Container] domainId : {} containerSeq : {}", container.getDomain()
                                                                                .getDomainId(), container.getContainerSeq());

        // 히스토리저장
        insertHist(container, TpsConstants.WORKTYPE_DELETE, name);

        // 삭제
        containerRepository.deleteById(container.getContainerSeq());

    }

    @Override
    public Page<ContainerHist> findAllContainerHist(HistSearchDTO search, Pageable pageable) {
        return containerHistRepository.findList(search, pageable);
    }

    @Override
    public void updateRelItems(Component newComponent, Component orgComponent) {

        // 템플릿 업데이트
        if (!newComponent.getTemplate()
                         .getTemplateSeq()
                         .equals(orgComponent.getTemplate()
                                             .getTemplateSeq())) {
            containerRelRepository.updateRelTemplates(newComponent);
        }

        // 데이타셋 업데이트
        boolean updateDS = false;
        if (!newComponent.getDataType()
                         .equals(orgComponent.getDataType())) {
            updateDS = true;
        }
        if (newComponent.getDataset() != null && orgComponent.getDataset() != null) {
            if (!newComponent.getDataset()
                             .getDatasetSeq()
                             .equals(orgComponent.getDataset()
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
            // datasetSeq가 추가된 경우: select -> insert. querydsl에서 insert는 안되므로 여기서 처리
            if (!newComponent.getDataType()
                             .equals(TpsConstants.DATATYPE_NONE) && orgComponent.getDataType()
                                                                                .equals(TpsConstants.DATATYPE_NONE)) {

                List<ContainerRel> relList = containerRelRepository.findList(MokaConstants.ITEM_COMPONENT, newComponent.getComponentSeq());

                for (ContainerRel rel : relList) {
                    ContainerRel newRel = ContainerRel.builder()
                                                      .container(rel.getContainer())
                                                      .domain(rel.getDomain())
                                                      .relType(MokaConstants.ITEM_DATASET)
                                                      .relSeq(newComponent.getDataset()
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

    //검색조건에 해당하는 아이템을 사용중인 컨테이너 목록 조회(부모찾기)
    // : 컴포넌트,템플릿,데이타셋,광고에서 사용하는 함수
    @Override
    public Page<Container> findAllContainerRel(RelSearchDTO search, Pageable pageable) {
        return containerRepository.findRelList(search, pageable);
    }
}
