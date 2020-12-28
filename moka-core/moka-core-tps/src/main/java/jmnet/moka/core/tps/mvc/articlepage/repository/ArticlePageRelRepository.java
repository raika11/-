/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlepage.repository;

import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePageRel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticlePageRelRepository extends JpaRepository<ArticlePageRel, Long>, ArticlePageRelRepositorySupport {

}
