package jmnet.moka.core.tps.mvc.bulklog.service;

import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogSearchDTO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkTotalLogVO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkLogVO;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bulklog.service
 * ClassName : BulkLogService
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 14:02
 */
public interface BulkLogService {

    Page<BulkTotalLogVO> findAllBulkLogStat(BulkLogSearchDTO searchDTO);

    Page<BulkLogVO> findAllBulkLogStatList(BulkLogSearchDTO searchDTO);
}
