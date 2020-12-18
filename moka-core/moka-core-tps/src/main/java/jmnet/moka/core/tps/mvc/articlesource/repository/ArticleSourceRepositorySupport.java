/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.repository;

import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.code.ArticleSourceUseTypeCode;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import org.springframework.data.domain.Page;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-13
 */
public interface ArticleSourceRepositorySupport {
    /**
     * 페이지편집 매체목록조회
     *
     * @param deskingSourceList 매체ID목록(구분자,)
     * @return 매체목록
     */
    List<ArticleSource> findAllArticleSourceByDesking(String[] deskingSourceList);

    /**
     * 타입별 매체목록 조회
     *
     * @param useTypeCode 타입
     * @return 매체목록
     */
    List<ArticleSource> findAllUsedSource(ArticleSourceUseTypeCode useTypeCode);

    /**
     * 매체목록 조회
     *
     * @param search 검색조건
     * @return 매체목록
     */
    Page<ArticleSource> findAllArticleSource(SearchDTO search);
}
