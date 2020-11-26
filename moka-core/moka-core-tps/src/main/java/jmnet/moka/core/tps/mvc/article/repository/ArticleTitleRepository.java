/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.article.entity.ArticleTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleTitleRepository extends JpaRepository<ArticleTitle, Long> {
    Optional<ArticleTitle> findByTotalIdAndTitleDiv(Long totalId, String titleDiv);
}
