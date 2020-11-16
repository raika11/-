package jmnet.moka.core.tps.mvc.articlepage.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePageRel;
import jmnet.moka.core.tps.mvc.component.entity.Component;

/**
 * <pre>
 * 기사페이지릴레이션 Repository Support
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 4:01:02
 * @author jeon
 */
public interface ArticlePageRelRepositorySupport {

    /**
     * <pre>
      * 컴포넌트 템플릿변경시, 관련아이템 템플릿 수정
     * </pre>
     * 
     * @param component 변경된 컴포넌트
     */
    void updateRelTemplates(Component component);

    /**
     * <pre>
     * 컴포넌트 데이타셋변경시, 관련아이템 데이타셋 수정
     * </pre>
     * 
     * @param newComponent 변경된 컴포넌트
     * @param orgComponent 원본 컴포넌트
     */
    void updateRelDatasets(Component newComponent, Component orgComponent);

    /**
     * <pre>
     * 관련아이템 조회
     * </pre>
     * 
     * @param relType 관련아이템타입
     * @param relSeq 관련아이템 아이디
     * @return
     */
    List<ArticlePageRel> findList(String relType, Long relSeq);

}
