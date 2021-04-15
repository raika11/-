package jmnet.moka.web.schedule.mvc.mybatis.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.web.schedule.mvc.mybatis.dto.AirkoreaInfoJobDTO;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.mapper
 * ClassName : AirkoreaInfoJobMapper
 * Created : 2021-02-18 ince
 * </pre>
 *
 * @author 유영제
 * @since 2021-04-14
 */
@Repository
public interface AirkoreaInfoJobMapper extends BaseMapper<Integer, AirkoreaInfoJobDTO> {
    Integer insertAirkoreaInfo(AirkoreaInfoJobDTO dto);
}
