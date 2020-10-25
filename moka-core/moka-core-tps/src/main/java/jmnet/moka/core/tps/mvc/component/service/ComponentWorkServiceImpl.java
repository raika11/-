package jmnet.moka.core.tps.mvc.component.service;

import java.util.Optional;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.component.entity.ComponentWork;
import jmnet.moka.core.tps.mvc.component.repository.ComponentWorkRepository;

/**
 * ComponentWorkServiceImpl
 * 
 * @author jeon0525
 *
 */

@Service
@Slf4j
public class ComponentWorkServiceImpl implements ComponentWorkService {
    @Autowired
    private ComponentWorkRepository componentWorkRepository;
    
    @Autowired
    private MessageByLocale messageByLocale;

    @Override
    public Optional<ComponentWork> findComponentWorkBySeq(Long seq) {
        return componentWorkRepository.findById(seq);
    }

	@Override
	public ComponentWork updateComponentWork(ComponentWork component) throws NoDataException, Exception {
		String message = messageByLocale.get("tps.desking.component.error.work.noContent");
		ComponentWork orgComponent = this.findComponentWorkBySeq(component.getSeq())
                .orElseThrow(() -> new NoDataException(message));
		
		orgComponent.setSnapshotYn(component.getSnapshotYn());
		orgComponent.setSnapshotBody(component.getSnapshotBody());
		orgComponent.setTemplate(component.getTemplate());
		
		// 컴포넌트 업데이트
		ComponentWork saved = componentWorkRepository.save(orgComponent);
        log.debug("[COMPONENT UPDATE] seq: {}", saved.getSeq());
        
		return saved;
	}

}
