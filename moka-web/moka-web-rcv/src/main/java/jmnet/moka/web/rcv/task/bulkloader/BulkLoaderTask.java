package jmnet.moka.web.rcv.task.bulkloader;

import java.util.List;
import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.bulkloader.service.BulkLoaderService;
import jmnet.moka.web.rcv.taskinput.DBTaskInput;
import jmnet.moka.web.rcv.taskinput.DBTaskInputData;
import jmnet.moka.web.rcv.util.RcvUtil;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.bulkloader
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
            throws XPathExpressionException, RcvException {
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
            throws RcvDataAccessException {
        for(Map<String, Object> map : taskInputData.getInputData()) {
            doProcessSub(map);
        }
    }

    private void doProcessSub(Map<String, Object> map) {
        final BulkLoaderService bulkLoaderService = getTaskManager().getBulkLoaderService();

        final String seqNo = RcvUtil.getMapStringData(map, "SEQ_NO");
        final String totalId = RcvUtil.getMapStringData(map, "TOTAL_ID");
        final String iud = RcvUtil.getMapStringData(map, "IUD");

        if(!McpString.isNullOrEmpty(totalId) && !McpString.isNullOrEmpty(iud)) {
            log.info( "Bulk load seqNo = {}, totalId = {}, iud = {} Start ", seqNo, totalId, iud);
            bulkLoaderService.insertBulkLoaderData( map );
            log.info( "Bulk load seqNo = {}, totalId = {}, iud = {} End ", seqNo, totalId, iud);
        }
    }
}
