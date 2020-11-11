package jmnet.moka.core.tps.mvc.reporter.Mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;

import java.util.List;

public interface ReporterMapper extends BaseMapper<ComponentVO, ComponentSearchDTO> {

}
