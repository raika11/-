/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.repository;

import jmnet.moka.core.tps.mvc.area.entity.AreaComp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AreaCompRepository extends JpaRepository<AreaComp, Integer>, JpaSpecificationExecutor<AreaComp> {

}
