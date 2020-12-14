/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.repository;

import java.util.List;
import jmnet.moka.core.tps.common.code.ArticleSourceUseTypeCode;
import jmnet.moka.core.tps.mvc.article.entity.ArticleSource;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-13
 */
public interface ArticleSourceRepositorySupport {
    List<ArticleSource> findAllSourceByDesking(String[] deskingSourceList);

    List<ArticleSource> findAllUsedSource(ArticleSourceUseTypeCode useTypeCode);
}
