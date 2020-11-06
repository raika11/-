package jmnet.moka.common.cache;

import com.hazelcast.core.HazelcastInstance;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.hazelcast.core.ICompletableFuture;
import com.hazelcast.core.IMap;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.common.cache.hazelcast.HazelcastDelegator;
import jmnet.moka.common.cache.model.Cache;

public class HazelcastCache extends AbstractCache {
    private final static Logger logger = LoggerFactory.getLogger(HazelcastCache.class);
    private final static String CONFIG_PROPERTY = "config";
    private final static int GET_TIMEOUT = 2000;
    private List<String> typeList;
    private HazelcastDelegator hzDelegator;

    public HazelcastCache(Cache cache) throws FileNotFoundException, IOException {
        super(cache.getInstanceName(), cache.getExpireMap(), cache.getExpire(),
                cache.getPropertyMap());
        String configLocation = this.propertyMap.get(CONFIG_PROPERTY);
        this.typeList = new LinkedList<String>();
        this.hzDelegator = new HazelcastDelegator(configLocation);
    }

    public HazelcastDelegator getHazelcastDelegator() {
        return this.hzDelegator;
    }

    @Override
    public void set(String type, String key, String value) {
        set(type, key, value, this.getExpire(type));
    }

    @Override
    public void set(String type, String key, String value, long expire) {
        if (type == null || key == null || value == null)
            return;
        IMap<String, String> typeMap = this.hzDelegator.getMap(type);
        if (typeMap != null) {
            synchronized (this.typeList) {
                if (this.typeList.contains(type) == false) {
                    this.typeList.add(type);
                    this.hzDelegator.addListener(typeMap);
                }
            }
            typeMap.setAsync(key, value, expire, TimeUnit.MILLISECONDS);
            logger.debug("CACHE [{}] SET: {} {}", this.name, type, key);
        }
    }

    @Override
    public String get(String type, String key) {
        if (type == null || key == null)
            return null;
        IMap<String, String> typeMap = this.hzDelegator.getMap(type);
        if (typeMap != null) {
            try {
                ICompletableFuture<String> future = typeMap.getAsync(key);
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
                IMap<String, String> typeMap = this.hzDelegator.getMap(type);
                if (typeMap != null) {
                    typeMap.delete(key);
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
                IMap<String, String> typeMap = this.hzDelegator.getMap(type);
                if (typeMap != null) {
                    int purgeCount = 0;
                    for (String key : typeMap.keySet()) {
                        if (key.startsWith(keyPrefix)) {
                            typeMap.delete(key);
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
                IMap<String, String> typeMap = this.hzDelegator.getMap(type);
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
        // hazelcast의 ttl로 설정됨
    }

    @Override
    public void shutdown() {
        this.hzDelegator.shutdown();
    }

}
