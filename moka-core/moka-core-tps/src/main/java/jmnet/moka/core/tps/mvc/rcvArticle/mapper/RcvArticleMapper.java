/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleBasicVO;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleReporterVO;

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
     * @return 분류코드, 기자, 키워드
     */
    List<List<Object>> findInfo(Map<String, Object> map);

    /**
     * 수신기사를 등록기사로 등록
     *
     * @param param rid: 수신기사키, returnValue: 성공여부
     */
    void insertRcvArticleIud(Map<String, Object> param);

    Integer callUspRcvArticleReporterIns(RcvArticleReporterVO rcvArticleReporterVO);

    Integer callUspRcvArticleReporterDel(Map<String, Object> param);

    Integer callUspRcvArticleCodeIns(String category);

    Integer callUspRcvArticleCodeDel(Map<String, Object> param);

    Integer callUspRcvArticleKeywordIns(Map<String, Object> param);

    Integer callUspRcvArticleKeywordDel(Map<String, Object> param);
}
