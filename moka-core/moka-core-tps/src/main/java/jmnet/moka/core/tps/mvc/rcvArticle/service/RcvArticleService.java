/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleBasic;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleBasicVO;

/**
 * Description: 수신기사 서비스
 *
 * @author ssc
 * @since 2020-12-22
 */
public interface RcvArticleService {
    /**
     * 수신기사목록 조회(mybatis)
     *
     * @param search 검색조건
     * @return 수신기사목록
     */
    List<RcvArticleBasicVO> findAllRcvArticleBasic(RcvArticleSearchDTO search);

    /**
     * 수신기사 상세조죄
     *
     * @param rid 기사키
     * @return 수신기사 정보
     */
    Optional<RcvArticleBasic> findRcvArticleBasicById(Long rid);

    /**
     * 수신기사의 분류코드 목록 조회
     *
     * @param rid        수신기사키
     * @param sourceCode 수신기사 매체코드
     * @return 분류코드 목록
     */
    List<String> findAllRcvArticleCode(Long rid, String sourceCode);
}
