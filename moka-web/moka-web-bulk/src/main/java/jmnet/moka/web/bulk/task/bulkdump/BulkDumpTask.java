package jmnet.moka.web.bulk.task.bulkdump;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.task.Task;
import jmnet.moka.web.bulk.common.taskinput.TaskInput;
import jmnet.moka.web.bulk.common.taskinput.TaskInputData;
import jmnet.moka.web.bulk.exception.BulkDataAccessException;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.task.base.TaskGroup;
import jmnet.moka.web.bulk.task.bulkdump.channel.BulkDumpClientChannel;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.taskinput.DBTaskInput;
import jmnet.moka.web.bulk.taskinput.DBTaskInputData;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump
 * ClassName : BulkDumpTask
 * Created : 2020-12-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-17 017 오후 4:54
 */
@Slf4j
@Getter
public class BulkDumpTask extends Task<DBTaskInputData> {
    private final BulkDumpClientChannel bulkDumpClientChannel;
    private int currentSeqNo = 0;
    private BulkDumpEnv bulkDumpEnv;

    public BulkDumpTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        super(parent, node, xu);
        this.bulkDumpClientChannel = new BulkDumpClientChannel(node, xu, this);
    }

    @Override
    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        super.load(node, xu);

        final String bulkDumpEnvFile = xu.getString(node, "./@bulkDumpEnvFile", "");
        if (McpString.isNullOrEmpty(bulkDumpEnvFile)) {
            throw new BulkException("bulkDumpEnvFile 환경 값 설정이 잘못되었습니다.");
        }
        this.bulkDumpEnv = BulkDumpEnv.loadFromFile(bulkDumpEnvFile);


    }

    @Override
    protected TaskInput initTaskInput() {
        final BulkDumpService bulkDumpService = getTaskManager().getBulkDumpService();
        return new DBTaskInput() {
            @Override
            public TaskInputData getTaskInputData() {
                final int waitExecutorCount = bulkDumpClientChannel.getWaitExecutorCount();
                if( waitExecutorCount == 0 ) {
                    log.debug("Dump Client Channel is Full");
                    return null;
                }

                log.debug("Get getUspBulkDdrefListSel top {} and over seqNo [{}]", waitExecutorCount, currentSeqNo);
                return DBTaskInputData.newDBTaskInputData(bulkDumpService.getUspBulkDdrefListSel(waitExecutorCount, currentSeqNo));
            }
        };
    }

    @Override
    protected boolean doVerifyData(DBTaskInputData taskInputData) {
        return taskInputData.getInputData().size() > 0;
    }

    @Override
    protected void doProcess(DBTaskInputData taskInputData)
            throws BulkDataAccessException {

        final ObjectMapper objectMapper = getTaskManager().getObjectMapper();

        for( Map<String, Object> map : taskInputData.getInputData() ) {
            try {
                BulkDumpTotalVo bulkDumpTotalVo = objectMapper.convertValue(map, BulkDumpTotalVo.class);
                if( !bulkDumpTotalVo.isDdrefValid() )
                    continue;

                bulkDumpTotalVo.setTaskInputData(taskInputData);
                this.currentSeqNo = Math.max( currentSeqNo, bulkDumpTotalVo.getSeqNo());

                log.info( "BulkDump Start no.={} iud={} totalId={}", bulkDumpTotalVo.getSeqNo(), bulkDumpTotalVo.getIud(), bulkDumpTotalVo.getTotalId());
                this.bulkDumpClientChannel.enqueue(bulkDumpTotalVo);
            } catch (Exception ignore) {
            }
        }
    }

    @Override
    protected void stopServer() {
        super.stopServer();
        this.bulkDumpClientChannel.stopChannel();
    }
}
