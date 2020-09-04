package jmnet.moka.common.cache.hazelcast;

import java.io.FileNotFoundException;
import java.io.IOException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import com.hazelcast.config.Config;
import com.hazelcast.config.FileSystemXmlConfig;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.core.IMap;

public class HazelcastDelegator {
    private HazelcastInstance hzInstance;
    private HazelcastMapListener mapListener;

    public HazelcastDelegator(String configLocation)
            throws FileNotFoundException, IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource resource = resolver.getResource(configLocation);
        Config hzConfig = new FileSystemXmlConfig(resource.getFile());
        this.hzInstance = Hazelcast.getOrCreateHazelcastInstance(hzConfig);
        this.mapListener = new HazelcastMapListener();
    }

    public IMap<String, String> getMap(String type) {
        if (this.hzInstance != null && this.hzInstance.getLifecycleService().isRunning()) {
            return this.hzInstance.getMap(type);
        } else {
            return null;
        }
    }

    public void addListener(IMap<String, String> map) {
        if (map != null) {
            map.addEntryListener(this.mapListener, false);
        }
    }

    public void shutdown() {
        if (this.hzInstance != null) {
            this.hzInstance.shutdown();
        }
    }
}
