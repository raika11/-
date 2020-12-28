package jmnet.moka.core.tps.mvc.page.repository;

import jmnet.moka.core.tps.mvc.page.entity.PageRel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * 페이지릴레이션 Repository
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 4:00:15
 */
@Repository
public interface PageRelRepository extends JpaRepository<PageRel, Long>, PageRelRepositorySupport {

    /**
     * 관련아이템 삭제
     *
     * @param pageSeq 페이지순번
     */
    //    @Transactional
    //    @Modifying
    //    @Query("DELETE FROM PageRel r WHERE r.page.pageSeq = :pageSeq")
    //    int deleteByPageSeq(@Param("pageSeq") Long pageSeq);

}
