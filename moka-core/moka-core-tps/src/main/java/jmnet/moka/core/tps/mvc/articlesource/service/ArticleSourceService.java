/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.code.ArticleSourceUseTypeCode;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import org.springframework.data.domain.Page;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-18
 */
public interface ArticleSourceService {

    /**
     * 페이지편집 매체목록 조회
     *
     * @param deskingSourceList 조회할 매체아이디 목록
     * @return ArticleSource 목록
     */
    List<ArticleSource> findAllArticleSourceByDesking(String[] deskingSourceList);

    /**
     * 벌크에서 사용하는 소스 코드 목록 조회
     *
     * @return ArticleSource목록
     */
    List<ArticleSource> findAllArticleSourceByBulk();

    /**
     * 각 사용여부 코드에 따른 소스 코드 목록 조회
     *
     * @param useTypeCode 소스 코드 사용 유형 코드
     * @return ArticleSource목록
     */
    List<ArticleSource> findAllUsedArticleSource(ArticleSourceUseTypeCode useTypeCode);

    /**
     * 매체목록 조회
     *
     * @param search 검색조건
     * @return 매체목록
     */
    Page<ArticleSource> findAllArticleSource(SearchDTO search);

    /**
     * 매체 상세조회
     *
     * @param sourceCode 매체코드
     * @return 매체정보
     */
    Optional<ArticleSource> findAricleSourceById(String sourceCode);

    /**
     * 매체 등록
     *
     * @param articleSource 매체정보
     * @return 등록된 매체정보
     */
    ArticleSource insertArticleSource(ArticleSource articleSource);

    /**
     * 매체코드 중복여부
     *
     * @param sourceCode 매체코드
     * @return 중복시  true
     */
    Boolean isDuplicatedId(String sourceCode);

    /**
     * 매체 수정
     *
     * @param articleSource 매체정보
     * @return 수정된 매체정보
     */
    ArticleSource updateArticleSource(ArticleSource articleSource);
}
