/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.repository;

import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CdnArticleRepository extends JpaRepository<CdnArticle, Long>, JpaSpecificationExecutor<CdnArticle>, CdnArticleRepositorySupport {

}
