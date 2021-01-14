package jmnet.moka.web.rcv.task.base;

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
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.service.SmsUtilService;
import jmnet.moka.web.rcv.task.artafteriud.service.ArtAfterIudService;
import jmnet.moka.web.rcv.task.calljamapi.service.CallJamApiService;
import jmnet.moka.web.rcv.task.pubxml.service.PubXmlService;
import jmnet.moka.web.rcv.task.cpxml.service.CpXmlService;
import jmnet.moka.web.rcv.task.jamxml.service.JamXmlService;
import jmnet.moka.web.rcv.task.jamxml.service.XmlGenService;
import jmnet.moka.web.rcv.task.rcvartreg.service.RcvArtRegService;
import jmnet.moka.web.rcv.task.weathershko.service.WeatherShkoService;
import jmnet.moka.web.rcv.util.RcvUtil;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task
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
    private final MokaRcvConfiguration rcvConfiguration;

    private List<TaskGroup> taskGroups;

    @Autowired
    JamXmlService jamXmlService;

    @Autowired
    XmlGenService xmlGenService;

    @Autowired
    CpXmlService cpXmlService;

    @Autowired
    PubXmlService pubXmlService;

    @Autowired
    RcvArtRegService rcvArtRegService;

    @Autowired
    CallJamApiService callJamApiService;

    @Autowired
    ArtAfterIudService artAfterIudService;

    @Autowired
    WeatherShkoService weatherShkoService;

    @Autowired
    SmsUtilService smsUtilService;

    public TaskManager(MokaRcvConfiguration rcvConfiguration) {
        this.rcvConfiguration = rcvConfiguration;
    }

    public boolean loadEnvFile() {
        final String envFile = rcvConfiguration.getTaskManagerEnvFile();
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
        smsUtilService.sendSms(message);
    }
}
