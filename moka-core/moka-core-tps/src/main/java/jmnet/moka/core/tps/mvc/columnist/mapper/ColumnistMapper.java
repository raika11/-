package jmnet.moka.core.tps.mvc.columnist.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistSearchDTO;
import jmnet.moka.core.tps.mvc.columnist.vo.ColumnistVO;

public interface ColumnistMapper extends BaseMapper<ColumnistVO, ColumnistSearchDTO> {

    ColumnistVO findById(String seqNo);
}
