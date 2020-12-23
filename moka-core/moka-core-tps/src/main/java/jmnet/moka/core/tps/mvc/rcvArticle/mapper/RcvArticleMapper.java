/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.mapper;

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
}
