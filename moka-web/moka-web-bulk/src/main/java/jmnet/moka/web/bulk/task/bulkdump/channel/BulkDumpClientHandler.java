package jmnet.moka.web.bulk.task.bulkdump.channel;

import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;
import jmnet.moka.web.bulk.code.DumpStatus;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.process.BulkDumpClientProcess;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkDumpResult;
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
    private final LinkedBlockingDeque<BulkDumpTotalVo> bulkDumpClientQueue;
    private final LinkedBlockingDeque<BulkDumpTotalVo> waitDumpClientQueue;
    private final BulkDumpTask bulkDumpTask;
    private final int index;

    public BulkDumpClientHandler(BulkDumpClientChannel bulkDumpClientChannel, LinkedBlockingDeque<BulkDumpTotalVo> queue, BulkDumpTask bulkDumpTask,
            int index) {
        this.bulkDumpClientChannel = bulkDumpClientChannel;
        this.bulkDumpClientQueue = queue;
        this.bulkDumpTask = bulkDumpTask;
        this.waitDumpClientQueue = new LinkedBlockingDeque<>();
        this.index = index;
    }

    private BulkDumpTotalVo takeQueue()
            throws InterruptedException {
        while( !Thread.interrupted() ) {
            BulkDumpTotalVo bulkDumpTotalVo = this.bulkDumpClientQueue.poll(10, TimeUnit.SECONDS);
            if (bulkDumpTotalVo != null) {
                for (Object obj : this.waitDumpClientQueue.toArray()) {
                    BulkDumpTotalVo tmpDumpTotalVo = (BulkDumpTotalVo) obj;
                    if (bulkDumpTotalVo.getContentId().equals(tmpDumpTotalVo.getContentId())) {
                        waitDumpClientQueue.add(tmpDumpTotalVo);
                        bulkDumpTotalVo = null;
                        break;
                    }
                }
            }
            if (bulkDumpTotalVo != null)
                return bulkDumpTotalVo.setFromWaitQueue(false);

            bulkDumpTotalVo = this.waitDumpClientQueue.poll();
            if (bulkDumpTotalVo != null)
                return bulkDumpTotalVo.setFromWaitQueue(true);
        }
        return null;
    }


    @Override
    public void run() {
        BulkDumpTotalVo bulkDumpTotalVo;
        final BulkDumpService bulkDumpService = bulkDumpTask.getTaskManager().getBulkDumpService();

        while( !Thread.interrupted()) {
            TotalVo<BulkDumpTotalVo> totalVo = null;

            try {
                bulkDumpTotalVo = takeQueue();
                if( bulkDumpTotalVo == null )
                    continue;

                this.bulkDumpClientChannel.decrementWaitExecutorCount();

                totalVo = new TotalVo<>(bulkDumpTotalVo);

                bulkDumpService.insertBulkLog( totalVo, "Y".equals(bulkDumpTotalVo.getJHotYn()) ? DumpStatus.ProcessingJhot : DumpStatus.Processing,
                        BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} Start", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index));

                int retryCount = bulkDumpTask.getRetryCount();

                boolean delUspBulkDdref = false;
                BulkDumpResult result;
                do {
                    result = BulkDumpClientProcess.doProcess(totalVo, this.bulkDumpTask);
                    if( result == BulkDumpResult.SUCCESS || result == BulkDumpResult.SKIP_DATABASE ) {
                        delUspBulkDdref = true;
                        break;
                    } else if (result == BulkDumpResult.TIMEOUT_OVP) {
                        if (bulkDumpTotalVo.isFromWaitQueue()) {
                            waitDumpClientQueue.addFirst(bulkDumpTotalVo);
                        } else {
                            waitDumpClientQueue.add(bulkDumpTotalVo);
                        }
                        bulkDumpService.insertBulkLog(totalVo, DumpStatus.TimeOutOvp,
                                BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} TimeOut Ovp", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index));
                        break;
                    }

                    if (--retryCount > 0) {
                        totalVo.logError("BulkDump Exception retry {} ", bulkDumpTask.getRetryCount() - retryCount + 1);
                        //noinspection BusyWait
                        Thread.sleep(bulkDumpTask.getSleepTime());
                    }
                } while (retryCount > 0);

                if( delUspBulkDdref )
                    bulkDumpService.delUspBulkDdref(bulkDumpTotalVo);

                if( result == BulkDumpResult.SUCCESS ) {
                    bulkDumpService.insertBulkLog(totalVo, "Y".equals(bulkDumpTotalVo.getJHotYn()) ? DumpStatus.CompleteJhot : DumpStatus.Complete,
                            BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} End", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index));
                } else if( result == BulkDumpResult.SKIP_DATABASE ) {
                    bulkDumpService.insertBulkLog(totalVo, DumpStatus.SkipDatabase,
                            BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} Skip Database", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index));
                }
                else
                    bulkDumpService.insertBulkLog(totalVo, DumpStatus.Error,
                            BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} Error !!", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index));

            } catch (InterruptedException interrupt) {
                log.info("BulkDumpClientHandler interrupt");
            } catch (Exception e) {
                if (totalVo != null) {
                    bulkDumpService.insertBulkLog(totalVo, DumpStatus.Error,
                            BulkStringUtil.format("BulkDumpClientHandler Exception {}", e.getMessage()), true);
                }
                log.error("BulkDumpClientHandler Exception {}", e.getMessage());
                e.printStackTrace();
            } finally {
                this.bulkDumpClientChannel.incrementWaitExecutorCount();
            }
        }
    }
}
