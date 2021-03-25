package jmnet.moka.core.tps.mvc.pkg.repository;

import jmnet.moka.core.tps.mvc.pkg.entity.PackageKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.repository
 * ClassName : PackageKeywordRepository
 * Created : 2021-03-24
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-24 오후 3:24
 */
public interface PackageKeywordRepository extends JpaRepository<PackageKeyword, Long>, JpaSpecificationExecutor<PackageKeyword> {
}
