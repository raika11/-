package jmnet.moka.core.tps.mvc.component.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import org.springframework.stereotype.Repository;

@Repository
public interface ComponentRepository
        extends JpaRepository<Component, Long>, ComponentRepositorySupport {

    /**
     * 데이터셋아이디와 관련된 컴포넌트 목록 조회
     * 
     * @param datasetSeq 데이터셋ID
     * @param pageable Pageable
     * @return 컴포넌트 목록
     */
    @EntityGraph(attributePaths = {"dataset"}, type = EntityGraph.EntityGraphType.LOAD)
    public Page<Component> findByDataset_DatasetSeq(Long datasetSeq, Pageable pageable);

    /**
     * 데이터타입, 데이터셋아이디로 컴포넌트 조회
     * 
     * @param dataType 데이터타입
     * @param datasetSeq 데이터셋아이디
     * @return 컴포넌트
     */
    @EntityGraph(attributePaths = {"dataset"}, type = EntityGraph.EntityGraphType.LOAD)
    public Optional<Component> findByDataTypeAndDataset_DatasetSeq(String dataType,
            Long datasetSeq);

    /**
     * 데이터ID로 컴포넌트 몇개인지 카운트
     * 
     * @param datasetSeq 데이터셋ID
     * @return 카운트
     */
    public int countByDataset_DatasetSeq(Long datasetSeq);

    /**
     * 도메인아이디와 관련된 컴포넌트수
     * 
     * @param domainId 도메인아이디
     * @return 컴포넌트 수
     */
    public int countByDomain_DomainId(String domainId);

    /**
     * 도메인아이디와 관련된 컴포넌트 목록 조회
     * 
     * @param domainId 도메인아이디
     * @param pageable Pageable
     * @return 컴포넌트 목록
     */
    public Page<Component> findByDomain_DomainId(String domainId, Pageable pageable);

    /**
     * 템플릿SEQ와 관련된 컴포넌트 목록 조회
     * 
     * @param templateSeq 템플릿ID
     * @param pageable Pageable
     * @return 컴포넌트 목록
     */
    @EntityGraph(attributePaths = {"template"}, type = EntityGraph.EntityGraphType.LOAD)
    public Page<Component> findByTemplate_TemplateSeq(Long templateSeq, Pageable pageable);
}
