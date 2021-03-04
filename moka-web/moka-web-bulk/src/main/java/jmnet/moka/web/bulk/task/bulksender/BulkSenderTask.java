package jmnet.moka.web.bulk.task.bulksender;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.code.OpCode;
import jmnet.moka.web.bulk.common.task.Task;
import jmnet.moka.web.bulk.common.taskinput.TaskInput;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.exception.BulkDataAccessException;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.service.SlackMessageService;
import jmnet.moka.web.bulk.task.base.TaskGroup;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvCP;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobTotalVo;
import jmnet.moka.web.bulk.task.bulksender.channel.BulkSenderClientChannel;
import jmnet.moka.web.bulk.task.bulksender.channel.BulkSenderClientHandler;
import jmnet.moka.web.bulk.task.bulksender.service.BulkSenderService;
import jmnet.moka.web.bulk.taskinput.FileTaskInput;
import jmnet.moka.web.bulk.taskinput.FileTaskInputData;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import jmnet.moka.web.bulk.util.BulkStringUtil;
import jmnet.moka.web.bulk.util.BulkUtil;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulksender
 * ClassName : BulkSenderTask
 * Created : 2021-01-26 026 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-26 026 오전 11:38
 */

@Slf4j
@Getter
public class BulkSenderTask extends Task<FileTaskInputData> {
    private BulkSenderClientChannel bulkSenderClientChannel;

    private int alertLimitFileCount;
    private int alertLimitFileTime;

