package jmnet.moka.core.tps.mvc.component.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.component.entity.ComponentAd;

/**
 * ComponentAd Repository
 * @author 전현지
 *
 */
public interface ComponentAdRepository extends JpaRepository<ComponentAd, Long> {

    /**
     * 컴포넌트ID로 컴포넌트광고 조회
     * @param componentSeq 컴포넌트ID
     * @return 컴포넌트광고 목록
     */
    public List<ComponentAd> findByComponentSeqOrderByListParagraph(Long componentSeq);
    
    /**
     * 컴포넌트ID로 컴포넌트광고 삭제
     * @param componentSeq 컴포넌트ID
     */
    public void deleteByComponentSeq(Long componentSeq);
}
