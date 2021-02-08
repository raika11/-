package jmnet.moka.web.bulk.task.bulkloader;

import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.code.LoaderStatus;
import jmnet.moka.web.bulk.common.task.Task;
import jmnet.moka.web.bulk.common.taskinput.TaskInput;
import jmnet.moka.web.bulk.common.taskinput.TaskInputData;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.exception.BulkDataAccessException;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.task.base.TaskGroup;
import jmnet.moka.web.bulk.task.bulkloader.service.BulkLoaderService;
import jmnet.moka.web.bulk.taskinput.DBTaskInput;
import jmnet.moka.web.bulk.taskinput.DBTaskInputData;
import jmnet.moka.web.bulk.util.BulkStringUtil;
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
    private String contentDiv;
    public BulkLoaderTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        super(parent, node, xu);
    }

    @Override
    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        super.load(node, xu);

        this.contentDiv = xu.getString(node, "./@contentDiv", "");
        if (McpString.isNullOrEmpty(this.contentDiv)) {
            throw new BulkException("BulkLoader contentDiv 환경 값 설정이 잘못되었습니다.");
        }
    }

    @Override
    protected TaskInput initTaskInput() {
        final BulkLoaderService bulkLoaderService = getTaskManager().getBulkLoaderService();
        return new DBTaskInput() {
            @Override
            public TaskInputData getTaskInputData() {
                return DBTaskInputData.newDBTaskInputData(bulkLoaderService.getUspBulkMgtListSel());
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

    private void doProcessSub(Map<String, Object> map)
            throws BulkDataAccessException {
        final BulkLoaderService bulkLoaderService = getTaskManager().getBulkLoaderService();

        final String seqNo = BulkUtil.getMapStringData(map, "SEQ_NO");
        final String totalId = BulkUtil.getMapStringData(map, "TOTAL_ID");
        final String iud = BulkUtil.getMapStringData(map, "IUD");

        if(!McpString.isNullOrEmpty(totalId) && !McpString.isNullOrEmpty(iud)) {
            map.put( "contentDiv", this.contentDiv);
            map.put( "loadStatus", LoaderStatus.Processing);
            TotalVo<Map<String, Object>> totalVo = new TotalVo<>(map);

            bulkLoaderService.insertBulkLog(totalVo, LoaderStatus.Processing, BulkStringUtil.format("{} Bulk load seqNo=[{}], totalId=[{}], iud =[{}] Start ", getTaskName(), seqNo, totalId, iud));
            try {
                bulkLoaderService.insertBulkLoaderData( totalVo );
            }catch (Exception e) {
                bulkLoaderService.insertBulkLog(totalVo, LoaderStatus.Error, BulkStringUtil.format("{} Bulk load seqNo=[{}], totalId=[{}], iud =[{}] Database Error !! ", getTaskName(), seqNo, totalId, iud), true);
                throw new BulkDataAccessException("Database Error !!");
            }
            bulkLoaderService.insertBulkLog(totalVo, totalVo.getReturnValue() == 0 ? LoaderStatus.CompleteBypass : LoaderStatus.Complete,
                    BulkStringUtil.format("{} Bulk load seqNo=[{}], totalId=[{}], iud =[{}] End ", getTaskName(), seqNo, totalId, iud));
        }
    }
}
