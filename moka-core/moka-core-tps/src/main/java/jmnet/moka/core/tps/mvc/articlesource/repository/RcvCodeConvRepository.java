/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.repository;

import jmnet.moka.core.tps.mvc.articlesource.entity.RcvCodeConv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RcvCodeConvRepository extends JpaRepository<RcvCodeConv, Long>, JpaSpecificationExecutor<RcvCodeConv> {

}
