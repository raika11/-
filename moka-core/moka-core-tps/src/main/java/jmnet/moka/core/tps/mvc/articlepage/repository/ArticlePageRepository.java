/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlepage.repository;

import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ArticlePageRepository extends JpaRepository<ArticlePage, Long>, ArticlePageRepositorySupport {
    /**
     * 도메인아이디와 관련된 기사페이지수
     * @param domainId 도메인아이디
     * @return 기사페이지수
     */
    public int countByDomain_DomainId(String domainId);
}
