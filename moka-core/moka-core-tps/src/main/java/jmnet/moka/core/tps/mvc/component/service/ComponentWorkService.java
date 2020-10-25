package jmnet.moka.core.tps.mvc.component.service;

import java.util.Optional;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.component.entity.ComponentWork;

/**
 * ComponentWork Service
 * 
 * @author jeon0525
 *
 */
public interface ComponentWorkService {

    /**
     * <pre>
      * work컴포넌트 조회
     * </pre>
     * 
     * @param seq 순번
     * @return work컴포넌트
     */
    Optional<ComponentWork> findComponentWorkBySeq(Long seq);

    /**
     * work컴포넌트 업데이트
     * 
     * @param component 업데이트할 컴포넌트
     * @return 업데이트된 컴포넌트
     * @throws NoDataException 데이터없음
     * @throws Exception 예외
     */
    public ComponentWork updateComponentWork(ComponentWork component) throws NoDataException, Exception;

}
