package jmnet.moka.core.tps.mvc.articlePackage.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.articlePackage.entity.ArticlePackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.repository
 * ClassName : ArticlePackageRepository
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 4:11
 */
public interface ArticlePackageRepository
        extends JpaRepository<ArticlePackage, Long>, JpaSpecificationExecutor<ArticlePackage>, ArticlePackageRepositorySupport {

    /**
     * 패키지 타이틀로 기사 패키지 조회
     *
     * @param pkgTitle 패키지 타이틀
     * @return
     */
    Optional<ArticlePackage> findByPkgTitle(String pkgTitle);
}