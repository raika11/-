package jmnet.moka.web.bulk.task.bulksender.service;

import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.mapper.mokalog.BulkSenderMokaLogMapper;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobTotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobVo;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulksender.service
 * ClassName : BulkSenderServiceImpl
 * Created : 2021-02-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-04 004 오후 8:11
 */
@Service
public class BulkSenderServiceImpl implements BulkSenderService{
    final BulkSenderMokaLogMapper bulkSenderMokaLogMapper;

    public BulkSenderServiceImpl(BulkSenderMokaLogMapper bulkSenderMokaLogMapper) {
        this.bulkSenderMokaLogMapper = bulkSenderMokaLogMapper;
    }

    @Override
    public void insertBulkLog(TotalVo<BulkDumpJobTotalVo> totalVo, String message) {
        totalVo.logInfo(message);
        totalVo.setMsg(totalVo.getInfoMessageList());

        this.bulkSenderMokaLogMapper.callUspBulkLogInsBySender(totalVo);

        totalVo.setInfoMessageFlush();
    }

    @Override
    public void insertBulkPortalLog(TotalVo<BulkDumpJobVo> totalVo, int status, String message, boolean isError) {
        totalVo.getMainData().setStatus(status);
        if( isError )
            totalVo.logError(message);
        else
            totalVo.logInfo(message);
        totalVo.setMsg(totalVo.getInfoMessageList());

        this.bulkSenderMokaLogMapper.callUspBulkPortalLogInsBySender(totalVo);

        totalVo.setInfoMessageFlush();
    }

    @Override
    @SuppressWarnings("unused")
    public void insertBulkPortalLog(TotalVo<BulkDumpJobVo> totalVo, int status, String message) {
        insertBulkPortalLog(totalVo, status, message, false);
    }
}
