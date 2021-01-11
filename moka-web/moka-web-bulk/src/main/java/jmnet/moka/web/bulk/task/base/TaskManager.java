package jmnet.moka.web.bulk.task.base;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.bulk.config.MokaBulkConfiguration;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkloader.service.BulkLoaderService;
import jmnet.moka.web.bulk.util.BulkUtil;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task
 * ClassName : TaskManager
 * Created : 2020-10-26 026 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-26 026 오후 3:28
 */

@Getter
@Slf4j
public class TaskManager {
    private final MokaBulkConfiguration bulkConfiguration;

    private List<TaskGroup> taskGroups;

    @Autowired
    BulkLoaderService bulkLoaderService;

    @Autowired
    BulkDumpService bulkDumpService;

    public TaskManager(MokaBulkConfiguration bulkConfiguration) {
        this.bulkConfiguration = bulkConfiguration;
    }

    public boolean loadEnvFile() {
        final String envFile = bulkConfiguration.getTaskManagerEnvFile();

        try {
            if (!McpString.isNullOrEmpty(envFile)) {
                XMLUtil xu = new XMLUtil();
                return load(xu.getDocument(ResourceMapper.getResouerceResolver().getResource(envFile)), xu);
            }
        } catch (IOException | ParserConfigurationException | SAXException | XPathExpressionException ignored) {
        }
        log.error("TaskManager Can't Load Env File {}", envFile);

        return false;
    }

    @SuppressWarnings("SameReturnValue")
    private boolean load(Document doc, XMLUtil xu)
            throws XPathExpressionException, ParserConfigurationException, SAXException, IOException {
        NodeList nl = xu.getNodeList(doc, "//TaskGroup");

        this.taskGroups = new ArrayList<>();
        for (int i = 0; i < nl.getLength(); i++) {
            this.taskGroups.add(new TaskGroup(nl.item(i), xu, this));
        }

        log.debug("TaskGroup count : {} load", this.taskGroups.size());

        return true;
    }

    public void operation(int opCode)
            throws InterruptedException {
        operation(opCode, "", null);
    }

    public void operation(int opCode, String id, Map<String, Object> responseMap)
            throws InterruptedException {
        for (TaskGroup taskGroup : this.taskGroups) {
            taskGroup.operation(opCode, id, responseMap);
        }
    }

    public void operation(int opCode, Type type)
            throws InterruptedException {
        for (TaskGroup taskGroup : this.taskGroups) {
            taskGroup.operation(opCode, type);
        }
    }

    public void sendErrorSMS(String message) {
        final String envFile = bulkConfiguration.getSmsListEnvFile();

        try {
            if (McpString.isNullOrEmpty(envFile))
                return;

            XMLUtil xu = new XMLUtil();
            Document doc = xu.getDocument(ResourceMapper.getResouerceResolver().getResource(envFile));

            if( !xu.getString( doc, "./SmsSendList/@sendYn", "N" ).equals("Y") )
                return;

            final String sendMsg = message + "\n로그 : https://joongang.co.kr/8nep";
            NodeList nl = xu.getNodeList(doc, "//User");
            for (int i = 0; i < nl.getLength(); i++) {
                if( !xu.getString(nl.item(i), "./@sendYn", "N" ).equals("Y")  )
                    continue;

                final String phoneNumber = xu.getString(nl.item(i), "./@phone", "" );
                if( McpString.isNullOrEmpty(phoneNumber))
                    continue;

                final String strSmsCall = "https://app.joins.com/SMS/?callback=02-2031-1805&phone=" + phoneNumber + "&ap=&uh=&msg=" + URLEncoder.encode(sendMsg,
                        StandardCharsets.UTF_8);
                if( BulkUtil.sendUrlGetRequest(strSmsCall) == null )
                    log.error("SMS failed {}", strSmsCall);
                else
                    log.info("SMS success {}", strSmsCall);
            }

        } catch (IOException | ParserConfigurationException | SAXException | XPathExpressionException ignored) {
        }
    }
}