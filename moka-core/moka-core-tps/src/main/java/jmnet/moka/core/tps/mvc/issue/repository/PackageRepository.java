package jmnet.moka.core.tps.mvc.issue.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.repository
 * ClassName : PackageRepository
 * Created : 2021-03-19
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오후 3:24
 */
public interface PackageRepository extends JpaRepository<PackageMaster, Long>, /* JpaSpecificationExecutor<MokaPackage>,*/ PackageRepositorySupport {
    Optional<PackageMaster> findFirstByPkgTitle(String pkgTitle);

    Optional<PackageMaster> findByPkgSeq(Long pkgSeq);
}
