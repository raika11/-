package jmnet.moka.core.tps.mvc.page.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.page.dto.PageSearchDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 * 페이지 Repository Support
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 4:14:29
 */
public interface PageRepositorySupport {

    /**
     * 도메인별 페이지목록. 페이징X
     *
     * @param domainId 도메인아이디
     * @return 페이지목록
     */
    public List<Page> findByDomainId(String domainId);

    /**
     * 동일한 pageServiceUrl조회
     *
     * @param pageUrl  검사할 페이지 url(ex:/news/politics)
     * @param domainId 도메인아이디
     * @return 동일한 페이지 목록
     */
    public List<Page> findByPageUrl(String pageUrl, String domainId);

    /**
     * 페이지목록. 페이징O
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 페이지목록
     */
    public org.springframework.data.domain.Page<Page> findList(PageSearchDTO search, Pageable pageable);

}
