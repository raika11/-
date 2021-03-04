package jmnet.moka.web.rcv.task.calljamapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.calljamapi.service.CallJamApiService;
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
 * Package : jmnet.moka.web.rcv.task.calljamapi
 * ClassName : CallJamApiTask
 * Created : 2020-12-09 009 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-09 009 오후 1:06
 */
@Slf4j
public class CallJamApiTask extends Task<DBTaskInputData> {
    private final ObjectMapper objectMapper;

    public CallJamApiTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected TaskInput initTaskInput() {
        final CallJamApiService callJamApiService = getTaskManager().getCallJamApiService();
        return new DBTaskInput() {
            @Override
            public TaskInputData getTaskInputData() {
                return DBTaskInputData.newDBTaskInputData(callJamApiService.getUpaJamRcvArtHistSelList());
            }
        };
    }

    @Override
    protected boolean doVerifyData(DBTaskInputData taskInputData) {
        if( taskInputData.getInputData().size() == 0 ) {
            deleteReceiveJobStep();
            return false;
        }
        return true;
    }

    @Override
    protected void doIdleProcess() {
        super.doIdleProcess();

        deleteReceiveJobStep();
    }

    private void deleteReceiveJobStep() {
        final CallJamApiService callJamApiService = getTaskManager().getCallJamApiService();
        log.info( "{} TB_JAM_RCV_ART_HIST -> TB_JAM_RCV_ART_HIST_SUCC 이전 작업 완료", getTaskName() );
        callJamApiService.deleteReceiveJobStep();
    }

    @Override
    protected void doProcess(DBTaskInputData taskInputData)
            throws RcvDataAccessException {

        MokaRcvConfiguration rcvConfiguration = getTaskManager().getRcvConfiguration();

        final List<Map<String, Object>> mapList = taskInputData.getInputData();
        List<Map<String, Object>> mapListJai = null;
        List<Map<String, Object>> mapListIlg = null;
        try {
            mapListIlg = mapList.stream().filter( a -> RcvUtil.getMapStringData(a, "SITE_CD").equals("ILG")).collect(Collectors.toList());
        }catch (Exception ignore){
            log.trace("CallJamApiTask :: doProcess Exception" );
        }

        try {
            mapListJai = mapList.stream().filter( a -> !RcvUtil.getMapStringData(a, "SITE_CD").equals("ILG") ).collect(Collectors.toList());
        }catch (Exception ignore){
            log.trace("CallJamApiTask :: doProcess 2 Exception" );
        }

        doProcessSendJamApi( rcvConfiguration.getJamApiUrlIlg(), mapListIlg );
        doProcessSendJamApi( rcvConfiguration.getJamApiUrlJai(), mapListJai );
    }

    private void doProcessSendJamApi(String jamApiUrl, List<Map<String, Object>> mapList) {
        if( mapList == null )
            return;
        if( mapList.size() == 0 )
            return;

        try {
            String json = this.objectMapper.writeValueAsString(mapList);
            json = "recvResult={\"RECV_RESULT\": ".concat(json.replace("&#39;", "").concat("}"));

            log.info("{} {} 호출 시작", getTaskName(), jamApiUrl);
            final String req = RcvUtil.SendUrlPostRequest( jamApiUrl, json );

            boolean success = false;
            if(!McpString.isNullOrEmpty(req)) {
                @SuppressWarnings("rawtypes")
                Map reqMap = this.objectMapper.readValue(req, Map.class);
                if( RcvUtil.getMapStringData( reqMap, "success").toLowerCase().equals("success")){
                    success = true;
                }
            }

            if( success ) {
                log.info("{} {} 호출 완료", getTaskName(), jamApiUrl);
                final CallJamApiService callJamApiService = getTaskManager().getCallJamApiService();
                callJamApiService.insertReceiveJobStep(mapList);
            }
            else
                log.error("{} {} 호출 실패 !!", getTaskName(), jamApiUrl);

        } catch (Exception e) {
            log.error( "Jam Api Error {}", jamApiUrl);
        }
    }
}
