package jmnet.moka.core.tps.mvc.pkg.repository;

import jmnet.moka.core.tps.mvc.pkg.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.pkg.entity.PackageMaster;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.repository
 * ClassName : PackagePepositorySupport
 * Created : 2021-03-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오후 4:13
 */
public interface PackageRepositorySupport {
    Page<PackageMaster> findAllPackage(PackageSearchDTO search);
}
