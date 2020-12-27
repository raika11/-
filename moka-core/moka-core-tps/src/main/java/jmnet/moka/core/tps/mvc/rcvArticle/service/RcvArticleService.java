/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleBasic;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleBasicVO;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleReporterVO;

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

    //    /**
    //     * 수신기사의 분류코드 목록 조회
    //     *
    //     * @param rid        수신기사키
    //     * @param sourceCode 수신기사 매체코드
    //     * @return 분류코드 목록
    //     */
    //    List<String> findAllRcvArticleCode(Long rid, String sourceCode);

    /**
     * 수신기사 부가정보 조회(분류코드,기자,키워드)
     *
     * @param rcvArticleDto 수신기사정보
     */
    void findRcvArticleInfo(RcvArticleBasicDTO rcvArticleDto);

    /**
     * 수신기사를 등록기사로 등록
     *
     * @param rcvArticleBasic 수신기사정보
     * @param reporterList    기자목록
     * @param categoryList    분류코드목록
     * @param tagList         태그목록
     * @return 등록성공여부
     */
    boolean insertRcvArticleIud(RcvArticleBasic rcvArticleBasic, List<RcvArticleReporterVO> reporterList, List<String> categoryList,
            List<String> tagList);
}
