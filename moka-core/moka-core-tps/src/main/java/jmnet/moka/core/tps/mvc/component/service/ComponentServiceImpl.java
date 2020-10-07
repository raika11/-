package jmnet.moka.core.tps.mvc.component.service;

import static jmnet.moka.common.data.mybatis.support.McpMybatis.getRowBounds;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import javax.persistence.EntityManager;

import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.codeMgt.entity.CodeMgt;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentAd;
import jmnet.moka.core.tps.mvc.component.mapper.ComponentMapper;
import jmnet.moka.core.tps.mvc.component.repository.ComponentRepository;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.dataset.service.DatasetService;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.codeMgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.skin.service.SkinService;

/**
 * 컴포넌트 서비스 Impl
 * 
 * @author jeon
 *
 */
@Service
@Slf4j
public class ComponentServiceImpl implements ComponentService {

    @Autowired
    private ComponentRepository componentRepository;

    @Autowired
    private ComponentHistService componentHistService;

    @Autowired
    private ComponentAdService componentAdService;

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
    public List<ComponentVO> findList(ComponentSearchDTO search) {
        if (search.getSearchType().equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) { // 페이지에서 관련 컴포넌트 검색
            return componentMapper.findPageChildRels(search,
                    getRowBounds(search.getPage(), search.getSize()));
        } else if (search.getSearchType().equals("skinSeq")
                && McpString.isNotEmpty(search.getKeyword())) {	// 콘텐츠스킨에서 관련 컴포넌트 검색
            return componentMapper.findSkinChildRels(search,
                    getRowBounds(search.getPage(), search.getSize()));
        } else if (search.getSearchType().equals("containerSeq")
                && McpString.isNotEmpty(search.getKeyword())) { // 컨테이너에서 관련 컴포넌트 검색
            return componentMapper.findContainerChildRels(search,
                    getRowBounds(search.getPage(), search.getSize()));
        } else {
            if (search.getSearchType().equals("pageSeq") || search.getSearchType().equals("skinSeq")
                    || search.getSearchType().equals("containerSeq")) {
                search.clearSort();
                search.addSort("componentSeq,desc");
            }
            return componentMapper.findAll(search,
                    getRowBounds(search.getPage(), search.getSize()));
        }
    }

    @Override
    public Long findListCount(ComponentSearchDTO search) {
        if (search.getSearchType().equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) {
            return componentMapper.findPageChildRelsCount(search);
        } else if (search.getSearchType().equals("skinSeq")
                && McpString.isNotEmpty(search.getKeyword())) {
            return componentMapper.findSkinChildRelsCount(search);
        } else if (search.getSearchType().equals("containerSeq")
                && McpString.isNotEmpty(search.getKeyword())) {
            return componentMapper.findContainerChildRelsCount(search);
        } else {
            return componentMapper.count(search);
        }
    }

    @Override
    public Optional<Component> findByComponentSeq(Long componentSeq) {
        Optional<Component> component = componentRepository.findById(componentSeq);
        if (component.isPresent()) {
            // 광고 셋팅
            LinkedHashSet<ComponentAd> componentAds =
                    componentAdService.findByComponentSeq(componentSeq);
            Component comp = component.get();
            comp.setComponentAdList(componentAds);

            // 템플릿 위치그룹명 셋팅
            Optional<CodeMgt> codeMgt =
                codeMgtSevice.findByDtlCd(comp.getTemplate().getTemplateGroup());
            codeMgt.ifPresent((c) -> {
                comp.getTemplate().setTemplateGroupName(c.getCdNm());
            });
        }
        return component;
    }

