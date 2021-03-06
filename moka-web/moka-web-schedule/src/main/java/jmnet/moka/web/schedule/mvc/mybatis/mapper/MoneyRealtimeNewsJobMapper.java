package jmnet.moka.web.schedule.mvc.mybatis.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.web.schedule.mvc.mybatis.dto.MoneyRealtimeNewsJobDTO;
import jmnet.moka.web.schedule.mvc.mybatis.vo.MoneyRealtimeNewsVO;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.mapper
 * ClassName : MoneyRealtimeNewsJobMapper
 * Created : 2021-03-31
 * </pre>
 */
@Repository
public interface MoneyRealtimeNewsJobMapper extends BaseMapper<MoneyRealtimeNewsVO, MoneyRealtimeNewsJobDTO> {
}
