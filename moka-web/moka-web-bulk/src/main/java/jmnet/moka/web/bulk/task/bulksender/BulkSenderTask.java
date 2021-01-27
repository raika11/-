package jmnet.moka.web.bulk.task.bulksender;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.task.Task;
import jmnet.moka.web.bulk.common.taskinput.TaskInput;
import jmnet.moka.web.bulk.exception.BulkDataAccessException;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.task.base.TaskGroup;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobTotalVo;
import jmnet.moka.web.bulk.task.bulksender.channel.BulkSenderClientChannel;
import jmnet.moka.web.bulk.taskinput.FileTaskInput;
import jmnet.moka.web.bulk.taskinput.FileTaskInputData;
import jmnet.moka.web.bulk.util.BulkFileUtil;
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

        final String dirInput = bulkDumpEnv
                .getBulkDumpEnvGlobal().getDirDump();
        if (McpString.isNullOrEmpty(dirInput)) {
            throw new BulkException("Input Path is Blank");
        }
        if (!BulkFileUtil.createDirectories(dirInput)) {
            throw new BulkException("Input Path can't create");
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
                    //noinspection ResultOfMethodCallIgnored
                    f.delete();
                    log.info("Bulk Clean seqNo=[{}] totalId=[{}]", dumpJobTotal.getSeqNo(), dumpJobTotal.getTotalId());
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
}
