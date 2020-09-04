package jmnet.moka.core.tps.mvc.skin.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.skin.entity.SkinRel;

public interface SkinRelRepositorySupport {

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
     * @return
     */
    public List<SkinRel> findList(String relType, Long relSeq);
}
