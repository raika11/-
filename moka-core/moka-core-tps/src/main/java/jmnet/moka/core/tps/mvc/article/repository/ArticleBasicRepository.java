/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.repository;

import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * ArticleBasicRepository
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.article.repository
 * ClassName : ArticleBasicRepository
 * Created : 2020-12-01 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-01 13:07
 */
@Repository
public interface ArticleBasicRepository extends JpaRepository<ArticleBasic, Long>, ArticleBasicRepositorySupport {

}
