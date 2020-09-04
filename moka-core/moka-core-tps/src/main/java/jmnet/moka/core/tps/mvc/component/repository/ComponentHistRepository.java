package jmnet.moka.core.tps.mvc.component.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;

public interface ComponentHistRepository extends JpaRepository<ComponentHist, Long> {

    /**
     * 컴포넌트Id로 히스토리를 조회
     * @param componentSeq 컴포넌트id
     * @param pageable Pageable
     * @return 히스토리 목록
     */
    @EntityGraph(attributePaths = {"dataset", "template"})
	public Page<ComponentHist> findByComponentSeq(Long componentSeq, Pageable pageable);
    
    @EntityGraph(attributePaths = {"dataset", "template"})
    public Optional<ComponentHist> findFirstByComponentSeqAndDataTypeOrderBySeqDesc(Long componentSeq, String dataType);
}
