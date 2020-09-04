package jmnet.moka.core.tps.mvc.page.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.page.entity.PageHist;

/**
 * <pre>
 * 페이지히스토리 Repository Support
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 3:52:39
 * @author jeon
 */
public interface PageHistRepositorySupport {

    public Page<PageHist> findList(HistSearchDTO search, Pageable pageable);
}
