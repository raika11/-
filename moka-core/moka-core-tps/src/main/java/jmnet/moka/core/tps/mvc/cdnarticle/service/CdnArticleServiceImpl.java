/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.cdnarticle.dto.CdnArticleSearchDTO;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import jmnet.moka.core.tps.mvc.cdnarticle.repository.CdnArticleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-19
 */
@Service
@Slf4j
public class CdnArticleServiceImpl implements CdnArticleService {

    @Autowired
    private CdnArticleRepository cdnArticleRepository;

    @Override
    public Page<CdnArticle> findAllCdnArticle(CdnArticleSearchDTO search) {
        return cdnArticleRepository.findList(search, search.getPageable());
    }

    @Override
    public Optional<CdnArticle> findCdnArticleById(Long totalId) {
        return cdnArticleRepository.findById(totalId);
    }

    @Override
    public CdnArticle insertCdnArticle(CdnArticle article) {
        return cdnArticleRepository.save(article);
    }

    @Override
    public CdnArticle updateCdnArticle(CdnArticle article) {
        return cdnArticleRepository.save(article);
    }
}
