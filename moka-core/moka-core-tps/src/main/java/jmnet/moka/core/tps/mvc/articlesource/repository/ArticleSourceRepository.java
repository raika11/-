/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.repository;

import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Description: 기사정보
 *
 * @author ssc
 * @since 2020-11-12
 */
@Repository
public interface ArticleSourceRepository extends JpaRepository<ArticleSource, String>, ArticleSourceRepositorySupport {

    /**
     * 매체코드 사용중인 매체 조회
     *
     * @param sourceCode 매체코드
     * @return 사용중인 매체 갯수
     */
    Integer countBySourceCode(String sourceCode);

}
