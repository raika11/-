package jmnet.moka.common.cache;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.common.cache.infinispan.InfinispanDelegator;
import jmnet.moka.common.cache.model.Cache;

public class InfinispanCache extends AbstractCache {
    private final static Logger logger = LoggerFactory.getLogger(InfinispanCache.class);
    private final static String CONFIG_PROPERTY = "config";
    private final static int GET_TIMEOUT = 2000;
    private List<String> typeList;
    private InfinispanDelegator ifnspsDelegator;

    public InfinispanCache(Cache cache) throws FileNotFoundException, IOException {
        super(cache.getInstanceName(), cache.getExpireMap(), cache.getExpire(),
                cache.getPropertyMap());
        this.typeList = new LinkedList<String>();
        String configLocation = this.propertyMap.get(CONFIG_PROPERTY);
        this.ifnspsDelegator = new InfinispanDelegator(configLocation);
    }

    @Override
    public void set(String type, String key, String value) {
        set(type, key, value, this.getExpire(type));
    }

    @Override
    public void set(String type, String key, String value, long expire) {
        if (type == null || key == null || value == null)
            return;
        org.infinispan.Cache<String, String> typeMap = this.ifnspsDelegator.getCache(type);
        if (typeMap != null) {
            if (this.typeList.contains(type) == false) {
                synchronized (this.typeList) {
                    if (this.typeList.contains(type) == false) {
                        this.typeList.add(type);
                    }
                }
            }
            typeMap.putAsync(key, value, expire, TimeUnit.MILLISECONDS);
            logger.debug("CACHE [{}] SET: {} {}", this.name, type, key);
        }
    }

    @Override
    public String get(String type, String key) {
        if (type == null || key == null)
            return null;
        org.infinispan.Cache<String, String> typeMap = this.ifnspsDelegator.getCache(type);
        if (typeMap != null) {
            try {
                CompletableFuture<String> future = typeMap.getAsync(key);
                String cached = future.get(GET_TIMEOUT, TimeUnit.MILLISECONDS);
                if (cached != null) {
                    logger.debug("CACHE [{}] GET: {} {}", this.name, type, key);
                } else {
                    logger.debug("CACHE [{}] GET: {} {} EMPTY", this.name, type, key);
                }
                return cached;
            } catch (InterruptedException | ExecutionException | TimeoutException e) {
                logger.warn("CACHE [{}] GET FAIL: {} {}", this.name, type, key);
                return null;
            }
        }
        return null;
    }

    @Override
    public Map<String, Object> purge(String type, String key) throws CacheException {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put(PURGE_TYPE, type);
        result.put(PURGE_KEY, key);
        try {
            if (type == null || key == null) {
                throw new CacheException("Type or key is not found");
            } else {
                if (this.typeList.contains(type) == false) {
                    throw new CacheException("Type is not found");
                }
                org.infinispan.Cache<String, String> typeMap = this.ifnspsDelegator.getCache(type);
                if (typeMap != null) {
                    typeMap.remove(key);
                    logger.debug("CACHE [{}] PURGE: {} {}", this.name, type, key);
                    result.put(PURGE_RESULT, PURGE_RESULT_SUCCESS);
                } else {
                    logger.debug("CACHE [{}] PURGE: Not Found {}", this.name, type);
                    result.put(PURGE_RESULT, PURGE_RESULT_NOTFOUND);
                }
            }
        } catch (Exception e) {
            logger.error("PURGE FAIL: {} {}", type, key, e);
            throw new CacheException(String.format("Purge Fail: %s", e.getMessage()), e);
        }
        return result;
    }

    @Override
    public Map<String, Object> purgeStartsWith(String type, String keyPrefix)
            throws CacheException {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put(PURGE_TYPE, type);
        result.put(PURGE_KEY, keyPrefix);
        try {
            if (type == null || keyPrefix == null) {
                throw new CacheException("Type or keyPrefix is null");
            } else {
                if (this.typeList.contains(type) == false) {
                    throw new CacheException("Type is not found");
                }
                org.infinispan.Cache<String, String> typeMap = this.ifnspsDelegator.getCache(type);
                if (typeMap != null) {
                    int purgeCount = 0;
                    for (String key : typeMap.keySet()) {
                        if (key.startsWith(keyPrefix)) {
                            typeMap.remove(key);
                            purgeCount++;
                        }
                    }
                    logger.debug("CACHE [{}] PURGE startsWith: {} {} {}", this.name, type,
                            keyPrefix, purgeCount);
                    result.put(PURGE_RESULT, PURGE_RESULT_SUCCESS);
                    result.put(PURGE_COUNT, purgeCount);
                } else {
                    throw new CacheException("Type is not found");
                }
            }
        } catch (Exception e) {
            logger.error("PURGE_STARTSWITH FAIL: {} {}", type, keyPrefix, e);
            throw new CacheException(String.format("PurgeStartWith Fail: %s", e.getMessage()), e);
        }
        return result;
    }

    @Override
    public Map<String, Object> purgeAll(String type) throws CacheException {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put(PURGE_TYPE, type);
        result.put(PURGE_KEY, null);
        try {
            if (type == null) {
                throw new CacheException("Type is null");
            } else {
                org.infinispan.Cache<String, String> typeMap = this.ifnspsDelegator.getCache(type);
                if (typeMap != null) {
                    typeMap.clear();
                    logger.debug("CACHE [{}] PURGE: {}", this.name, type);
                    result.put(PURGE_RESULT, PURGE_RESULT_SUCCESS);
                } else {
                    throw new CacheException("Type is not found");
                }
            }
        } catch (Exception e) {
            logger.error("PURGE_ALL FAIL: {}", type, e);
            throw new CacheException(String.format("PurgeAll Fail: %s", e.getMessage()), e);
        }
        return result;
    }

    @Override
    public void gc() {
        // infinispan의 ttl로 설정됨
    }

    @Override
    public void shutdown() {
        this.ifnspsDelegator.shutdown();
    }

}
