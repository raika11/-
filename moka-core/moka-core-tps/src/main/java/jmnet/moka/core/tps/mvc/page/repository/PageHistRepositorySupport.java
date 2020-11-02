package jmnet.moka.core.tps.mvc.page.repository;

import jmnet.moka.core.tps.mvc.history.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.page.entity.PageHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 * 페이지히스토리 Repository Support
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 3:52:39
 */
public interface PageHistRepositorySupport {

    public Page<PageHist> findList(HistSearchDTO search, Pageable pageable);
}
