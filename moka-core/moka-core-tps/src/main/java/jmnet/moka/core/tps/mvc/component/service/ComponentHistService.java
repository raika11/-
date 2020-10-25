package jmnet.moka.core.tps.mvc.component.service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;

public interface ComponentHistService {
    
    /**
     * 컴포넌트Id로 히스토리 목록 조회
     * @param componentSeq 컴포넌트Id
     * @param pageable Pageable
     * @return 히스토리
     */
    public Page<ComponentHist> findAllComponentHist(Long componentSeq, Pageable pageable);
    
    /**
     * 컴포넌트 히스토리 등록
     * @param history 컴포넌트 히스토리
     * @return 히스토리
     * @throws Exception 에러
     */
    public ComponentHist insertComponentHist(ComponentHist history) throws Exception;
    
    /**
     * 컴포넌트 히스토리 등록
     * @param component 컴포넌트
     * @return 히스토리
     * @throws Exception 에러
     */
    public ComponentHist insertComponentHist(Component component) throws Exception;
    
    /**
     * 여러개의 히스토리를 한번에 등록
     * @param maybeHistories 히스토리 리스트 또는 컴포넌트 리스트
     * @return 히스토리 리스트
     * @throws Exception 에러
     */
    public List<ComponentHist> insertComponentHistList(List<?> maybeHistories) throws Exception;
    
    public Optional<ComponentHist> findComponentHistByComponentSeqAndDataType(Long componentSeq, String dataType) throws Exception;

}
