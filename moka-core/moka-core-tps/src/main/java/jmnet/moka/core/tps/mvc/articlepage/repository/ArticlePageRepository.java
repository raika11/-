/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlepage.repository;

import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticlePageRepository extends JpaRepository<ArticlePage, Long>, ArticlePageRepositorySupport {
    /**
     * 도메인아이디와 관련된 기사페이지수
     *
     * @param domainId 도메인아이디
     * @return 기사페이지수
     */
    int countByDomain_DomainId(String domainId);

    /**
     * 기사 유형별 건수 조회
     *
     * @param domainId 도메인ID
     * @param artType  기사 유형
     * @return 건수
     */
    int countByDomainDomainIdAndArtType(String domainId, String artType);
}
