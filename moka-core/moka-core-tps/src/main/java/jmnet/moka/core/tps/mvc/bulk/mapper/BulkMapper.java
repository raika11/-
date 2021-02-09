package jmnet.moka.core.tps.mvc.bulk.mapper;


import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkSaveDTO;
import jmnet.moka.core.tps.mvc.bulk.entity.Bulk;

import java.util.Map;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bulk.mapper
 * ClassName : BulkMapper
 * Created : 2021-02-08
 * </pre>
 */
public interface BulkMapper extends BaseMapper<String, BulkSaveDTO> {
    void getResult(BulkSaveDTO search) throws RuntimeException;
}
