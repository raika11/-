package jmnet.moka.common.cache.infinispan;

import java.io.IOException;
import java.util.concurrent.TimeUnit;
import org.infinispan.Cache;
import org.infinispan.configuration.cache.CacheMode;
import org.infinispan.configuration.cache.Configuration;
import org.infinispan.configuration.cache.ConfigurationBuilder;
import org.infinispan.manager.DefaultCacheManager;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

public class InfinispanDelegator {
    private DefaultCacheManager cacheManager;
    private InfinispanCacheListener cacheListener;
    private InfinispanClusterListener clusterListener;

    public InfinispanDelegator(String configLocation) throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource resource = resolver.getResource(configLocation);
        this.cacheManager = new DefaultCacheManager(resource.getInputStream());
        this.clusterListener = new InfinispanClusterListener();
        this.cacheManager.addListener(this.clusterListener);
        this.cacheListener = new InfinispanCacheListener();
        this.cacheManager.addListener(this.cacheListener);
    }

    public void shutdown() {
        if (this.cacheManager != null) {
            this.cacheManager.stop();
        }
    }

    //    public Cache<String, String> transactionalCache(String cacheName) {
    //        if (this.cacheManager.cacheExists(cacheName)) {
    //            return this.cacheManager.getCache(cacheName);
    //        }
    //        return this.buildCache(cacheName, this.cacheManager, this.cacheListener,
    //                transactionalConfiguration());
    //    }
    //
    //    public Cache<String, String> simpleCache(String cacheName) {
    //        return this.buildCache(cacheName, this.cacheManager, this.cacheListener,
    //                new ConfigurationBuilder().build());
    //    }
    //
    //    public Cache<String, String> expiringCache(String cacheName) {
    //        return this.buildCache(cacheName, this.cacheManager, this.cacheListener,
    //                expiringConfiguration());
    //    }
    //
    //    public Cache<String, String> evictingCache(String cacheName) {
    //        return this.buildCache(cacheName, this.cacheManager, this.cacheListener,
    //                evictingConfiguration());
    //    }
    //
    //    public Cache<String, String> passivatingCache(String cacheName) {
    //        return this.buildCache(cacheName, this.cacheManager, this.cacheListener,
    //                passivatingConfiguration());
    //    }

    public <K, V> Cache<K, V> getCache(String cacheName) {
        if (this.cacheManager.cacheExists(cacheName)) {
            return this.cacheManager.getCache(cacheName);
        }
        cacheManager.defineConfiguration(cacheName, clusteringConfiguration());
        Cache<K, V> cache = cacheManager.getCache(cacheName);
        cache.addListener(this.cacheListener);
        return cache;
    }

    //    private <K, V> Cache<K, V> buildCache(String cacheName, DefaultCacheManager cacheManager,
    //            InfinispanCacheListener listener, Configuration configuration) {
    //
    //        cacheManager.defineConfiguration(cacheName, configuration);
    //        Cache<K, V> cache = cacheManager.getCache(cacheName);
    //        cache.addListener(listener);
    //        return cache;
    //    }

    private Configuration clusteringConfiguration() {
        return new ConfigurationBuilder().clustering().cacheMode(CacheMode.DIST_SYNC).expiration()
                .lifespan(10, TimeUnit.SECONDS)
                .build();
    }

    //    private Configuration expiringConfiguration() {
    //        return new ConfigurationBuilder().expiration().lifespan(10, TimeUnit.SECONDS).build();
    //    }
    //
    //    private Configuration evictingConfiguration() {
    //        return new ConfigurationBuilder().memory().evictionType(EvictionType.COUNT).size(1).build();
    //    }
    //
    //    private Configuration passivatingConfiguration() {
    //        return new ConfigurationBuilder().memory().evictionType(EvictionType.COUNT).size(1)
    //                .persistence().passivation(true).addSingleFileStore().purgeOnStartup(true)
    //                .location(System.getProperty("java.io.tmpdir")).build();
    //    }
    //
    //    private Configuration transactionalConfiguration() {
    //        return new ConfigurationBuilder().transaction()
    //                .transactionMode(TransactionMode.TRANSACTIONAL).lockingMode(LockingMode.PESSIMISTIC)
    //                .build();
    //    }
}
