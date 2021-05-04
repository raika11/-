package jmnet.moka.core.tps.mvc.articlePackage.repository;

import jmnet.moka.core.tps.mvc.articlePackage.dto.ArticlePackageSearchDTO;
import jmnet.moka.core.tps.mvc.articlePackage.entity.ArticlePackage;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.repository
 * ClassName : ArticlePackageRepositorySupport
 * Created : 2021-05-04 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-04 오전 9:43
 */
public interface ArticlePackageRepositorySupport {
    /**
     * 기사패키지 목록 조회
     *
     * @param search 조회조건
     * @return
     */
    Page<ArticlePackage> findAllArticlePackage(ArticlePackageSearchDTO search);
}
