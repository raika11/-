package jmnet.moka.web.bulk.task;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.task.Task;
import jmnet.moka.web.bulk.config.MokaBulkConfiguration;
import jmnet.moka.web.bulk.task.base.TaskGroup;
import jmnet.moka.web.bulk.task.base.TaskManager;
import jmnet.moka.web.bulk.taskinput.DBTaskInputData;
import jmnet.moka.web.bulk.util.XMLUtil;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task
 * ClassName : BulkTaskTestUtil
 * Created : 2021-03-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-03-05 005 오후 3:39
 */
public class BulkTaskTestUtil {
    private final BulkTaskTest bulkTaskTest;
    private TaskManager taskManager;

    public BulkTaskTestUtil(BulkTaskTest bulkTaskTest) {
        this.bulkTaskTest = bulkTaskTest;
        initTaskManager();
    }

    private void initTaskManager() {
        this.taskManager = new TaskManager(new MokaBulkConfiguration());
        this.taskManager.setObjectMapper(bulkTaskTest.getObjectMapper());
        this.taskManager.setBulkLoaderService(bulkTaskTest.getBulkLoaderService());
        this.taskManager.setBulkDumpService(bulkTaskTest.getBulkDumpService());
        this.taskManager.setBulkSenderService(bulkTaskTest.getBulkSenderService());
        this.taskManager.setSlackMessageService(bulkTaskTest.getSlackMessageService());
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

            return (Task<?>) Class.forName(cls)
                                  .getDeclaredConstructor(TaskGroup.class, Node.class, XMLUtil.class)
                                  .newInstance(taskGroup, node, xu);
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
            return false;
        }
    }
}
