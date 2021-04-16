package jmnet.moka.web.schedule.mvc.mybatis.mapper;


import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.web.schedule.mvc.mybatis.dto.JReporterListJobDTO;
import jmnet.moka.web.schedule.mvc.mybatis.vo.JReporterVO;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.mapper
 * ClassName : JReporterListJobMapper
 * Created : 2021-03-18
 * </pre>
 */
@Repository
public interface JReporterListJobMapper extends BaseMapper<JReporterVO, JReporterListJobDTO> {
}
