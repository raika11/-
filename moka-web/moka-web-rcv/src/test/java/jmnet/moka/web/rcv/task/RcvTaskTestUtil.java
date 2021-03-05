package jmnet.moka.web.rcv.task;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.code.OpCode;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.base.TaskManager;
import jmnet.moka.web.rcv.taskinput.DBTaskInputData;
import jmnet.moka.web.rcv.util.XMLUtil;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task
 * ClassName : RcvTaskTestUtil
 * Created : 2021-03-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-03-05 005 오후 3:48
 */
public class RcvTaskTestUtil {
    private final RcvTaskTest rcvTaskTest;
    private TaskManager taskManager;

    public RcvTaskTestUtil(RcvTaskTest rcvTaskTest) {
        this.rcvTaskTest = rcvTaskTest;
        initTaskManager();
    }

    private void initTaskManager() {
        this.taskManager = new TaskManager(rcvTaskTest.getMokaRcvConfiguration());
        this.taskManager.setJamXmlService(rcvTaskTest.getJamXmlService());
        this.taskManager.setXmlGenService(rcvTaskTest.getXmlGenService());
        this.taskManager.setCpXmlService(rcvTaskTest.getCpXmlService());
        this.taskManager.setPubXmlService(rcvTaskTest.getPubXmlService());
        this.taskManager.setRcvArtRegService(rcvTaskTest.getRcvArtRegService());
        this.taskManager.setCallJamApiService(rcvTaskTest.getCallJamApiService());
        this.taskManager.setArtAfterIudService(rcvTaskTest.getArtAfterIudService());
        this.taskManager.setWeatherShkoService(rcvTaskTest.getWeatherShkoService());
        this.taskManager.setJoinsLandService(rcvTaskTest.getJoinsLandService());
        this.taskManager.setSlackMessageService(rcvTaskTest.getSlackMessageService());
        this.taskManager.setPurgeService(rcvTaskTest.getPurgeService());
        this.taskManager.setTaskGroups( new ArrayList<>() );
    }

    private TaskGroup getTaskGroup(){
        if(this.taskManager == null)
            initTaskManager();

        TaskGroup taskGroup = new TaskGroup(this.taskManager, "테스트 그룹");
        this.taskManager.getTaskGroups().add(taskGroup);
        return taskGroup;
    }

    private Task<?> getTask( TaskGroup taskGroup, String taskConf ){
        XMLUtil xu = new XMLUtil();
        try {
            Document doc = xu.getDocument(taskConf);
            NodeList nl = xu.getNodeList(doc, "//Task");
            if( nl.getLength() == 0 )
                return null;
            Node node = nl.item(0);

            final String cls = xu.getString(node, "./@class", "");
            if(McpString.isNullOrEmpty(cls))
                return null;

            Task<?> task = (Task<?>) Class.forName(cls)
                                  .getDeclaredConstructor(TaskGroup.class, Node.class, XMLUtil.class)
                                  .newInstance(taskGroup, node, xu);
            taskGroup.getTasks().add(task);
            return task;
        } catch (Exception e) {
            return null;
        }
    }

    @SuppressWarnings("SameParameterValue")
    public boolean processDBTask( String taskConf, Map<String, Object> map) {
        return processDBTask( taskConf, map, false);
    }

    public boolean processDBTask( String taskConf, Map<String, Object> map, boolean wait ) {
        try {
            @SuppressWarnings("unchecked")
            Task<DBTaskInputData> task = (Task<DBTaskInputData>) getTask(getTaskGroup(), taskConf);
            if( task == null )
                return false;

            List<Map<String, Object>> inputData = new ArrayList<>();
            inputData.add( map );
            task.doProcess(new DBTaskInputData(inputData));

            if( wait ){
                Thread.sleep(10000);
            }

            task.stopServer();

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean processFileTask(String taskConf)
    {
        try {
            Task<?> task = getTask(getTaskGroup(), taskConf);
            if( task == null )
                return false;

            taskManager.operation(OpCode.start);
            Thread.sleep(15000);
            taskManager.operation(OpCode.stop);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
