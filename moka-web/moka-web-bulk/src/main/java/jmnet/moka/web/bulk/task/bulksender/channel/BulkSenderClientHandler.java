package jmnet.moka.web.bulk.task.bulksender.channel;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import jmnet.moka.web.bulk.service.SmsUtilService;
import jmnet.moka.web.bulk.task.base.TaskManager;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvCP;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.sub.BulkDumpJobFileVo;
import jmnet.moka.web.bulk.task.bulksender.BulkSenderTask;
import jmnet.moka.web.bulk.taskinput.FileTaskInput;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import jmnet.moka.web.bulk.util.FtpUtil;
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
public class BulkSenderClientHandler implements Runnable{
    private final BulkDumpEnvCP bulkDumpEnvCP;
    private final BulkSenderTask bulkSenderTask;
    private final File dirScan;
    private final FileTaskInput fileTaskInput;
    private final ObjectMapper objectMapper;
    private final SmsUtilService smsUtilService;

    public BulkSenderClientHandler(BulkDumpEnvCP bulkDumpEnvCP, BulkSenderTask bulkSenderTask) {
        this.bulkDumpEnvCP = bulkDumpEnvCP;
        this.bulkSenderTask = bulkSenderTask;
        this.dirScan = new File(this.bulkDumpEnvCP.getDir());
        this.fileTaskInput = (FileTaskInput) bulkSenderTask.getTaskInput();

        final TaskManager taskManager = bulkSenderTask.getTaskManager();
        this.objectMapper = taskManager.getObjectMapper();
        this.smsUtilService = taskManager.getSmsUtilService();
    }

    @Override
    public void run() {
        while( !Thread.interrupted()) {
            try {
                List<File> files = BulkFileUtil.getDirScanFiles( this.dirScan, this.fileTaskInput.getFileFilter(), this.fileTaskInput.getFileWaitTime() );
                if( files == null ) {
                    sleep(bulkSenderTask.getSleepTime());
                    continue;
                }

                for( File f : files ) {
                    try {
                        BulkDumpJobVo bulkDumpJob = this.objectMapper.readValue(f, BulkDumpJobVo.class);
                        if( bulkDumpJob == null)
                            continue;
                        if( doBulkFtpSend( bulkDumpJob ) )
                            //noinspection ResultOfMethodCallIgnored
                            f.delete();
                    }
                    catch (Exception e) {
                        log.error("BulkSenderClientHandler Exception {} {}", f.getName(), e.getMessage());
                        e.printStackTrace();
                    }
                }
            } catch (Exception e) {
                log.error("BulkSenderClientHandler Exception {}", e.getMessage());
                e.printStackTrace();
            }
        }
    }

    private boolean doBulkFtpSend(BulkDumpJobVo bulkDumpJob) {
        List<String> source = new ArrayList<>();
        List<String> targetDir = new ArrayList<>();
        List<String> target = new ArrayList<>();
        for(BulkDumpJobFileVo bulkDumpJobFile : bulkDumpJob.getSourceJobFiles() ) {
            source.add(bulkDumpJobFile.getSourceFilePath());
            targetDir.add("/");
            target.add(bulkDumpJobFile.getTargetFileName());
        }
        return FtpUtil.uploadFle(this.bulkDumpEnvCP.getFtpConfig(), source, targetDir, target);
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
        } catch (Exception ex2) {
            // do nothing
        }
    }
}
