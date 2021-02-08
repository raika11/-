package jmnet.moka.web.bulk.task.bulkdump.channel;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.code.DumpStatus;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.process.BulkDumpClientProcess;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkStringUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.channel
 * ClassName : DumpClientHandler
 * Created : 2020-12-18 018 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-18 018 오전 10:11
 */
@Slf4j
public class BulkDumpClientHandler implements Runnable {
    private final BulkDumpClientChannel bulkDumpClientChannel;
    private final BulkDumpTask bulkDumpTask;

    public BulkDumpClientHandler(BulkDumpClientChannel bulkDumpClientChannel, BulkDumpTask bulkDumpTask) {
        this.bulkDumpClientChannel = bulkDumpClientChannel;
        this.bulkDumpTask = bulkDumpTask;
    }

    @Override
    public void run() {
        BulkDumpTotalVo bulkDumpTotalVo;
        final BulkDumpService bulkDumpService = bulkDumpTask.getTaskManager().getBulkDumpService();

        while( !Thread.interrupted()) {
            TotalVo<BulkDumpTotalVo> totalVo = null;

            try {
                this.bulkDumpClientChannel.incrementWaitExecutorCount();
                bulkDumpTotalVo = this.bulkDumpClientChannel.takeQueue();
                totalVo = new TotalVo<>(bulkDumpTotalVo);

                bulkDumpService.insertBulkLog( totalVo, "Y".equals(bulkDumpTotalVo.getJHotYn()) ? DumpStatus.ProcessingJhot : DumpStatus.Processing,
                        BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} Start", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId()));

                BulkDumpClientProcess.doProcess( totalVo, this.bulkDumpTask );
                bulkDumpService.delUspBulkDdref(bulkDumpTotalVo);

                bulkDumpService.insertBulkLog( totalVo, "Y".equals(bulkDumpTotalVo.getJHotYn()) ? DumpStatus.CompleteJhot : DumpStatus.Complete,
                        BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} End", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId()));

            } catch (Exception e) {
                if( totalVo != null ) {
                    bulkDumpService.insertBulkLog(totalVo, DumpStatus.Error,
                            BulkStringUtil.format("BulkDumpClientHandler Exception {}", e.getMessage()), true );
                }
                log.error("BulkDumpClientHandler Exception {}", e.getMessage());
                e.printStackTrace();
            } finally {
                this.bulkDumpClientChannel.decrementWaitExecutorCount();
            }
        }
    }
}
