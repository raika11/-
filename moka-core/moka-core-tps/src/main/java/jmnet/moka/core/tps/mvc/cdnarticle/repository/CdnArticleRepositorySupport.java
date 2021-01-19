/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.repository;

import jmnet.moka.core.tps.mvc.cdnarticle.dto.CdnArticleSearchDTO;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-19
 */
public interface CdnArticleRepositorySupport {
    /**
     * CDN기사목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return CDN기사목록
     */
    Page<CdnArticle> findList(CdnArticleSearchDTO search, Pageable pageable);
}
