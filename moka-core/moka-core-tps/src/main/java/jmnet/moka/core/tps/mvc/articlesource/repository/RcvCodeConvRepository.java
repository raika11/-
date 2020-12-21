/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.repository;

import jmnet.moka.core.tps.mvc.articlesource.entity.RcvCodeConv;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RcvCodeConvRepository extends JpaRepository<RcvCodeConv, Long> {
    /**
     * 매핑목록 조회
     *
     * @param sourceCode 매체코드
     * @param pageable   페이징
     * @return 매핑목록
     */
    Page<RcvCodeConv> findByArticleSource_SourceCode(String sourceCode, Pageable pageable);

    /**
     * 매핑코드 중복여부 조회
     *
     * @param sourceCode 매체코드
     * @param frCode     CP코드
     * @return 동일 CP코드 갯수
     */
    Integer countByArticleSource_SourceCodeAndFrCode(String sourceCode, String frCode);
}
