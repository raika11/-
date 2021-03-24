package jmnet.moka.core.tps.mvc.component.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.HistPublishDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.component.mapper.ComponentMapper;
import jmnet.moka.core.tps.mvc.component.repository.ComponentHistRepository;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class ComponentHistServiceImpl implements ComponentHistService {

    @Autowired
    private ComponentHistRepository componentHistRepository;

    @Autowired
    private ComponentMapper componentMapper;

    @Autowired
    private ComponentService componentService;

    @Autowired
    private TemplateService templateService;

    @Autowired
    private MessageByLocale messageByLocale;

    @Override
    public ComponentHist insertComponentHist(ComponentHist history)
            throws Exception {
        return componentHistRepository.save(history);
    }

    @Override
    public Page<ComponentHist> findAllComponentHist(Long componentSeq, Pageable pageable) {
        return componentHistRepository.findByComponentSeq(componentSeq, pageable);
    }

    @Override
    @Transactional
    public List<ComponentHist> insertComponentHistList(List<?> maybeHistories, HistPublishDTO histPublishDTO) {
        Iterator<?> iterator = maybeHistories.iterator();
        List<ComponentHist> histories = new ArrayList<ComponentHist>();

        while (iterator.hasNext()) {
            Object object = iterator.next();
            if (object.getClass() == Component.class) {
                Component component = (Component) object;
                histories.add(ComponentHist
                        .builder()
                        .dataset(component.getDataset())
                        .editFormPart(component.getEditFormPart())
                        .dataType(component.getDataType())
                        .snapshotYn(component.getSnapshotYn())
                        .snapshotBody(component.getSnapshotBody())
                        .domainId(component
                                .getDomain()
                                .getDomainId())
                        .template(component.getTemplate())
                        .componentSeq(component.getComponentSeq())
                        .status(histPublishDTO.getStatus())
                        .approvalYn(histPublishDTO.getApprovalYn())
                        .reserveDt(histPublishDTO.getReserveDt())
                        .zone(component.getZone())
                        .matchZone(component.getMatchZone())
                        .viewYn(component.getViewYn())
                        .perPageCount(component.getPerPageCount())
                        .build());
            } else if (object.getClass() == ComponentHist.class) {
                ComponentHist componentHist = (ComponentHist) object;
                histories.add(componentHist);
            }
        }

        return componentHistRepository.saveAll(histories);
    }

    public ComponentHist insertComponentHist(Component component, HistPublishDTO histPublishDTO)
            throws Exception {
        ComponentHist history = ComponentHist
                .builder()
                .dataset(component.getDataset())
                .editFormPart(component.getEditFormPart())
                .dataType(component.getDataType())
                .domainId(component
                        .getDomain()
                        .getDomainId())
                .template(component.getTemplate())
                .componentSeq(component.getComponentSeq())
                .snapshotYn(component.getSnapshotYn())
                .snapshotBody(component.getSnapshotBody())
                .status(histPublishDTO.getStatus())
                .approvalYn(histPublishDTO.getApprovalYn())
                .reserveDt(histPublishDTO.getReserveDt())
                .zone(component.getZone())
                .matchZone(component.getMatchZone())
                .viewYn(component.getViewYn())
                .perPageCount(component.getPerPageCount())
                .build();

        ComponentHist componentHist = this.insertComponentHist(history);
        histPublishDTO.setSeq(componentHist.getSeq());  // 등록된 히스토리SEQ값을 세팅해 준다.
        return componentHist;
    }

    @Override
    public List<ComponentHist> findLastHist(Long componentSeq, String dataType)
            throws Exception {
        return componentHistRepository.findLastHist(componentSeq, dataType);
    }

    @Override
    public Optional<ComponentHist> findComponentHistBySeq(Long seq) {
        return componentHistRepository.findById(seq);
    }

    //    @Override
    //    public boolean existsReserveComponentSeq(Long componentSeq) {
    //        return componentHistRepository.existsReserveComponentSeq(componentSeq);
    //    }

    @Override
    public void deleteByReserveComponentSeq(Long componentSeq)
            throws Exception {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        Integer returnValue = TpsConstants.PROCEDURE_SUCCESS;
        paramMap.put("componentSeq", componentSeq);
        paramMap.put("returnValue", returnValue);
        componentMapper.deleteByReserveComponentSeq(paramMap);
        if ((int) paramMap.get("returnValue") < 0) {
            log.debug("DELETE FAIL RESERVE COMPONENT : {} ", returnValue);
            throw new Exception("Failed to delete RESERVE COMPONENT error code: " + returnValue);
        }
    }

    @Override
    public ComponentHist insertComponentHist(ComponentWorkVO workVO, HistPublishDTO histPublishDTO, Long templateSeq)
            throws Exception {
        String messageC = messageByLocale.get("tps.common.error.no-data");
        Component component = componentService
                .findComponentBySeq(workVO.getComponentSeq())
                .orElseThrow(() -> new NoDataException(messageC));

        ComponentHist history = ComponentHist
                .builder()
                .dataset(component.getDataset())
                .editFormPart(component.getEditFormPart())
                .dataType(component.getDataType())
                .domainId(component
                        .getDomain()
                        .getDomainId())
                .componentSeq(component.getComponentSeq())
                .snapshotYn(workVO.getSnapshotYn()) // 페이지편집에서 수정할 수 있는 컴포넌트정보
                .snapshotBody(workVO.getSnapshotBody())// 페이지편집에서 수정할 수 있는 컴포넌트정보
                .status(histPublishDTO.getStatus())// 페이지편집에서 수정할 수 있는 컴포넌트정보
                .approvalYn(histPublishDTO.getApprovalYn())// 페이지편집에서 수정할 수 있는 컴포넌트정보
                .reserveDt(histPublishDTO.getReserveDt())// 페이지편집에서 수정할 수 있는 컴포넌트정보
                .zone(component.getZone())
                .matchZone(component.getMatchZone())
                .viewYn(workVO.getViewYn())// 페이지편집에서 수정할 수 있는 컴포넌트정보
                .perPageCount(workVO.getPerPageCount())// 페이지편집에서 수정할 수 있는 컴포넌트정보
                .build();

        // 네이버채널
        if (templateSeq != null) {
            String messageT = messageByLocale.get("tps.common.error.no-data");
            Template template = templateService
                    .findTemplateBySeq(workVO.getTemplateSeq())
                    .orElseThrow(() -> new NoDataException(messageT));
            history.setTemplate(template);
        }

        ComponentHist componentHist = this.insertComponentHist(history);
        log.debug("[COMPONENT HISTORY INSERT] seq: {}", component.getComponentSeq());
        return componentHist;
    }
}
