package jmnet.moka.core.tps.mvc.template.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;

/**
 * <pre>
 * 템플릿 히스토리 Repository
 * 2020. 1. 15. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 1. 15. 오후 5:30:35
 * @author jeon
 */
public interface TemplateHistRepository extends JpaRepository<TemplateHist, Long>, TemplateHistRepositorySupport {

    /**
     * <pre>
     * 템플릿아이디로 템플릿히스토리 목록을 찾는다
     * </pre>
     * 
     * @param templateSeq 템플릿아이디
     * @param pageable Pageable
     * @return 템플릿 히스토리 목록
     */
    public Page<TemplateHist> findByTemplate_TemplateSeq(Long templateSeq, Pageable pageable);

    /**
     * <pre>
     * 아이디로 템플릿히스토리를 찾는다
     * </pre>
     * 
     * @param seq 아이디
     * @return 템플릿히스토리
     */
    public Optional<TemplateHist> findBySeq(Long seq);
}
