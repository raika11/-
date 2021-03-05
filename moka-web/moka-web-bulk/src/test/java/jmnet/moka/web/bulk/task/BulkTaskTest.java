package jmnet.moka.web.bulk.task;

import static org.junit.Assert.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import jmnet.moka.web.bulk.config.MokaBulkConfiguration;
import jmnet.moka.web.bulk.service.SlackMessageService;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkloader.service.BulkLoaderService;
import jmnet.moka.web.bulk.task.bulksender.service.BulkSenderService;
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
 * Package : jmnet.moka.web.bulk.task.bulkdump
 * ClassName : BulkDumpTaskTest
 * Created : 2021-03-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-03-05 005 오전 9:29
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureBefore(MokaBulkConfiguration.class)
@Getter
public class BulkTaskTest {
    @Autowired
    MokaBulkConfiguration mokaBulkConfiguration;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    BulkLoaderService bulkLoaderService;

    @Autowired
    BulkDumpService bulkDumpService;

    @Autowired
    BulkSenderService bulkSenderService;

    @Autowired
    SlackMessageService slackMessageService;

    @Test
    public void doProcessLoader(){
        final String taskConf =
                "<Task class=\"jmnet.moka.web.bulk.task.bulkloader.BulkLoaderTask\"\n"
                        + "    name=\"벌크 Loader\"\n"
                        + "    contentDiv=\"moka\"\n"
                        + "    intervalTime=\"10s\">\n"
                        + "  </Task>";

        Map<String, Object> map = new HashMap<>();
        map.put("SEQ_NO", 2450 );
        map.put("TOTAL_ID", 23996956);
        map.put("IUD", "U");
        map.put("TITLE", "파티클 테스트용");
        map.put("ORG_SOURCE_CODE", "3");

        assertTrue((new BulkTaskTestUtil(this)).processDBTask(taskConf, map));
    }

    @Test
    public void doProcessDump(){
        final String taskConf =
                "<Task class=\"jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask\"\n"
                        + "    name=\"벌크 Dump\"\n"
                        + "    bulkDumpClientCount=\"5\"\n"
                        + "    bulkDumpEnvFile=\"classpath:conf/bulkdumpenv.xml\"\n"
                        + "    ovpWaitTime=\"10m\"\n"
                        + "    intervalTime=\"10s\">\n"
                        + "  </Task>";

        // 2046	2021-02-18 13:43:34.000	323	SOI	U	23996956	N	N	파티클 테스트용	3
        Map<String, Object> map = new HashMap<>();
        map.put("SEQ_NO", 2046 );
        map.put("INS_DT", new Date());
        map.put("SOURCE_CODE", "323");
        map.put("TARGET_CODE", "SOI");
        map.put("IUD", "U");
        map.put("CONTENT_ID", 23996956);
        map.put("TITLE", "파티클 테스트용");
        map.put("ORG_SOURCE_CODE", "3");
        map.put("JHOT_YN", "N");

        assertTrue((new BulkTaskTestUtil(this)).processDBTask(taskConf, map, true));
    }
}