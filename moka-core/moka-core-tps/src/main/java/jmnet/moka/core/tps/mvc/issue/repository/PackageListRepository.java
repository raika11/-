/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.repository;

import jmnet.moka.core.tps.mvc.issue.entity.PackageList;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Description: 패키지 기사
 *
 * @author ssc
 * @since 2021-04-02
 */
public interface PackageListRepository extends JpaRepository<PackageList, Long>, PackageListRepositorySupport {

}
