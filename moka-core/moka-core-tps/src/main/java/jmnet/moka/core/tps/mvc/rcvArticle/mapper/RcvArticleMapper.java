/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleBasicVO;

/**
 * Description: 수신기사 mapper
 *
 * @author ssc
 * @since 2020-12-22
 */
public interface RcvArticleMapper extends BaseMapper<RcvArticleBasicVO, RcvArticleSearchDTO> {
    /**
     * 수신기사 부가정보 조회(분류코드,기자,키워드)
     *
     * @param map rid:수신기사키, sourceCode:매체코드
     * @return 분류코드목록, 기자목록, 키워드목록
     */
    List<List<Object>> findInfo(Map<String, Object> map);

    /**
     * 수신기사를 등록기사로 등록
     *
     * @param param rid: 수신기사키, returnValue: 성공여부
     */
    void insertRcvArticleIud(Map<String, Object> param);

    /**
     * 수신기자 등록
     *
     * @param param rid: 수신기사키, sourceCode: 매체코드, reporter: 수신기자정보
     * @return 성공여부
     */
    Integer callUspRcvArticleReporterIns(Map<String, Object> param);

    /**
     * 수신기자 삭제
     *
     * @param param rid: 수신기사키, sourceCode: 매체코드
     * @return 성공여부
     */
    Integer callUspRcvArticleReporterDel(Map<String, Object> param);

    /**
     * 분류코드 등록
     *
     * @param param rid: 수신기사키, sourceCode: 매체코드, category: 분류정보
     * @return 성공여부
     */
    Integer callUspRcvArticleCodeIns(Map<String, Object> param);

    /**
     * 분류코드 삭제
     *
     * @param param rid: 수신기사키, sourceCode: 매체코드
     * @return 성공여부
     */
    Integer callUspRcvArticleCodeDel(Map<String, Object> param);

    /**
     * 태그등록
     *
     * @param param rid: 수신기사키, sourceCode: 매체코드, keyword: 태그
     * @return 성공여부
     */
    Integer callUspRcvArticleKeywordIns(Map<String, Object> param);

    /**
     * 태그삭제
     *
     * @param param rid: 수신기사키, sourceCode: 매체코드
     * @return 성공여부
     */
    Integer callUspRcvArticleKeywordDel(Map<String, Object> param);
}
