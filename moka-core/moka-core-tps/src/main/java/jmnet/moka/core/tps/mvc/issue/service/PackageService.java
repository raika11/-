/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;


/**
 * Description: 이슈패키지 서비스
 *
 * @author ssc
 * @since 2021-03-22
 */
public interface PackageService {

    /**
     * 패키지목록 조회
     *
     * @param search 검색조건
     * @return 패키지목록
     */
    List<PackageVO> findAllPackage(PackageSearchDTO search);

    /**
     * 패키지명 조회
     *
     * @param pkgTitle 패키지명
     * @return 패키지
     */
    Optional<PackageMaster> findByPkgTitle(String pkgTitle);

    /**
     * 패키지 조회
     *
     * @param pkgSeq 패키지 일련번호
     * @return 패키지
     */
    Optional<PackageMaster> findByPkgSeq(Long pkgSeq);

    /**
     * 패키지 생성
     *
     * @param packageMaster 패키지 엔티티
     * @return 패키지
     */
    PackageMaster insertPackage(PackageMaster packageMaster);

    /**
     * 패키지 수정
     *
     * @param packageMaster 패키지 엔티티
     * @return 패키지
     */
    PackageMaster updatePackage(PackageMaster packageMaster);
}
