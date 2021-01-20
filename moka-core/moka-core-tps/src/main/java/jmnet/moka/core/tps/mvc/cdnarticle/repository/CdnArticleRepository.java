/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CdnArticleRepository extends JpaRepository<CdnArticle, Long>, JpaSpecificationExecutor<CdnArticle>, CdnArticleRepositorySupport {
    /**
     * 사용여부에 따른, CDN기사목록 전체조회
     *
     * @param usedYn 사용여부
     * @return CDN기사목록
     */
    List<CdnArticle> findAllByUsedYn(String usedYn);
}
