/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.repository;

import jmnet.moka.core.tps.mvc.rcvarticle.entity.RcvArticleCode;
import jmnet.moka.core.tps.mvc.rcvarticle.entity.RcvArticleCodePK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RcvArticleCodeRepository
        extends JpaRepository<RcvArticleCode, RcvArticleCodePK>, JpaSpecificationExecutor<RcvArticleCode>, RcvArticleCodeRepositorySupport {

}