    public BulkSenderTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        return new FileTaskInput( true );
    }

    @Override
    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        super.load(node, xu);

        final String bulkDumpEnvFile = xu.getString(node, "./@bulkDumpEnvFile", "");
        if (McpString.isNullOrEmpty(bulkDumpEnvFile)) {
            throw new BulkException("bulkDumpEnvFile 환경 값 설정이 잘못되었습니다.");
        }
        BulkDumpEnv bulkDumpEnv = BulkDumpEnv.loadFromFile(bulkDumpEnvFile);
        this.bulkSenderClientChannel = new BulkSenderClientChannel(bulkDumpEnv, this);

        FileTaskInput fileTaskInput = (FileTaskInput) getTaskInput();
        if( fileTaskInput == null )
            throw new BulkException("FileTaskInput 환경 값 설정이 잘못되었습니다.");

        final String dirInput = bulkDumpEnv.getBulkDumpEnvGlobal().getDirDump();
        if (McpString.isNullOrEmpty(dirInput)) {
            throw new BulkException("Input Path is Blank");
        }
        if (!BulkFileUtil.createDirectories(dirInput)) {
            throw new BulkException("Input Path can't create");
        }

        this.alertLimitFileCount = BulkUtil.parseInt(xu.getString(node, "./@alertLimitFileCount", "30"));
        this.alertLimitFileTime = TimeHumanizer.parse(xu.getString(node, "./@alertLimitFileTime", "20m"));
        if (this.alertLimitFileTime < 50) {
            this.alertLimitFileTime = 60000;
        }

        fileTaskInput.setDirScan(new File(dirInput));
        fileTaskInput.loadDirect(node, xu);
    }

    @Override
    protected boolean doVerifyData(FileTaskInputData taskInputData) {
        return taskInputData.getInputData().size() > 0;
    }

    @Override
    protected void doProcess(FileTaskInputData taskInputData)
            throws BulkDataAccessException {
        final ObjectMapper objectMapper = getTaskManager().getObjectMapper();
        final BulkSenderService bulkSenderService = getTaskManager().getBulkSenderService();

        for( File f : taskInputData.getInputData()) {
            try {
                BulkDumpJobTotalVo dumpJobTotal = objectMapper.readValue( f, BulkDumpJobTotalVo.class);
                if( dumpJobTotal != null ) {
                    boolean isRemain = false;
                    for( String fileName : dumpJobTotal.getJobFileNames() ) {
                        if( (new File(fileName)).exists() ) {
                            isRemain = true;
                            break;
                        }
                    }
                    if( isRemain )
                        continue;

                    BulkFileUtil.deleteFolder( dumpJobTotal.getSourceDir() );
                    if( !f.delete() ){
                        log.trace(" BulkSenderTask :: doProcess file Delete failed");
                    }

                    bulkSenderService.insertBulkLog( new TotalVo<>(dumpJobTotal),
                            BulkStringUtil.format("Bulk Clean seqNo=[{}] totalId=[{}]", dumpJobTotal.getSeqNo(), dumpJobTotal.getTotalId()) );
                }
            } catch (Exception e) {
                log.error( " BulkSenderTask Exception {}", e.getMessage());
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void stopServer() {
        super.stopServer();
        if( bulkSenderClientChannel != null )
            bulkSenderClientChannel.stopChannel();
    }

    @Override
    protected void status(Map<String, Object> map) {
        if( bulkSenderClientChannel != null ){
            List<Map<String, Object>> cpList = new ArrayList<>();
            map.put("cpList", cpList);

            for(BulkSenderClientHandler clientHandler : bulkSenderClientChannel.getClientHandlerList() ) {
                Map<String, Object> cpData = new HashMap<>();
                cpList.add( cpData );

                final BulkDumpEnvCP bulkDumpEnvCP = clientHandler.getBulkDumpEnvCP();
                cpData.put("cpname", bulkDumpEnvCP.getName());
                cpData.put("comment", bulkDumpEnvCP.getComment());
                cpData.put("dir", bulkDumpEnvCP.getDir());
                cpData.put("pause", clientHandler.isPause());
                if( clientHandler.getLastSuccessDate() != null )
                    cpData.put("lastSuccessDate", clientHandler.getLastSuccessDate() );
            }
        }
    }

    @Override
    public void processMonitor() {
        super.processMonitor();

        final SlackMessageService slackMessageService = getTaskManager().getSlackMessageService();

        log.info("{} processMonitor", getTaskName());
        for(BulkSenderClientHandler clientHandler : bulkSenderClientChannel.getClientHandlerList() ) {
            List<File> files = clientHandler.getDirScanFiles();
            if( files != null ) {
                StringBuilder sb = new StringBuilder( String.format( "[%s]  ", clientHandler.getBulkDumpEnvCP().getName()) );
                boolean alert = false;
                if( files.size() > this.alertLimitFileCount) {
                    alert = true;
                    sb.append( String.format("전송 기사 %d개 대기 !!  ", files.size() ) );
                }
                if( files.size() > 0 ) {
                    try {
                        Path path = files.get(0).toPath();
                        BasicFileAttributes fileAttributes = Files.readAttributes(path, BasicFileAttributes.class);

                        final FileTime tmCreate =  fileAttributes.creationTime();
                        if( System.currentTimeMillis() - tmCreate.toMillis() > this.alertLimitFileTime) {
                            alert = true;
                            sb.append( String.format(", [%s] 생성된 기사 %s 대기 !!", McpDate.dateStr(new Date(tmCreate.toMillis()), McpDate.DATETIME_FORMAT), path.toString() ) );
                        }
                    } catch (IOException ignore) {
                        log.trace(" BulkSenderTask :: processMonitor Exception" );
                    }
                }
                if( alert ) {
                    final String message = sb.toString();
                    log.error( "{} monitoring Allert {}", getTaskName(), message );
                    slackMessageService.sendSms( String.format("%s monitor", getTaskName()), message);
                }
            }
        }
    }

    @Override
    public boolean operation(OpCode opCode, Map<String, String> param, Map<String, Object> responseMap, boolean allFromWeb)
            throws InterruptedException {

        if( bulkSenderClientChannel != null ) {
            if (opCode == OpCode.resume || opCode == OpCode.pause) {
                if (param.containsKey("cpname")) {
                    final String cpName = param.get("cpname");
                    for(BulkSenderClientHandler clientHandler : bulkSenderClientChannel.getClientHandlerList() ) {
                        final BulkDumpEnvCP bulkDumpEnvCP = clientHandler.getBulkDumpEnvCP();
                        if( bulkDumpEnvCP.getName().equals(cpName) ) {
                            clientHandler.setPause( opCode == OpCode.pause );
                            return true;
                        }
                    }
                }
                return false;
            }
        }
        return super.operation(opCode, param, responseMap, allFromWeb);
    }
}
