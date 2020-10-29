package jmnet.moka.core.tps.mvc.component.service;

import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.codeMgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codeMgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.mapper.ComponentMapper;
import jmnet.moka.core.tps.mvc.component.repository.ComponentRepository;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.dataset.service.DatasetService;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import jmnet.moka.core.tps.mvc.skin.service.SkinService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 컴포넌트 서비스 Impl
 */
@Service
@Slf4j
public class ComponentServiceImpl implements ComponentService {

    @Autowired
    private ComponentRepository componentRepository;

    @Autowired
    private ComponentHistService componentHistService;

    @Autowired
    private ComponentMapper componentMapper;

    @Autowired
    private DatasetService datasetService;

    @Autowired
    private DomainService domainService;

    @Autowired
    private CodeMgtService codeMgtSevice;

    @Autowired
    private ContainerService containerService;

    @Autowired
    private PageService pageService;

    @Autowired
    private SkinService skinService;

    @Autowired
    private MessageByLocale messageByLocale;

    private final EntityManager entityManager;

    @Autowired
    public ComponentServiceImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<ComponentVO> findAllComponent(ComponentSearchDTO search) {
        if (search.getSearchType()
                  .equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) { // 페이지에서 관련 컴포넌트 검색
            return componentMapper.findPageChildRelList(search);
        } else if (search.getSearchType()
                         .equals("skinSeq") && McpString.isNotEmpty(search.getKeyword())) {    // 콘텐츠스킨에서 관련 컴포넌트 검색
            return componentMapper.findSkinChildRelList(search);
        } else if (search.getSearchType()
                         .equals("containerSeq") && McpString.isNotEmpty(search.getKeyword())) { // 컨테이너에서 관련 컴포넌트 검색
            return componentMapper.findContainerChildRelList(search);
        } else {
            if (search.getSearchType()
                      .equals("pageSeq") || search.getSearchType()
                                                  .equals("skinSeq") || search.getSearchType()
                                                                              .equals("containerSeq")) {
                search.clearSort();
                search.addSort("componentSeq,desc");
            }
            return componentMapper.findAll(search);
        }
    }

    @Override
    public Optional<Component> findComponentBySeq(Long componentSeq) {
        Optional<Component> component = componentRepository.findById(componentSeq);
        if (component.isPresent()) {
            // 광고 셋팅
            //            LinkedHashSet<ComponentAd> componentAds = componentAdService.findComponentAdByComponentSeq(componentSeq);
            Component comp = component.get();
            //            comp.setComponentAdList(componentAds);

            // 템플릿 위치그룹명 셋팅
            Optional<CodeMgt> codeMgt = codeMgtSevice.findByDtlCd(comp.getTemplate()
                                                                      .getTemplateGroup());
            codeMgt.ifPresent((c) -> {
                comp.getTemplate()
                    .setTemplateGroupName(c.getCdNm());
            });
        }
        return component;
    }

    @Override
    @Transactional(rollbackFor = NoDataException.class)
    public Component insertComponent(Component component)
            throws NoDataException, Exception {
        Component returnComp = null;
        //        Set<ComponentAd> ads = component.getComponentAdList();

        if (component.getDataType()
                     .equals(TpsConstants.DATATYPE_DESK)) {
            // insert
            returnComp = componentRepository.save(component);
            log.debug("[COMPONENT INSERT] seq: {}", returnComp.getComponentSeq());

            // 데이터셋 생성하여 컴포넌트에 셋팅
            returnComp.setDataset(this.createNewDataset(returnComp));
            returnComp = this.updateComponent(returnComp);
            entityManager.flush();
        } else {
            returnComp = componentRepository.save(component);
            log.debug("[COMPONENT INSERT] seq: {}", returnComp.getComponentSeq());
        }

        // 컴포넌트광고가 있으면 insert
        //        if (ads != null && ads.size() > 0) {
        //            for (ComponentAd ad : ads) {
        //                ad.setComponentSeq(returnComp.getComponentSeq());
        //            }
        //            Set<ComponentAd> returnAds = componentAdService.insertComponentAdList(ads);
        //            log.debug("[COMPONENT INSERT] seq: {}) AdList Insert success",
        //                    returnComp.getComponentSeq());
        //
        //            returnComp.setComponentAdList(returnAds);
        //        }

        // 히스토리 생성
        componentHistService.insertComponentHist(returnComp);
        log.debug("[COMPONENT INSERT] seq: {}) History Insert success", returnComp.getComponentSeq());

        // DB반영
        entityManager.refresh(returnComp);

        // 템플릿 위치그룹명 셋팅
        Optional<CodeMgt> codeMgt = codeMgtSevice.findByDtlCd(returnComp.getTemplate()
                                                                        .getTemplateGroup());
        if (codeMgt.isPresent()) {
            returnComp.getTemplate()
                      .setTemplateGroupName(codeMgt.get()
                                                   .getCdNm());
        }

        return returnComp;
    }

    @Override
    public Component updateComponent(Component component)
            throws NoDataException, Exception {
        String message = messageByLocale.get("tps.component.error.no-data");
        Component orgComponent = this.findComponentBySeq(component.getComponentSeq())
                                     .orElseThrow(() -> new NoDataException(message));
        return this.updateComponent(component, orgComponent);
    }

