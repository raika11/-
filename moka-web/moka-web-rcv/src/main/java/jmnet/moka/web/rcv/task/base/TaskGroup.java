package jmnet.moka.web.rcv.task.base;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task
 * ClassName : TaskGroup
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 2:52
 */

@Getter
@Slf4j
public class TaskGroup {
    private String name;
    private List<Task<?>> tasks;
    private final TaskManager taskManager;

    public TaskGroup(Node node, XMLUtil xu, TaskManager taskManager)
            throws XPathExpressionException, IOException, ParserConfigurationException, SAXException {
        this.taskManager = taskManager;
        load(node, xu);
    }

    private void load(Node node, XMLUtil xu)
            throws XPathExpressionException, IOException, ParserConfigurationException, SAXException {
        this.name = xu.getString(node, "./@name", "TASKGROUP");

        final String envFile = xu.getString(node, "./@envFile", "");
        if (!McpString.isNullOrEmpty(envFile)) {
            final File file = new File(ResourceMapper.getAbsolutePath(envFile));
            if (file.exists()) {
                XMLUtil xub = new XMLUtil();
                loadTask(xub.getDocument(file), xub);
            }
        }
    }

    private void loadTask(Document doc, XMLUtil xu) {
        tasks = new ArrayList<>();

        NodeList nl;
        try {
            nl = xu.getNodeList(doc, "//Task");
        } catch (XPathExpressionException ignore) {
            return;
        }

        for (int i = 0; i < nl.getLength(); i++) {
            Task<?> task = null;
            String name = "";
            String cls = "";
            try {
                name = xu.getString(nl.item(i), "./@name", "task");
                cls = xu.getString(nl.item(i), "./@class", "");
                if (McpString.isNullOrEmpty(cls)) {
                    continue;
                }
                task = (Task<?>) Class
                        .forName(cls)
                        .getDeclaredConstructor(TaskGroup.class, Node.class, XMLUtil.class)
                        .newInstance(this, nl.item(i), xu);
            } catch (Exception e) {
                log.error("Can't load [{}]-[{}] [{}] {}", getName(), name, cls, e);
            }

            if (task == null) {
                continue;
            }
            this.tasks.add(task);
            log.info("Task [{}]-[{}] load Success", getName(), task.getName());
        }
        log.debug("Task count : {} load", this.tasks.size());
    }

    public void operation(int opCode, String id, Map<String, Object> responseMap)
            throws InterruptedException {
        final boolean isIdNull = McpString.isNullOrEmpty(id);
        for (Task<?> task : this.tasks) {
            if (!isIdNull) {
                if (!Long.toString(task.getThreadId()).equals(id)) {
                    continue;
                }
            }
            task.operation(opCode, id, responseMap);
        }
    }
}
