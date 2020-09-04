package jmnet.moka.core.tps.mvc.component.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class ComponentWorkServiceImpl implements ComponentWorkService {
	private static final Logger logger = LoggerFactory.getLogger(ComponentWorkServiceImpl.class);

    @Autowired
    private ComponentWorkRepository componentWorkRepository;
    
    @Autowired
    private MessageByLocale messageByLocale;

    @Override
    public Optional<ComponentWork> findBySeq(Long seq) {
        return componentWorkRepository.findById(seq);
    }

	@Override
	public ComponentWork updateComponent(ComponentWork component) throws NoDataException, Exception {
		String message = messageByLocale.get("tps.desking.component.error.work.noContent");
		ComponentWork orgComponent = this.findBySeq(component.getSeq())
                .orElseThrow(() -> new NoDataException(message));
		
		orgComponent.setSnapshotYn(component.getSnapshotYn());
		orgComponent.setSnapshotBody(component.getSnapshotBody());
		orgComponent.setTemplate(component.getTemplate());
		
		// 컴포넌트 업데이트
		ComponentWork saved = componentWorkRepository.save(orgComponent);
        logger.debug("[COMPONENT UPDATE] seq: {}", saved.getSeq());
        
		return saved;
	}

}
