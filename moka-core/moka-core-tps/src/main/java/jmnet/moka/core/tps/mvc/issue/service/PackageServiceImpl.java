/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.mapper.IssueMapper;
import jmnet.moka.core.tps.mvc.issue.repository.PackageKeywordRepository;
import jmnet.moka.core.tps.mvc.issue.repository.PackageRepository;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Description: 이슈패키지 서비스impl
 *
 * @author ssc
 * @since 2021-03-22
 */
@Service
@Slf4j
public class PackageServiceImpl implements PackageService {

    private IssueMapper issueMapper;

    private final PackageRepository packageRepository;

    private final PackageKeywordRepository packageKeywordRepository;

    public PackageServiceImpl(PackageRepository packageRepository, IssueMapper issueMapper, PackageKeywordRepository packageKeywordRepository) {
        this.packageRepository = packageRepository;
        this.packageKeywordRepository = packageKeywordRepository;
        this.issueMapper = issueMapper;
    }

    @Override
    public List<PackageVO> findAllPackage(PackageSearchDTO search) {
        return issueMapper.findAll(search);
    }

    public Optional<PackageMaster> findByPkgSeq(Long pkgSeq) {
        return packageRepository.findByPkgSeq(pkgSeq);
    }

    @Override
    public Optional<PackageMaster> findByPkgTitle(String pkgTitle) {
        return packageRepository.findFirstByPkgTitle(pkgTitle);
    }

    @Transactional
    public PackageMaster insertPackage(PackageMaster packageMaster) {
        packageMaster
                .getPackageKeywords()
                .forEach(keyword -> keyword.setPackageMaster(packageMaster));
        return packageRepository.save(packageMaster);
    }

    @Transactional
    public PackageMaster updatePackage(PackageMaster packageMaster) {
        // 패키지에 키워드 삭제
        packageRepository
                .findByPkgSeq(packageMaster.getPkgSeq())
                .ifPresent(pkg -> pkg
                        .getPackageKeywords()
                        .forEach(packageKeywordRepository::delete));
        // 키워드 삭제후 다시 저장
        packageMaster
                .getPackageKeywords()
                .forEach(keyword -> keyword.setPackageMaster(packageMaster));
        return packageRepository.save(packageMaster);
    }
}
