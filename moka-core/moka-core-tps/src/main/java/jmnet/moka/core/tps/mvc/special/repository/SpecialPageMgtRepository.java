/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.special.repository;

import jmnet.moka.core.tps.mvc.special.entity.SpecialPageMgt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SpecialPageMgtRepository extends JpaRepository<SpecialPageMgt, Long>, JpaSpecificationExecutor<SpecialPageMgt>, SpecialPageMgtRepositorySupport {

}
