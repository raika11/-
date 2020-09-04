package jmnet.moka.core.tps.mvc.container.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.container.entity.ContainerRel;

/**
 * 컨테이너 관련아이템
 * 
 * @author ohtah
 *
 */
public interface ContainerRelRepositorySupport {

    /**
     * <pre>
     * 컴포넌트 템플릿변경시, 관련아이템 템플릿 수정
     * </pre>
     * 
     * @param component 변경된 컴포넌트
     */
    public void updateRelTemplates(Component component);

    /**
     * <pre>
     * 컴포넌트 데이타셋변경시, 관련아이템 데이타셋 수정
     * </pre>
     * 
     * @param newComponent 변경된 컴포넌트
     * @param orgComponent 원본 컴포넌트
     */
    public void updateRelDatasets(Component newComponent, Component orgComponent);

    /**
     * <pre>
     * 관련아이템 조회
     * </pre>
     * 
     * @param relType 관련아이템타입
     * @param relSeq 관련아이템 아이디
     * @return 컨테이너 관련아이템 목록
     */
    public List<ContainerRel> findList(String relType, Long relSeq);
    
}
