package jmnet.moka.core.tms.mvc.abtest;

import com.hazelcast.core.HazelcastInstance;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.cache.HazelcastCache;
import jmnet.moka.common.template.Constants;
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
public class AbTestResolver {
    public static final Logger logger = LoggerFactory.getLogger(AbTestResolver.class);

    protected ConcurrentMap<String, AbTest> testMap;

    public AbTestResolver(GenericApplicationContext appContext) {
        HazelcastInstance hzInstance = null;
        HazelcastCache hzCache = null;
        try {
            CacheManager cacheManager = appContext.getBean(CacheManager.class);
            if (cacheManager != null) {
                hzCache = (HazelcastCache) cacheManager.getCache(HazelcastCache.class);
                hzInstance = hzCache
                        .getHazelcastDelegator()
                        .getHazelcastInstance();
            }
        } catch (Exception e) {
            logger.warn("Load hazelcast Instance fail :{}", e.getMessage());
        }

        if (hzInstance != null) {
            this.testMap = hzInstance.getMap("ABTestMap");
        } else {
            this.testMap = new ConcurrentHashMap<>(64);
        }
    }

    public AbTest getAbTest(String domainId, String componentId) {
        return this.testMap.get(domainId+":"+componentId);
    }

    public void addAbTest(AbTest abTest) {
        this.testMap.put(abTest.getDomainId()+":"+abTest.getComponentId(),abTest);
    }

    public Map getTestMap() {
        Map<String,AbTest> returnMap = new HashMap<>(64);
        returnMap.putAll(this.testMap);
        return returnMap;
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