    @Override
    @Transactional
    public Component updateComponent(Component newComponent, Component orgComponent)
            throws Exception {

        // DATASET_SEQ == null이고 DATA_TYPE == 'EDIT' 인 경우 데이터셋 생성하여 컴포넌트에 셋팅
        if (newComponent.getDataset() == null && newComponent.getDataType()
                                                             .equals(TpsConstants.DATATYPE_DESK)) {
            newComponent.setDataset(this.createNewDataset(newComponent));
        }
        entityManager.detach(orgComponent);

        // 컴포넌트 업데이트
        Component component = componentRepository.save(newComponent);
        log.debug("[COMPONENT UPDATE] seq: {}", component.getComponentSeq());

        // 컴포넌트 광고 업데이트
        //        Set<ComponentAd> ads = componentAdService.updateComponentAdList(newComponent.getComponentAdList(), orgComponent.getComponentAdList());
        //        component.setComponentAdList(ads);
        //        log.debug("[COMPONENT UPDATE] seq: {} AdList Update success", component.getComponentSeq());

        // 히스토리 추가
        componentHistService.insertComponentHist(component);
        log.debug("[COMPONENT UPDATE] seq: {} History Insert success", component.getComponentSeq());

        // 템플릿 위치그룹명 셋팅
        Optional<CodeMgt> codeMgt = codeMgtSevice.findByDtlCd(component.getTemplate()
                                                                       .getTemplateGroup());
        if (codeMgt.isPresent()) {
            component.getTemplate()
                     .setTemplateGroupName(codeMgt.get()
                                                  .getCdNm());
        }

        // 컨테이너의 관련아이템 업데이트(페이지,스킨,컨테이너)
        containerService.updateRelItems(newComponent, orgComponent);
        pageService.updatePageRelItems(newComponent, orgComponent);
        skinService.updateRelItems(newComponent, orgComponent);

        return component;
    }

    private Dataset createNewDataset(Component component)
            throws NoDataException {
        // DATASET_SEQ == null일때만 새로운 데이터셋을 생성한다
        if (component.getDataset() == null) {

            // 도메인정보 조회
            String message = messageByLocale.get("tps.domain.error.notnull.domainId");
            Domain domain = domainService.findDomainById(component.getDomain()
                                                                  .getDomainId())
                                         .orElseThrow(() -> new NoDataException(message));

            // dataset 생성
            Dataset dataset = Dataset.builder()
                                     .dataApiHost(domain.getApiHost())
                                     .dataApiPath(domain.getApiPath())
                                     .datasetName(component.getComponentName())
                                     .autoCreateYn("N")
                                     .build();

            Dataset returnDataset = datasetService.insertDataset(dataset);
            log.debug("[COMPONENT INSERT] seq: {}) Dataset Insert success", component.getComponentSeq());

            return returnDataset;
        }
        return component.getDataset();
    }

    @Override
    public void deleteComponent(Long seq)
            throws NoDataException, Exception {
        String message = messageByLocale.get("tps.component.error.no-data");
        Component component = this.findComponentBySeq(seq)
                                  .orElseThrow(() -> new NoDataException(message));
        this.deleteComponent(component);
    }

    @Override
    @Transactional
    public void deleteComponent(Component component)
            throws Exception {
        Long seq = component.getComponentSeq();

        // DATA_TYPE == "EDIT" 이면 데이터셋을 지운다(삭제 로직은 데이터셋 서비스에서 처리)
        if (component.getDataType()
                     .equals(TpsConstants.DATATYPE_DESK)) {
            if (component.getDataset() != null) {
                datasetService.deleteAfterCheckDataset(component.getDataset()
                                                                .getDatasetSeq());
            }
        }

        // 데스킹을 지운다

        // 컴포넌트 광고를 지운다
        //        if (component.getComponentAdList()
        //                     .size() > 0) {
        //            componentAdService.deleteComponentAdByComponentSeq(seq);
        //        }

        // 컴포넌트를 삭제한다
        componentRepository.deleteById(seq);
        log.debug("[COMPONENT DELETE] seq: {}", seq);
    }

    @Override
    @Transactional
    public List<Component> insertComponents(List<Component> components)
            throws Exception {
        List<Component> result = componentRepository.saveAll(components);
        // 히스토리 생성
        componentHistService.insertComponentHistList(result);
        return result;
    }

    @Override
    public Page<Component> findAllRel(RelationSearchDTO search, Pageable pageable) {
        if (search.getRelSeqType()
                  .equals(MokaConstants.ITEM_TEMPLATE)) {
            // 템플릿
            return componentRepository.findListByTemplate(search, pageable);
        } else if (search.getRelSeqType()
                         .equals(MokaConstants.ITEM_DATASET)) {
            // 데이터셋
            return componentRepository.findListByDataset(search, pageable);
        }
        return null;
    }

    @Override
    public Page<Component> findComponentByDataset_DatasetSeq(Long datasetSeq, Pageable pageable) {
        return componentRepository.findByDataset_DatasetSeq(datasetSeq, pageable);
    }

    @Override
    public boolean usedByDatasetSeq(Long datasetSeq) {
        int count = componentRepository.countByDataset_DatasetSeq(datasetSeq);
        if (count > 0) {
            return true;
        }
        return false;
    }

    @Override
    public int countComponentByDomainId(String domainId) {
        return componentRepository.countByDomain_DomainId(domainId);
    }

    @Override
    public Optional<Component> findComponentByDataTypeAndDataset_DatasetSeq(String dataType, Long datasetSeq) {
        return componentRepository.findByDataTypeAndDataset_DatasetSeq(dataType, datasetSeq);
    }
}
