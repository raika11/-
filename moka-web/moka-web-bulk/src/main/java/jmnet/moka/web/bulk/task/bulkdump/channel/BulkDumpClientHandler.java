package jmnet.moka.web.bulk.task.bulkdump.channel;

import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.process.BulkDumpClientProcess;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
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
            try {
                bulkDumpTotalVo = this.bulkDumpClientChannel.takeQueue();
                this.bulkDumpClientChannel.incrementWaitExecutorCount();

                log.info( "BulkDump takeQueue no.={} iud={} totalId={}", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getTotalId());
                BulkDumpClientProcess.doProcess( bulkDumpTotalVo, this.bulkDumpTask );

                bulkDumpService.delUspBulkDdref(bulkDumpTotalVo);
            } catch (Exception e) {
                log.error("BulkDumpClientHandler Exception {}", e.getMessage());
                e.printStackTrace();
            } finally {
                this.bulkDumpClientChannel.decrementWaitExecutorCount();
            }
        }
    }
}
