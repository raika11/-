package jmnet.moka.core.tps.mvc.component.repository;

import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComponentHistRepository extends JpaRepository<ComponentHist, Long>, ComponentHistRepositorySupport {

    /**
     * 컴포넌트Id로 히스토리를 조회
     *
     * @param componentSeq 컴포넌트id
     * @param pageable     Pageable
     * @return 히스토리 목록
     */
    @EntityGraph(attributePaths = {"dataset", "template", "editFormPart"})
    public Page<ComponentHist> findByComponentSeq(Long componentSeq, Pageable pageable);

    //    @EntityGraph(attributePaths = {"dataset", "template"})
    //    Optional<ComponentHist> findFirstByComponentSeqAndDataTypeOrderBySeqDesc(Long componentSeq, String dataType);
}
