/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
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
}
