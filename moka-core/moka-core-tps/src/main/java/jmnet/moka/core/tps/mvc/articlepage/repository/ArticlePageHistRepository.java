/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlepage.repository;

import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePageHist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ArticlePageHistRepository extends JpaRepository<ArticlePageHist, Integer>, JpaSpecificationExecutor<ArticlePageHist> {

}
