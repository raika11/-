/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.repository;

import jmnet.moka.core.tps.mvc.article.entity.ArticleHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ArticleHistoryRepository extends JpaRepository<ArticleHistory, Long>, JpaSpecificationExecutor<ArticleHistory> {
    /**
     * 기사키별 히스토리 조회
     *
     * @param totalId  기사키
     * @param pageable 페이징
     * @return 히스토리목록
     */
    Page<ArticleHistory> findByTotalIdOrderBySeqNo(Long totalId, Pageable pageable);
}
