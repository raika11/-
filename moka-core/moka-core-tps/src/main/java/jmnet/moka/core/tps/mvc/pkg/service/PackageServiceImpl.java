package jmnet.moka.core.tps.mvc.pkg.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.pkg.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.pkg.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.pkg.mapper.PackageMapper;
import jmnet.moka.core.tps.mvc.pkg.repository.PackageKeywordRepository;
import jmnet.moka.core.tps.mvc.pkg.repository.PackageRepository;
import jmnet.moka.core.tps.mvc.pkg.vo.PackageSimpleVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.service
 * ClassName : PackageServiceImpl
 * Created : 2021-03-19
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오후 3:31
 */
@Service
@Slf4j
public class PackageServiceImpl implements PackageService {

    private final PackageRepository packageRepository;

    private final PackageKeywordRepository packageKeywordRepository;

    private final PackageMapper packageMapper;

    public PackageServiceImpl(PackageRepository packageRepository, PackageMapper packageMapper, PackageKeywordRepository packageKeywordRepository) {
        this.packageRepository = packageRepository;
        this.packageKeywordRepository = packageKeywordRepository;
        this.packageMapper = packageMapper;
    }

    public List<PackageSimpleVO> findAllPackage(PackageSearchDTO search) {
        return packageMapper.findAllPackage(search);
    }

    @Override
    public Optional<PackageMaster> findByPkgTitle(String pkgTitle) {
        return packageRepository.findFirstByPkgTitle(pkgTitle);
    }

    @Transactional
    public PackageMaster insertPackage(PackageMaster packageMaster) {
        PackageMaster packageResult = packageRepository.save(packageMaster);
        //        packageMaster
        //                .getPackageKeywords()
        //                .forEach(keyword -> {
        //                    keyword.setPackageMaster(packageResult);
        //                    log.debug("test {}", keyword
        //                            .getPackageMaster()
        //                            .getPkgSeq());
        //                    packageKeywordRepository.save(keyword);
        //                });

        //        return packageRepository
        //                .findByPkgSeq(packageResult.getPkgSeq())
        //                .orElseThrow();
        return packageResult;
    }

    @Override
    public PackageMaster updatePackage(PackageMaster packageMaster) {
        return null;
    }

    //    @Override
    //    public Page<PackageMaster> findAllPackage(PackageSearchDTO search) {
    //        return packageRepository.findAllPackage(search);
    //    }
}
