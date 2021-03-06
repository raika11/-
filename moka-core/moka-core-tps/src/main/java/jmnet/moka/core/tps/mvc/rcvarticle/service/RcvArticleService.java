/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.rcvarticle.dto.RcvArticleBasicDTO;
import jmnet.moka.core.tps.mvc.rcvarticle.dto.RcvArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.rcvarticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvarticle.entity.RcvArticleBasic;
import jmnet.moka.core.tps.mvc.rcvarticle.vo.RcvArticleBasicVO;

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
     * @param updateDto       기자목록,분류코드목록,태그목록
     * @return 등록성공여부
     */
    boolean insertRcvArticleIud(RcvArticleBasic rcvArticleBasic, RcvArticleBasicUpdateDTO updateDto);

    /**
     * 수신기사를 등록기사로 등록
     *
     * @param rcvArticleBasic 수신기사정보
     * @return 등록성공여부
     */
    boolean insertRcvArticleIud(RcvArticleBasic rcvArticleBasic);
}
