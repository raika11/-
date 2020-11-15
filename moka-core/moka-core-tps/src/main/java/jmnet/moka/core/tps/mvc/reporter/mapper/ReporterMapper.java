package jmnet.moka.core.tps.mvc.reporter.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;

public interface ReporterMapper extends BaseMapper<ReporterVO, ReporterSearchDTO> {

    ReporterVO findBySeq(String repSeq);
}
