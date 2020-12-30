/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.code.ArticleSourceUseTypeCode;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceSearchDTO;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.articlesource.entity.RcvCodeConv;
import jmnet.moka.core.tps.mvc.articlesource.repository.ArticleSourceRepository;
import jmnet.moka.core.tps.mvc.articlesource.repository.RcvCodeConvRepository;
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
    private final RcvCodeConvRepository rcvCodeConvRepository;

    public ArticleSourceServiceImpl(ArticleSourceRepository articleSourceRepository, RcvCodeConvRepository rcvCodeConvRepository) {
        this.articleSourceRepository = articleSourceRepository;
        this.rcvCodeConvRepository = rcvCodeConvRepository;
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
    public List<ArticleSource> findAllArticleSourceByJoongang() {
        return findAllUsedArticleSource(ArticleSourceUseTypeCode.JOONGANG);
    }

    @Override
    public List<ArticleSource> findAllUsedArticleSource(ArticleSourceUseTypeCode useTypeCode) {
        return articleSourceRepository.findAllUsedSource(useTypeCode);
    }

    @Override
    public Page<ArticleSource> findAllArticleSource(ArticleSourceSearchDTO search) {
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

    @Override
    public Page<RcvCodeConv> findAllRcvCodeConv(String sourceCode, SearchDTO search) {
        return rcvCodeConvRepository.findByArticleSource_SourceCode(sourceCode, search.getPageable());
    }

    @Override
    public Optional<RcvCodeConv> findRcvCodeConvById(Long seqNo) {
        return rcvCodeConvRepository.findById(seqNo);
    }

    @Override
    public Boolean isDuplicatedFrCodeId(String sourceCode, String frCode) {
        Integer count = rcvCodeConvRepository.countByArticleSource_SourceCodeAndFrCode(sourceCode, frCode);
        return count > 0;
    }

    @Override
    public RcvCodeConv insertRcvCodeConv(RcvCodeConv rcvCodeConv) {
        return rcvCodeConvRepository.save(rcvCodeConv);
    }

    @Override
    public RcvCodeConv updateRcvCodeConv(RcvCodeConv rcvCodeConv) {
        return rcvCodeConvRepository.save(rcvCodeConv);
    }

    @Override
    public void deleteRcvCodeConv(Long seqNo) {
        rcvCodeConvRepository.deleteById(seqNo);
    }

    @Override
    public int countArticleSourceBySourceCode(String sourceCode) {
        return articleSourceRepository.countBySourceCode(sourceCode);
    }

    @Override
    public int countRcvCodeConvByFrCode(String sourceCode, String frCode) {
        return rcvCodeConvRepository.countByArticleSource_SourceCodeAndFrCode(sourceCode, frCode);
    }
}
