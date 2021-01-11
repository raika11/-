package jmnet.moka.web.bulk.task.bulkloader;

import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.task.Task;
import jmnet.moka.web.bulk.common.taskinput.TaskInput;
import jmnet.moka.web.bulk.common.taskinput.TaskInputData;
import jmnet.moka.web.bulk.exception.BulkDataAccessException;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.task.base.TaskGroup;
import jmnet.moka.web.bulk.task.bulkloader.service.BulkLoaderService;
import jmnet.moka.web.bulk.taskinput.DBTaskInput;
import jmnet.moka.web.bulk.taskinput.DBTaskInputData;
import jmnet.moka.web.bulk.util.BulkUtil;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkloader
 * ClassName : BulkLoaderTask
 * Created : 2020-12-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-11 011 오후 1:35
 */

@Slf4j
public class BulkLoaderTask extends Task<DBTaskInputData> {
    public BulkLoaderTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        final BulkLoaderService bulkLoaderService = getTaskManager().getBulkLoaderService();
        return new DBTaskInput() {
            @Override
            public TaskInputData getTaskInputData() {
                return new DBTaskInputData(bulkLoaderService.getUspBulkMgtListSel());
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
        for(Map<String, Object> map : taskInputData.getInputData()) {
            doProcessSub(map);
        }
    }

    private void doProcessSub(Map<String, Object> map) {
        final BulkLoaderService bulkLoaderService = getTaskManager().getBulkLoaderService();

        final String seqNo = BulkUtil.getMapStringData(map, "SEQ_NO");
        final String totalId = BulkUtil.getMapStringData(map, "TOTAL_ID");
        final String iud = BulkUtil.getMapStringData(map, "IUD");

        if(!McpString.isNullOrEmpty(totalId) && !McpString.isNullOrEmpty(iud)) {
            log.info( "Bulk load seqNo = {}, totalId = {}, iud = {} Start ", seqNo, totalId, iud);
            bulkLoaderService.insertBulkLoaderData( map );
            log.info( "Bulk load seqNo = {}, totalId = {}, iud = {} End ", seqNo, totalId, iud);
        }
    }
}
