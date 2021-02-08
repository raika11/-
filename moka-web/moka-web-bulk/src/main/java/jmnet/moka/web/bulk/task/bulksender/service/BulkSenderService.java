package jmnet.moka.web.bulk.task.bulksender.service;

import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobTotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobVo;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulksender.service
 * ClassName : BulkSenderService
 * Created : 2021-02-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-04 004 오후 8:10
 */
public interface BulkSenderService {
    void insertBulkLog( TotalVo<BulkDumpJobTotalVo> totalVo, String message );

    void insertBulkPortalLog( TotalVo<BulkDumpJobVo> totalVo, int status, String message, boolean isError );
    void insertBulkPortalLog( TotalVo<BulkDumpJobVo> totalVo, int status, String message );
}
