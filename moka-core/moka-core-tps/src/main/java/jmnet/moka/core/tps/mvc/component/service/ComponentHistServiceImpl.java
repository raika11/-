package jmnet.moka.core.tps.mvc.component.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.component.repository.ComponentHistRepository;

@Service
public class ComponentHistServiceImpl implements ComponentHistService {

    @Autowired
    private ComponentHistRepository componentHistRepository;

    @Override
    public ComponentHist insertHistory(ComponentHist history) throws Exception {
        return componentHistRepository.save(history);
    }

    @Override
    public Page<ComponentHist> findHistoryList(Long componentSeq, Pageable pageable) {
        return componentHistRepository.findByComponentSeq(componentSeq, pageable);
    }
    
    @Override
    @Transactional
    public List<ComponentHist> insertHistories(List<?> maybeHistories) throws Exception {
        Iterator<?> iterator = maybeHistories.iterator();
        List<ComponentHist> histories = new ArrayList<ComponentHist>();
        
        while(iterator.hasNext()) {
            Object object = iterator.next();
            if (object.getClass() == Component.class) {
                Component component = (Component) object;
                histories.add(
                        ComponentHist.builder()
                        .createYmdt(component.getCreateYmdt())
                        .creator(component.getCreator())
                        .dataset(component.getDataset())
                        .dataType(component.getDataType())
                        .snapshotBody(component.getSnapshotBody())
                        .domainId(component.getDomain().getDomainId())
                        .template(component.getTemplate())
                        .componentSeq(component.getComponentSeq()).build());
            } else if (object.getClass() == ComponentHist.class) {
                ComponentHist componentHist = (ComponentHist) object;
                histories.add(componentHist);
            }
        }
        
        return componentHistRepository.saveAll(histories);
    }

    @Override
    public ComponentHist insertHistory(Component component) throws Exception {
        ComponentHist history = ComponentHist.builder()
                // 수정일자 or 등록일자
                .createYmdt(McpString.isNullOrEmpty(component.getModifiedYmdt()) ?
                        component.getCreateYmdt() : component.getModifiedYmdt())
                // 수정자 or 등록자
                .creator(McpString.isNullOrEmpty(component.getModifier()) ?
                        component.getCreator() : component.getModifier())
                .dataset(component.getDataset())
                .dataType(component.getDataType())
                .snapshotBody(component.getSnapshotBody())
                .domainId(component.getDomain().getDomainId())
                .template(component.getTemplate())
                .componentSeq(component.getComponentSeq()).build();
        
        return this.insertHistory(history);
    }

    @Override
    public Optional<ComponentHist> findOneByComponentSeqAndDataType(Long componentSeq, String dataType) throws Exception {
        return componentHistRepository.findFirstByComponentSeqAndDataTypeOrderBySeqDesc(componentSeq, dataType);
    }
}
