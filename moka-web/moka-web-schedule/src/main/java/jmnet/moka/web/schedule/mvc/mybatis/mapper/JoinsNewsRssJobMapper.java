package jmnet.moka.web.schedule.mvc.mybatis.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.web.schedule.mvc.mybatis.dto.JoinsNewsRssDTO;
import jmnet.moka.web.schedule.mvc.mybatis.vo.JoinsNewsVO;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.mapper
 * ClassName : JoinsNewsRssJobMapper
 * Created : 2021-03-19
 * </pre>
 */
@Repository
public interface JoinsNewsRssJobMapper extends BaseMapper<JoinsNewsVO, JoinsNewsRssDTO> {
}
