/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * msp-tps PageMapper.java 2020. 7. 8. 오후 12:34:59 ssc
 */
package jmnet.moka.core.tps.mvc.articlepage.mapper;

import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.articlepage.vo.ArticlePageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;

/**
 *
 * @author ssc
 * @since 2020. 7. 8. 오후 12:34:59
 */
public interface ArticlePageRelMapper extends BaseMapper<ArticlePageVO, RelationSearchDTO> {
    void deleteBySeq(Map<String, Object> map);
}
