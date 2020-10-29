/**
 * msp-tps PageMapper.java 2020. 7. 8. 오후 12:34:59 ssc
 */
package jmnet.moka.core.tps.mvc.page.mapper;

import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;

/**
 * <pre>
 *
 * 2020. 7. 8. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 7. 8. 오후 12:34:59
 */
public interface PageRelMapper extends BaseMapper<PageVO, RelationSearchDTO> {
    void deleteByPageSeq(Map<String, Object> map);
}
