package jmnet.moka.core.tms.mvc.abtest;

import com.hazelcast.core.HazelcastInstance;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.cache.HazelcastCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.tms.mvc.controller.abtest
 * ClassName : AbTestResolver
 * Created : 2021-04-05 kspark
 * </pre>
 *
 * @author kspark
 * @since 2021-04-05 오전 10:54
 */
public class PreviewAbTestResolver implements AbTestResolver {
    public static final Logger logger = LoggerFactory.getLogger(PreviewAbTestResolver.class);

    protected Map<String, AbTest> testMap;

    public PreviewAbTestResolver(GenericApplicationContext appContext) {
        this.testMap = new HashMap<>();
    }

    public AbTest getAbTest(String domainId, String componentId) {
        String testKey = getTestKey(domainId,componentId);
        AbTest abTest = this.testMap.get(testKey);
        if ( abTest != null) {
            LocalDateTime end = abTest.getEnd();
            if ( end.isBefore(LocalDateTime.now())) {
                abTest = null;
                this.testMap.remove(testKey);
            }
        }
        return abTest;
    }

    public void addAbTest(AbTest abTest) {
        String testKey = getTestKey(abTest.getDomainId(),abTest.getComponentId());
        this.testMap.put(testKey,abTest);
    }

    public Map getTestMap() {
        return testMap;
    }

    public void removeAbTest(String domainId, String testId) {
        for(Entry<String,AbTest> entry :this.testMap.entrySet()) {
            AbTest abTest = entry.getValue();
            if ( abTest.getId().equals(testId)) {
                this.testMap.remove(entry.getKey());
            }
        }
    }
}
