package jmnet.moka.core.tps.mvc.template.repository;

import jmnet.moka.core.tps.mvc.template.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * 템플릿 Repository
 * 2020. 1. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 1. 14. 오후 1:55:12
 */
@Repository
public interface TemplateRepository extends JpaRepository<Template, Long>, TemplateRepositorySupport {

    /**
     * 도메인아이디와 관련된 템플릿 목록 조회
     * @param domainId 도메인아이디
     * @param pageable 페이지
     * @return 템플릿 목록
     */
    //    public Page<Template> findByDomain_DomainId(String domainId, Pageable pageable);

    /**
     * 도메인아이디와 관련된 템플릿수
     *
     * @param domainId 도메인아이디
     * @return 템플릿수
     */
    public int countByDomain_DomainId(String domainId);
}
