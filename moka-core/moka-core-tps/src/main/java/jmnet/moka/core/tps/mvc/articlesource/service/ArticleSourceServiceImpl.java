/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.code.ArticleSourceUseTypeCode;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.articlesource.repository.ArticleSourceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-18
 */
@Service
@Slf4j
public class ArticleSourceServiceImpl implements ArticleSourceService {

    private final ArticleSourceRepository articleSourceRepository;

    public ArticleSourceServiceImpl(ArticleSourceRepository articleSourceRepository) {
        this.articleSourceRepository = articleSourceRepository;
    }

    @Override
    public List<ArticleSource> findAllArticleSourceByDesking(String[] deskingSourceList) {
        return articleSourceRepository.findAllArticleSourceByDesking(deskingSourceList);
    }

    @Override
    public List<ArticleSource> findAllArticleSourceByBulk() {
        return findAllUsedArticleSource(ArticleSourceUseTypeCode.BULK);
    }

    @Override
    public List<ArticleSource> findAllUsedArticleSource(ArticleSourceUseTypeCode useTypeCode) {
        return articleSourceRepository.findAllUsedSource(useTypeCode);
    }

    @Override
    public Page<ArticleSource> findAllArticleSource(SearchDTO search) {
        return articleSourceRepository.findAllArticleSource(search);
    }

    @Override
    public Optional<ArticleSource> findAricleSourceById(String sourceCode) {
        return articleSourceRepository.findById(sourceCode);
    }

    @Override
    public ArticleSource insertArticleSource(ArticleSource articleSource) {
        return articleSourceRepository.save(articleSource);
    }

    @Override
    public Boolean isDuplicatedId(String sourceCode) {
        Optional<ArticleSource> maybeArticleSource = this.findAricleSourceById(sourceCode);
        return maybeArticleSource.isPresent() ? true : false;
    }

    @Override
    public ArticleSource updateArticleSource(ArticleSource articleSource) {
        return articleSourceRepository.save(articleSource);
    }

}
