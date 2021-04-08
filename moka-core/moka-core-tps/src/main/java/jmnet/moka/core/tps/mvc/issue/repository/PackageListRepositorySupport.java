/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.repository;

import jmnet.moka.core.tps.mvc.issue.dto.PackageListSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageList;
import org.springframework.data.domain.Page;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-02
 */
public interface PackageListRepositorySupport {
    /**
     * 패키지의 기사목록조회
     *
     * @param search 검색조건
     * @return 기사목록
     */
    Page<PackageList> findAll(PackageListSearchDTO search);
}
