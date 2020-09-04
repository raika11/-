package jmnet.moka.core.common.purge;

import static org.junit.Assert.assertNotNull;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jmnet.moka.core.common.purge.model.ApiPurgeTask;
import jmnet.moka.core.common.purge.model.PagePurgeTask;
import jmnet.moka.core.common.purge.model.PurgeResult;
import jmnet.moka.core.common.purge.model.ReservedPurgeTask;

/**
 * Unit test for simple App.
 */
public class PurgerTest {
    public static final Logger logger = LoggerFactory.getLogger(PurgerTest.class);

    @Test
    public void apiPurgeTask()
            throws JsonGenerationException, JsonMappingException, IOException {
        ApiPurgeTask task = new ApiPurgeTask("dps.msp.com", "dps");
        task.addHttpHost("dps1.msp.com");
        task.addHttpHost("dps2.msp.com");
        task.setHttpPort(80);
        task.addVarnishHost("101.55.50.47");
        task.addVarnishHost("101.55.50.49");
        task.setVarnishPort(80);
        Map<String, Object> paramMap = new LinkedHashMap<String, Object>();
        paramMap.put("domainId", 1000);
        paramMap.put("id", 10);
        task.addPurgeApi("sys_api", "tp.list", paramMap);
        List<PurgeResult> purgeResultList = task.purge();
        viewResult(purgeResultList);
        assertNotNull(purgeResultList);
    }

    @Test
    public void pagePurgeTask()
            throws JsonGenerationException, JsonMappingException, IOException {
        PagePurgeTask task = new PagePurgeTask();
        task.addHttpHost("tms1.msp.com");
        task.addHttpHost("tms2.msp.com");
        task.setHttpPort(80);
        task.addVarnishHost("101.55.50.47");
        task.addVarnishHost("101.55.50.49");
        task.setVarnishPort(80);
        task.addPurgeItem("1000", "TP", "10");
        task.addPurgeItem("1000", "CP", "31");
        task.addPurgeItem("1000", "PG", "6");
        task.addPurgeUrl("news.msp.com", "/paging.*", true);
        List<PurgeResult> purgeResultList = task.purge();
        viewResult(purgeResultList);
    }

    @Test
    public void reservedPurgeTask()
            throws JsonGenerationException, JsonMappingException, IOException {
        ReservedPurgeTask task = new ReservedPurgeTask();
        task.addHttpHost("tms1.msp.com");
        task.addHttpHost("tms2.msp.com");
        task.setHttpPort(80);
        Map<String, Object> paramMap = new LinkedHashMap<String, Object>();
        paramMap.put(ReservedPurgeTask.TMS_PARAM_DOMAIN_ID, "1000");
        List<PurgeResult> purgeResultList = task.purge();
        viewResult(purgeResultList);
    }

    private void viewResult(List<PurgeResult> purgeResultList)
            throws JsonGenerationException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        Writer w = new StringWriter();
        mapper.writeValue(w, purgeResultList);
        logger.debug("{}", w.toString());
    }
}
