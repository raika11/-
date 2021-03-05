package jmnet.moka.web.rcv.task;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.Map;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.service.SlackMessageService;
import jmnet.moka.web.rcv.task.artafteriud.service.ArtAfterIudService;
import jmnet.moka.web.rcv.task.calljamapi.service.CallJamApiService;
import jmnet.moka.web.rcv.task.cpxml.service.CpXmlService;
import jmnet.moka.web.rcv.task.jamxml.service.JamXmlService;
import jmnet.moka.web.rcv.task.jamxml.service.PurgeService;
import jmnet.moka.web.rcv.task.jamxml.service.XmlGenService;
import jmnet.moka.web.rcv.task.joinsland.service.JoinsLandService;
import jmnet.moka.web.rcv.task.pubxml.service.PubXmlService;
import jmnet.moka.web.rcv.task.rcvartreg.service.RcvArtRegService;
import jmnet.moka.web.rcv.task.weathershko.service.WeatherShkoService;
import lombok.Getter;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task
 * ClassName : RcvTaskTest
 * Created : 2021-03-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-03-05 005 오후 3:47
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureBefore(MokaRcvConfiguration.class)
@Getter
public class RcvTaskTest {
    @Autowired
    MokaRcvConfiguration mokaRcvConfiguration;

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
    JoinsLandService joinsLandService;

    @Autowired
    SlackMessageService slackMessageService;

    @Autowired
    PurgeService purgeService;

    @Test
    public void doProcessJamXml() {
        final String taskConf =
                "<Task class=\"jmnet.moka.web.rcv.task.jamxml.JamXmlTask\"\n"
                        + "    name=\"중앙일보(속보)\"\n"
                        + "    sourceCode=\"3\"\n"
                        + "    retryCount=\"3\"\n"
                        + "    intervalTime=\"10s\">\n"
                        + "    <TaskInput dirInput=\"/box/rcv/jam/Joongang_Sokbo\"\n"
                        + "      dirSuccess=\"/box/rcv/jam/Joongang_Sokbo/comp\"\n"
                        + "      dirFailed=\"/box/rcv/jam/Joongang_Sokbo/error\"\n"
                        + "      fileFilter=\"*.xml\"\n"
                        + "      fileWaitTime=\"3s\"\n"
                        + "      alertLimitUse=\"1\"\n"
                        + "      alertLimitFileCount=\"50\"\n"
                        + "      alertLimitFileTime=\"20m\"\n"
                        + "      retryCount=\"3\"/>\n"
                        + "  </Task>";

        assertTrue((new RcvTaskTestUtil(this)).processFileTask(taskConf));
    }

    @Test
    public void doProcessCpXml() {
        final String taskConf =
                "<Task class=\"jmnet.moka.web.rcv.task.cpxml.CpXmlTask\"\n"
                        + "    name=\"Join:D\"\n"
                        + "    idx=\"163\"\n"
                        + "    sourceCode=\"l1\"\n"
                        + "    receiveImage=\"N\"\n"
                        + "    retryCount=\"3\"\n"
                        + "    pdsUploadKeyTitle=\"joind_news\"\n"
                        + "    editYn=\"N\"\n"
                        + "    intervalTime=\"10s\">\n"
                        + "    <TaskInput dirInput=\"/box/rcv/cp/joind_news\"\n"
                        + "      dirSuccess=\"/box/rcv/cp/joind_news/comp\"\n"
                        + "      dirFailed=\"/box/rcv/cp/joind_news/error\"\n"
                        + "      fileFilter=\"*.xml\"\n"
                        + "      fileWaitTime=\"3s\"\n"
                        + "      alertLimitUse=\"1\"\n"
                        + "      alertLimitFileCount=\"50\"\n"
                        + "      alertLimitFileTime=\"20m\"\n"
                        + "      retryCount=\"3\"/>\n"
                        + "  </Task>";

        assertTrue((new RcvTaskTestUtil(this)).processFileTask(taskConf));
    }

    @Test
    public void doProcessArtAfterIud() {
        final String taskConf = "<Task class=\"jmnet.moka.web.rcv.task.artafteriud.ArtAfterIudTask\"\n"
                + "    name=\"등록기사 After Iud\"\n"
                + "    intervalTime=\"10s\">\n"
                + "  </Task>";

        Map<String, Object> map = new HashMap<>();
        map.put("IUD", "E");
        map.put("IUD_TOTAL_ID", 24012433);
        map.put("SOURCE_CODE", "l1");
        map.put("JAM_ID", 0);
        map.put("RID", 0);
        map.put("ART_TITLE", "&#91;파커&#93; 디파이 이자 농사 직접 해봤다..그 결과는?");

        assertTrue((new RcvTaskTestUtil(this)).processDBTask(taskConf, map));
    }
}