package jmnet.moka.core.tps.mvc.component.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.component.repository.ComponentHistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ComponentHistServiceImpl implements ComponentHistService {

    @Autowired
    private ComponentHistRepository componentHistRepository;

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
    public List<ComponentHist> insertComponentHistList(List<?> maybeHistories)
            throws Exception {
        Iterator<?> iterator = maybeHistories.iterator();
        List<ComponentHist> histories = new ArrayList<ComponentHist>();

        while (iterator.hasNext()) {
            Object object = iterator.next();
            if (object.getClass() == Component.class) {
                Component component = (Component) object;
                histories.add(ComponentHist.builder()
                                           .dataset(component.getDataset())
                                           .dataType(component.getDataType())
                                           .snapshotBody(component.getSnapshotBody())
                                           .domainId(component.getDomain()
                                                              .getDomainId())
                                           .template(component.getTemplate())
                                           .componentSeq(component.getComponentSeq())
                                           .build());
            } else if (object.getClass() == ComponentHist.class) {
                ComponentHist componentHist = (ComponentHist) object;
                histories.add(componentHist);
            }
        }

        return componentHistRepository.saveAll(histories);
    }

    @Override
    public ComponentHist insertComponentHist(Component component)
            throws Exception {
        ComponentHist history = ComponentHist.builder()
                                             // 수정일자 or 등록일자
                                             //                .regDt(McpString.isNullOrEmpty(component.getModDt()) ?
                                             //                        component.getRegDt() : component.getModDt())
                                             // 수정자 or 등록자
                                             //                .regId(McpString.isNullOrEmpty(component.getModId()) ?
                                             //                        component.getRegId() : component.getModId())
                                             .dataset(component.getDataset())
                                             .dataType(component.getDataType())
                                             .domainId(component.getDomain()
                                                                .getDomainId())
                                             .template(component.getTemplate())
                                             .componentSeq(component.getComponentSeq())
                                             .snapshotYn(component.getSnapshotYn())
                                             .snapshotBody(component.getSnapshotBody())
                                             .status(EditStatusCode.PUBLISH)
                                             .approvalYn(MokaConstants.YES)
                                             .zone(component.getZone())
                                             .matchZone(component.getMatchZone())
                                             .viewYn(component.getViewYn())
                                             .perPageCount(component.getPerPageCount())
                                             .build();

        return this.insertComponentHist(history);
    }

    @Override
    public List<ComponentHist> findLastHist(Long componentSeq, String dataType)
            throws Exception {
        return componentHistRepository.findLastHist(componentSeq, dataType);
    }
}
