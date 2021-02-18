/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.repository;

import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleJiSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleJiXml;
import org.springframework.data.domain.Page;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-02-18
 */
public interface RcvArticleJiXmlRepositorySupport {
    /**
     * 조판목록조회
     *
     * @param search 검색조건
     * @return 조판목록
     */
    Page<RcvArticleJiXml> findList(RcvArticleJiSearchDTO search);
}
