package jmnet.moka.core.tps.mvc.pkg.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.pkg.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.pkg.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.pkg.vo.PackageSimpleVO;


/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.service
 * ClassName : PackageService
 * Created : 2021-03-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오후 3:28
 */
public interface PackageService {
    // public Page<PackageMaster> findAllPackage(PackageSearchDTO search);
    List<PackageSimpleVO> findAllPackage(PackageSearchDTO search);

    Optional<PackageMaster> findByPkgTitle(String pkgTitle);

    PackageMaster insertPackage(PackageMaster packageMaster);

    PackageMaster updatePackage(PackageMaster packageMaster);
}
