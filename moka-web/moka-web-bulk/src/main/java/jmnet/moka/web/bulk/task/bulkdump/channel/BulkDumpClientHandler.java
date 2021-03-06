package jmnet.moka.web.bulk.task.bulkdump.channel;

import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;
import jmnet.moka.web.bulk.code.DumpStatus;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.service.SlackMessageService;
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

    private boolean isExistQueue( BulkDumpTotalVo bulkDumpTotalVo ) {
        for (Object obj : this.waitDumpClientQueue.toArray()){
            BulkDumpTotalVo tmpDumpTotalVo = (BulkDumpTotalVo) obj;
            if (bulkDumpTotalVo.getContentId().equals(tmpDumpTotalVo.getContentId())) {
                return true;
            }
        }

        for (Object obj : this.bulkDumpClientQueue.toArray()){
            BulkDumpTotalVo tmpDumpTotalVo = (BulkDumpTotalVo) obj;
            if (bulkDumpTotalVo.getContentId().equals(tmpDumpTotalVo.getContentId())) {
                return true;
            }
        }
        return false;
    }


    @Override
    public void run() {
        BulkDumpTotalVo bulkDumpTotalVo;
        final BulkDumpService bulkDumpService = bulkDumpTask.getTaskManager().getBulkDumpService();

        while( !Thread.interrupted()) {
            TotalVo<BulkDumpTotalVo> totalVo;

            try {
                bulkDumpTotalVo = takeQueue();
                if( bulkDumpTotalVo == null )
                    continue;

                boolean delUspBulkDdref = true;
                this.bulkDumpClientChannel.decrementWaitExecutorCount();
                totalVo = new TotalVo<>(bulkDumpTotalVo);

                insertBulkLog( bulkDumpService, totalVo, "Y".equals(bulkDumpTotalVo.getJHotYn()) ? DumpStatus.ProcessingJhot : DumpStatus.Processing,
                        BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} Start", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index) );

                BulkDumpResult result;
                if( isExistQueue( bulkDumpTotalVo )){
                    // 동일한 항목 데이터가 들어왔다.
                    result = BulkDumpResult.SKIP_DATABASE;
                }
                else {
                    int retryCount = bulkDumpTask.getRetryCount();
                    do {
                        try {
                            result = BulkDumpClientProcess.doProcess(totalVo, this.bulkDumpTask);
                            if( result == BulkDumpResult.SUCCESS || result == BulkDumpResult.SKIP_DATABASE ) {
                                break;
                            } else if (result == BulkDumpResult.TIMEOUT_OVP) {
                                if( System.currentTimeMillis() - bulkDumpTotalVo.getDumpStartTime() > bulkDumpTask.getOvpWaitTime() ) {
                                    insertBulkLog(bulkDumpService, totalVo, DumpStatus.Error,
                                            BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} TimeOut Ovp Expired !!", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index), true);
                                    break;
                                }
                                else {
                                    if (bulkDumpTotalVo.isFromWaitQueue()) {
                                        waitDumpClientQueue.addFirst(bulkDumpTotalVo);
                                    } else {
                                        waitDumpClientQueue.add(bulkDumpTotalVo);
                                    }
                                    insertBulkLog(bulkDumpService, totalVo, DumpStatus.TimeOutOvp,
                                            BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} TimeOut Ovp", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index));
                                    delUspBulkDdref = false;
                                }
                                break;
                            }
                        }catch ( Exception ignore) {
                            result = BulkDumpResult.FAIL;
                        }

                        if (--retryCount > 0) {
                            totalVo.logError("BulkDump Exception retry {} ", bulkDumpTask.getRetryCount() - retryCount + 1);
                            //noinspection BusyWait
                            Thread.sleep(bulkDumpTask.getSleepTime());
                        }
                    } while (retryCount > 0);
                }

                if( delUspBulkDdref )
                    bulkDumpService.delUspBulkDdref(bulkDumpTotalVo);

                if( result == BulkDumpResult.SUCCESS ) {
                    insertBulkLog(bulkDumpService, totalVo, "Y".equals(bulkDumpTotalVo.getJHotYn()) ? DumpStatus.CompleteJhot : DumpStatus.Complete,
                            BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} End", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index));
                } else if( result == BulkDumpResult.SKIP_DATABASE ) {
                    insertBulkLog(bulkDumpService, totalVo, DumpStatus.SkipDatabase,
                            BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} Skip Database", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index));
                } else if( result != BulkDumpResult.TIMEOUT_OVP)
                    insertBulkLog(bulkDumpService, totalVo, DumpStatus.Error,
                            BulkStringUtil.format("BulkDump takeQueue no.={} iud={} totalId={} threadIdx={} Error !!", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getContentId(), this.index), true);

            } catch (InterruptedException interrupt) {
                log.info("BulkDumpClientHandler interrupt");
            } catch (Exception e) {
                log.error("BulkDumpClientHandler Exception {}", e.getMessage());
                e.printStackTrace();
            } finally {
                this.bulkDumpClientChannel.incrementWaitExecutorCount();
            }
        }
    }

    private void insertBulkLog(BulkDumpService bulkDumpService, TotalVo<BulkDumpTotalVo> totalVo, int status, String message)
            throws InterruptedException {
        insertBulkLog( bulkDumpService, totalVo, status, message, false );
    }

    private void insertBulkLog(BulkDumpService bulkDumpService, TotalVo<BulkDumpTotalVo> totalVo, int status, String message, boolean isError)
            throws InterruptedException {
        int retryCount = bulkDumpTask.getRetryCount();
        do {
            try {
                bulkDumpService.insertBulkLog(totalVo, status, message, isError);
                break;
            }catch (Exception e) {
                log.error("BulkDumpClientHandler insertBulkLog Exception {}", e.getMessage());
            }

            if (--retryCount > 0) {
                totalVo.logError("BulkDump Exception retry {} ", bulkDumpTask.getRetryCount() - retryCount + 1);
                Thread.sleep(bulkDumpTask.getSleepTime());
            }
        } while (retryCount > 0);

        if( status != DumpStatus.Error )
            return;

        final SlackMessageService slackMessageService = bulkDumpTask.getTaskManager().getSlackMessageService();
        slackMessageService.sendSms( "Bulk Dump", message);
    }
}
