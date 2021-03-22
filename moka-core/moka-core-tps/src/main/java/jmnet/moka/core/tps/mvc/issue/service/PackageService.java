/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
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
}
