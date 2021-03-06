package jmnet.moka.core.tps.mvc.page.repository;

import jmnet.moka.core.tps.mvc.page.entity.PageHist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * 페이지히스토리 Repository
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 3:51:44
 */
@Repository
public interface PageHistRepository extends JpaRepository<PageHist, Long> {

}
