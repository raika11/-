/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.repository;

import jmnet.moka.core.tps.mvc.rcvarticle.entity.RcvArticleJiXml;
import jmnet.moka.core.tps.mvc.rcvarticle.entity.RcvArticleJiXmlPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RcvArticleJiXmlRepository
        extends JpaRepository<RcvArticleJiXml, RcvArticleJiXmlPK>, JpaSpecificationExecutor<RcvArticleJiXml>, RcvArticleJiXmlRepositorySupport {

}
