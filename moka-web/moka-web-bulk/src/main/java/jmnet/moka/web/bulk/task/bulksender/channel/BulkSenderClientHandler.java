package jmnet.moka.web.bulk.task.bulksender.channel;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import jmnet.moka.web.bulk.code.SenderStatus;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.service.SlackMessageService;
import jmnet.moka.web.bulk.task.base.TaskManager;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvCP;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.sub.BulkDumpJobFileVo;
import jmnet.moka.web.bulk.task.bulksender.BulkSenderTask;
import jmnet.moka.web.bulk.task.bulksender.service.BulkSenderService;
import jmnet.moka.web.bulk.taskinput.FileTaskInput;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import jmnet.moka.web.bulk.util.BulkFtpUtil;
import jmnet.moka.web.bulk.util.BulkStringUtil;
import jmnet.moka.web.bulk.util.BulkUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulksender.channel
 * ClassName : BulkSenderClientHandler
 * Created : 2021-01-26 026 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-26 026 오후 3:54
 */

@Slf4j
@Getter
@Setter
public class BulkSenderClientHandler implements Runnable{
    private final BulkDumpEnvCP bulkDumpEnvCP;
    private final BulkSenderTask bulkSenderTask;
    private final File dirScan;
    private final FileTaskInput fileTaskInput;
    private final ObjectMapper objectMapper;
    private final BulkSenderService bulkSenderService;
    private final SlackMessageService slackMessageService;

    private boolean isPause = false;

    public Date getLastSuccessDate() {
        return BulkUtil.getDeepDate(lastSuccessDate);
    }

    @SuppressWarnings("unused")
    public void setLastSuccessDate(Date lastSuccessDate) {
        this.lastSuccessDate = BulkUtil.getDeepDate(lastSuccessDate);
    }

    private Date lastSuccessDate;

    public BulkSenderClientHandler(BulkDumpEnvCP bulkDumpEnvCP, BulkSenderTask bulkSenderTask) {
        this.bulkDumpEnvCP = bulkDumpEnvCP;
        this.bulkSenderTask = bulkSenderTask;
        this.dirScan = new File(this.bulkDumpEnvCP.getDir());
        this.fileTaskInput = (FileTaskInput) bulkSenderTask.getTaskInput();

        final TaskManager taskManager = bulkSenderTask.getTaskManager();
        this.objectMapper = taskManager.getObjectMapper();
        this.bulkSenderService = taskManager.getBulkSenderService();
        this.slackMessageService = taskManager.getSlackMessageService();
    }

    public List<File> getDirScanFiles() {
        return BulkFileUtil.getDirScanFiles(this.dirScan, this.fileTaskInput.getFileFilter(), this.fileTaskInput.getFileWaitTime());
    }

    @Override
    public void run() {
        while( !Thread.interrupted()) {
            try {
                if( isPause ){
                    sleep(bulkSenderTask.getSleepTime());
                    continue;
                }

                List<File> files = getDirScanFiles();
                if( files == null ) {
                    sleep(bulkSenderTask.getSleepTime());
                    continue;
                }

                for( File f : files ) {
                    try {
                        BulkDumpJobVo bulkDumpJob = this.objectMapper.readValue(f, BulkDumpJobVo.class);
                        if( bulkDumpJob == null)
                            continue;
                        TotalVo<BulkDumpJobVo> totalVo = new TotalVo<>(bulkDumpJob);

                        insertBulkPortalLog( bulkSenderService, totalVo, SenderStatus.Processing,
                                BulkStringUtil.format("{} Bulk Sender Start {}", bulkDumpJob.getCpName(), f.getName()));

                        if( doBulkFtpSend( totalVo ) ) {
                            if( !f.delete() ){
                                log.trace(" BulkSenderClientHandler :: run file Delete failed");
                            }
                            insertBulkPortalLog( bulkSenderService, totalVo, SenderStatus.Complete,
                                    BulkStringUtil.format("{} Bulk Sender End {}", bulkDumpJob.getCpName(), f.getName()));
                            lastSuccessDate = new Date();
                        }
                        else
                            insertBulkPortalLog( bulkSenderService, totalVo, SenderStatus.Error,
                                    BulkStringUtil.format("{} Bulk Sender Error !! {}", bulkDumpJob.getCpName(), f.getName()), true);
                    }
                    catch (Exception e) {
                        log.error("BulkSenderClientHandler Exception [{}] {} {}", bulkDumpEnvCP.getName(), f.getName(), e.getMessage());
                        e.printStackTrace();
                        slackMessageService.sendSms("BulkSenderClient Exception", BulkStringUtil.format("BulkSenderClientHandler Exception [{}] {} {}", bulkDumpEnvCP.getName(), f.getName(), e.getMessage()));
                    }
                }
            } catch (RuntimeException e ){
                log.error("BulkSenderClientHandler RuntimeException {}", e.getMessage());
                e.printStackTrace();
            }
            catch (Exception e) {
                log.error("BulkSenderClientHandler Exception {}", e.getMessage());
                e.printStackTrace();
            }
        }
    }

    private boolean doBulkFtpSend(TotalVo<BulkDumpJobVo> totalVo) {
        final BulkDumpJobVo bulkDumpJob = totalVo.getMainData();

        List<String> source = new ArrayList<>();
        List<String> targetDir = new ArrayList<>();
        List<String> target = new ArrayList<>();
        for(BulkDumpJobFileVo bulkDumpJobFile : bulkDumpJob.getSourceJobFiles() ) {
            source.add(bulkDumpJobFile.getSourceFilePath());
            targetDir.add("/");
            target.add(bulkDumpJobFile.getTargetFileName());
        }
        return BulkFtpUtil.uploadFle( totalVo, bulkDumpJob.getCpName(), this.bulkDumpEnvCP.getFtpConfig(), source, targetDir, target);
    }

    protected void sleep(int sleepTime) {
        if (sleepTime <= 0)
            return;
        try {
            final int sleepTimer = 100;
            final int countLoop = sleepTime / sleepTimer;
            for (int i = 0; i < countLoop; i++) {
                if( Thread.interrupted() )
                    break;
                Thread.sleep(sleepTimer);
            }
        } catch (Exception ignore) {
            log.trace(" BulkSenderClientHandler :: sleep Exception" );
        }
    }

    private void insertBulkPortalLog(BulkSenderService bulkSenderService, TotalVo<BulkDumpJobVo> totalVo, int status, String message)
            throws InterruptedException {
        insertBulkPortalLog( bulkSenderService, totalVo, status, message, false );
    }

    private void insertBulkPortalLog(BulkSenderService bulkSenderService, TotalVo<BulkDumpJobVo> totalVo, int status, String message, boolean isError)
            throws InterruptedException {
        int retryCount = bulkSenderTask.getRetryCount();
        do {
            try {
                bulkSenderService.insertBulkPortalLog(totalVo, status, message, isError);
                break;
            }catch (Exception e) {
                log.error("BulkSenderClientHandler insertBulkLog Exception {}", e.getMessage());
            }

            if (--retryCount > 0) {
                totalVo.logError("BulkSenderClientHandler Exception retry {} ", bulkSenderTask.getRetryCount() - retryCount + 1);
                Thread.sleep(bulkSenderTask.getSleepTime());
            }
        } while (retryCount > 0);

        if( status != SenderStatus.Error )
            return;

        final SlackMessageService slackMessageService = bulkSenderTask.getTaskManager().getSlackMessageService();
        slackMessageService.sendSms( "Bulk Sender", message);
    }
}
