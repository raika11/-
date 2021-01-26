/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.cdnarticle.dto.CdnArticleSearchDTO;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import org.springframework.data.domain.Page;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-19
 */
public interface CdnArticleService {
    /**
     * CDN기사목록 조회
     *
     * @param search 검색조건
     * @return CDN기사목록
     */
    Page<CdnArticle> findAllCdnArticle(CdnArticleSearchDTO search);

    /**
     * CDN기사 상세조회
     *
     * @param totalId 기사키
     * @return 기사정보
     */
    Optional<CdnArticle> findCdnArticleById(Long totalId);

    /**
     * CDN기사 등록/수정
     *
     * @param article 기사정보
     * @return 등록/수정 된 CDN 기사
     */
    CdnArticle saveCdnArticle(CdnArticle article)
            throws Exception;

    /**
     * CDN기사 캐시삭제
     *
     * @param totalId 기사키
     */
    void clearCacheCdnArticle(Long totalId);

    /**
     * 사용여부에 따른 CDN기사목록
     *
     * @param usedYn 사용여부
     * @return CDN기사목록
     */
    List<CdnArticle> findUseCdnArticle(String usedYn);
}
