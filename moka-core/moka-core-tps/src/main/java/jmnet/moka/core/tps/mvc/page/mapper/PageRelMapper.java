/**
 * msp-tps PageMapper.java 2020. 7. 8. 오후 12:34:59 ssc
 */
package jmnet.moka.core.tps.mvc.page.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;

/**
 * <pre>
 * 
 * 2020. 7. 8. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 7. 8. 오후 12:34:59
 * @author ssc
 */
public interface PageRelMapper extends BaseMapper<PageVO, RelSearchDTO> {
    Long deleteByPageSeq(Long pageSeq);
}
