/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.repository;

import jmnet.moka.core.tps.mvc.rcvarticle.entity.RcvArticleBasic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RcvArticleBasicRepository extends JpaRepository<RcvArticleBasic, Long>, JpaSpecificationExecutor<RcvArticleBasic> {

}
