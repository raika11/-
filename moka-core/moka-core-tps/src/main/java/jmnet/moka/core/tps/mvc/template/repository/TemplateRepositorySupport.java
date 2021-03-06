package jmnet.moka.core.tps.mvc.template.repository;

import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 * 템플릿 Repository Support
 * 2020. 4. 21. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 21. 오후 4:38:14
 */
public interface TemplateRepositorySupport {

    /**
     * <pre>
     * 템플릿 목록을 찾는다
     * </pre>
     *
     * @param search   검색 조건
     * @param pageable Pageable
     * @return 템플릿 목록
     */
    public Page<Template> findList(TemplateSearchDTO search, Pageable pageable);
}