    @Override
    @Transactional(rollbackFor = NoDataException.class)
    public Component insertComponent(Component component) throws NoDataException, Exception {
        Component returnComp = null;
        Set<ComponentAd> ads = component.getComponentAdList();

        if (component.getDataType().equals(TpsConstants.DATATYPE_DESK)) {
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
        if (ads != null && ads.size() > 0) {
            for (ComponentAd ad : ads) {
                ad.setComponentSeq(returnComp.getComponentSeq());
            }
            Set<ComponentAd> returnAds = componentAdService.insertComponentAdList(ads);
            log.debug("[COMPONENT INSERT] seq: {}) AdList Insert success",
                    returnComp.getComponentSeq());

            returnComp.setComponentAdList(returnAds);
        }

        // 히스토리 생성
        componentHistService.insertHistory(returnComp);
        log.debug("[COMPONENT INSERT] seq: {}) History Insert success",
                returnComp.getComponentSeq());

        // DB반영
        entityManager.refresh(returnComp);

        // 템플릿 위치그룹명 셋팅
        Optional<CodeMgt> codeMgt =
                codeMgtSevice.findByDtlCd(returnComp.getTemplate().getTemplateGroup());
        if (codeMgt.isPresent()) {
            returnComp.getTemplate().setTemplateGroupName(codeMgt.get().getCdNm());
        }

        return returnComp;
    }

    @Override
    public Component updateComponent(Component component) throws NoDataException, Exception {
        String message = messageByLocale.get("tps.component.error.noContent");
        Component orgComponent = this.findByComponentSeq(component.getComponentSeq())
                .orElseThrow(() -> new NoDataException(message));
        return this.updateComponent(component, orgComponent);
    }

    @Override
    @Transactional
    public Component updateComponent(Component newComponent, Component orgComponent)
            throws Exception {
        Component returnComp = null;

        // DATASET_SEQ == null이고 DATA_TYPE == 'EDIT' 인 경우 데이터셋 생성하여 컴포넌트에 셋팅
        if (newComponent.getDataset() == null
                && newComponent.getDataType().equals(TpsConstants.DATATYPE_DESK)) {
            newComponent.setDataset(this.createNewDataset(newComponent));
        }
        entityManager.detach(orgComponent);

        // 컴포넌트 업데이트
        returnComp = componentRepository.save(newComponent);
        log.debug("[COMPONENT UPDATE] seq: {}", returnComp.getComponentSeq());

        // 컴포넌트 광고 업데이트
        Set<ComponentAd> ads = componentAdService.updateComponentAdList(
                newComponent.getComponentAdList(), orgComponent.getComponentAdList());
        returnComp.setComponentAdList(ads);
        log.debug("[COMPONENT UPDATE] seq: {}) AdList Update success",
                returnComp.getComponentSeq());

        // 히스토리 추가
        componentHistService.insertHistory(returnComp);
        log.debug("[COMPONENT UPDATE] seq: {}) History Insert success",
                returnComp.getComponentSeq());

        // 템플릿 위치그룹명 셋팅
        Optional<CodeMgt> codeMgt =
            codeMgtSevice.findByDtlCd(returnComp.getTemplate().getTemplateGroup());
        if (codeMgt.isPresent()) {
            returnComp.getTemplate().setTemplateGroupName(codeMgt.get().getCdNm());
        }

        // 컨테이너의 관련아이템 업데이트(페이지,스킨,컨테이너)
        containerService.updateRelItems(newComponent, orgComponent);
        pageService.updateRelItems(newComponent, orgComponent);
        skinService.updateRelItems(newComponent, orgComponent);

        return returnComp;
    }

    private Dataset createNewDataset(Component component) throws NoDataException {
        // DATASET_SEQ == null일때만 새로운 데이터셋을 생성한다
        if (component.getDataset() == null) {

            // 도메인정보 조회
            String message = messageByLocale.get("tps.component.error.invalid.domainId");
            Domain domain = domainService.findDomainById(component.getDomain().getDomainId())
                    .orElseThrow(() -> new NoDataException(message));

            // dataset 생성
            Dataset dataset = Dataset.builder().regDt(component.getRegDt())
                    .regId(component.getRegId()).dataApiHost(domain.getApiHost())
                    .dataApiPath(domain.getApiPath()).datasetName(component.getComponentName())
                    .autoCreateYn("N").build();

            Dataset returnDataset = datasetService.insertDataset(dataset);
            log.debug("[COMPONENT INSERT] seq: {}) Dataset Insert success",
                    component.getComponentSeq());

            return returnDataset;
        }
        return component.getDataset();
    }

    @Override
    public void deleteComponent(Long seq) throws NoDataException, Exception {
        String message = messageByLocale.get("tps.component.error.noContent");
        Component component =
                this.findByComponentSeq(seq).orElseThrow(() -> new NoDataException(message));
        this.deleteComponent(component);
    }

    @Override
    @Transactional
    public void deleteComponent(Component component) throws Exception {
        Long seq = component.getComponentSeq();

        // DATA_TYPE == "EDIT" 이면 데이터셋을 지운다(삭제 로직은 데이터셋 서비스에서 처리)
        if (component.getDataType().equals(TpsConstants.DATATYPE_DESK)) {
            if (component.getDataset() != null) {
                datasetService.deleteAfterCheckDataset(component.getDataset().getDatasetSeq());
            }
        }

        // 데스킹을 지운다

        // 컴포넌트 광고를 지운다
        if (component.getComponentAdList().size() > 0) {
            componentAdService.deleteByComponentSeq(seq);
        }

        // 컴포넌트를 삭제한다
        componentRepository.deleteById(seq);
        log.debug("[COMPONENT DELETE] seq: {}", seq);
    }

    @Override
    @Transactional
    public List<Component> insertComponents(List<Component> components) throws Exception {
        List<Component> result = componentRepository.saveAll(components);
        // 히스토리 생성
        componentHistService.insertHistories(result);
        return result;
    }

    @Override
    public Page<Component> findRelList(RelSearchDTO search, Pageable pageable) {
        if (search.getRelSeqType().equals(MokaConstants.ITEM_TEMPLATE)) {
            // 템플릿
            return componentRepository.findListByTemplate(search, pageable);
        } else if (search.getRelSeqType().equals(MokaConstants.ITEM_DATASET)) {
            // 데이터셋
            return componentRepository.findListByDataset(search, pageable);
        }
        return null;
    }

    @Override
    public Page<Component> findByDataset_DatasetSeq(Long datasetSeq, Pageable pageable) {
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
    public Page<Component> findList(ComponentSearchDTO search, Pageable pageable) {
        return componentRepository.findList(search, pageable);
    }

    @Override
    public int countByDomainId(String domainId) {
        return componentRepository.countByDomain_DomainId(domainId);
    }

    @Override
    public Optional<Component> findByDataTypeAndDataset_DatasetSeq(String dataType,
            Long datasetSeq) {
        return componentRepository.findByDataTypeAndDataset_DatasetSeq(dataType, datasetSeq);
    }
}
