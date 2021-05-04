package jmnet.moka.core.tps.mvc.articlePackage.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.articlePackage.entity.ArticlePackageKwd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.repository
 * ClassName : ArticlePackageKwdRepository
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 5:47
 */
public interface ArticlePackageKwdRepository extends JpaRepository<ArticlePackageKwd, Long>, JpaSpecificationExecutor<ArticlePackageKwd> {

    /**
     * 패키지 일련번호별 키워드 조회
     *
     * @param pkgSeq 패키지 일련번호별
     * @return
     */
    List<ArticlePackageKwd> findByPkgSeq(Long pkgSeq);
}
