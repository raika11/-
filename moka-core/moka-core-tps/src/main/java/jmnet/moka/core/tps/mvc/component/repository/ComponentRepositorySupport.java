package jmnet.moka.core.tps.mvc.component.repository;

import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 컴포넌트 Repository Support
 *
 * @author jeon
 */
public interface ComponentRepositorySupport {

    /**
     * 컴포넌트 목록을 조회한다
     *
     * @param search   검색 조건
     * @param pageable Pageable
     * @return 컴포넌트 목록
     */
    Page<Component> findList(ComponentSearchDTO search, Pageable pageable);

    /**
     * 템플릿ID로 컴포넌트 목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이지
     * @return 컴포넌트목록
     */
    Page<Component> findListByTemplate(RelationSearchDTO search, Pageable pageable);

    /**
     * 데이터셋ID로 컴포넌트 목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이지
     * @return 컴포넌트목록
     */
    Page<Component> findListByDataset(RelationSearchDTO search, Pageable pageable);
}
