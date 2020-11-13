/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.repository;

import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Description: 기사정보
 *
 * @author ssc
 * @since 2020-11-12
 */
@Repository
public interface ArticleBasicRepository extends JpaRepository<ArticleBasic, Long> {
}
