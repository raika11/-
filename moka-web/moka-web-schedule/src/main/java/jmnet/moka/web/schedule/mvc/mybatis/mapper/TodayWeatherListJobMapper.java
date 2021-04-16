package jmnet.moka.web.schedule.mvc.mybatis.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.web.schedule.mvc.mybatis.dto.TodayWeatherListJobDTO;
import jmnet.moka.web.schedule.mvc.mybatis.vo.TodayWeatherVO;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.mapper
 * ClassName : TodayWeatherListJobMapper
 * Created : 2021-04-05
 * </pre>
 */
@Repository
public interface TodayWeatherListJobMapper extends BaseMapper<TodayWeatherVO, TodayWeatherListJobDTO> {
}
