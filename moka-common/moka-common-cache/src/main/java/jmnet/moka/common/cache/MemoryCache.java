package jmnet.moka.common.cache;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.common.cache.model.Cache;

public class MemoryCache extends AbstractCache {
    private static final Logger logger = LoggerFactory.getLogger(MemoryCache.class);
    private Map<String, Map<String, CacheObject>> memory;
    private List<String> typeList;

    public MemoryCache(Cache cache) {
        super(cache.getInstanceName(), cache.getExpireMap(), cache.getExpire(),
                cache.getPropertyMap());
        this.memory = new HashMap<String, Map<String, CacheObject>>();
        this.typeList = new LinkedList<String>();
    }

    private Map<String, CacheObject> getTypeMap(String type) {
        return getTypeMap(type, true);
    }

    private Map<String, CacheObject> getTypeMap(String type, boolean createIfAbsent) {
        Map<String, CacheObject> typeMap = this.memory.get(type);
        if (typeMap == null && createIfAbsent) {
            synchronized (this.memory) {
                typeMap = this.memory.get(type);
                if (typeMap == null) {
                    this.typeList.add(type);
                    typeMap = new ConcurrentHashMap<String, CacheObject>();
                    this.memory.put(type, typeMap);
                }
            }
        }
        return typeMap;
    }

    @Override
    public void set(String type, String key, String value) {
        set(type, key, value, this.getExpire(type));
    }

    @Override
    public void set(String type, String key, String value, long expire) {
        Map<String, CacheObject> typeMap = this.getTypeMap(type);
        CacheObject cacheObject = typeMap.get(key);
        if (cacheObject == null) {
            typeMap.put(key, new CacheObject(key, value, expire));
        } else {
            cacheObject.setValue(value);
        }
        logger.debug("CACHE [{}] SET: {} {}", this.name, type, key);
    }

    @Override
    public String get(String type, String key) {
        Map<String, CacheObject> typeMap = this.getTypeMap(type, false);
        if (typeMap == null) {
            logger.warn("CACHE [{}] GET: {} {} TypeMap is not exist", this.name, type, key);
            return null;
        }
        CacheObject cacheObject = typeMap.get(key);
        if (cacheObject == null) {
            return null;
        } else {
            if (cacheObject.isExpired()) {
                logger.debug("CACHE [{}] GET: {} {} EXPIRED", this.name, type, key);
                return null;
            } else {
                logger.debug("CACHE [{}] GET: {} {}", this.name, type, key);
                return cacheObject.getValue();
            }
        }
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
                Map<String, CacheObject> typeMap = this.getTypeMap(type, false);
                if (typeMap != null) {
                    if (typeMap.remove(key) != null) {
                        logger.debug("CACHE [{}] PURGE: {} {}", this.name, type, key);
                        result.put(PURGE_RESULT, PURGE_RESULT_SUCCESS);
                    } else {
                        logger.debug("CACHE [{}] PURGE: Not Found {} {}", this.name, type, key);
                        result.put(PURGE_RESULT, PURGE_RESULT_NOTFOUND);
                    }
                } else {
                    throw new CacheException("Type is not found");
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
                Map<String, CacheObject> typeMap = this.getTypeMap(type, false);
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
                Map<String, CacheObject> typeMap = this.getTypeMap(type, false);
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
        long startTime = System.currentTimeMillis();
        int gcCount = 0;
        for (String type : this.typeList) {
            Map<String, CacheObject> typeMap = this.memory.get(type);
            if (typeMap != null && typeMap.size() > 0) {
                long typeExpire = this.getExpire(type);
                if (typeExpire > 0) {
                    List<CacheObject> gcList = new LinkedList<CacheObject>();
                    try {
                        for (Entry<String, CacheObject> entry : typeMap.entrySet()) {
                            if (entry.getValue().isExpired()) {
                                gcList.add(entry.getValue());
                            }
                        }
                    } catch (Exception e) {
                        logger.warn("MemoryCache - {} : GC Fail : {} {}", type, gcList.size(), e);
                    }
                    for (CacheObject cacheObject : gcList) {
                        if (cacheObject.isExpired()) { // 새로운 값으로 캐시될 수 있음
                            typeMap.remove(cacheObject.getKey());
                            gcCount++;
                        }
                    }
                }
            }
        }
        logger.debug("MemoryCache - {} : GC Result : {} {}ms", this.getName(), gcCount,
                System.currentTimeMillis() - startTime);
    }

    @Override
    public void shutdown() {
        // nothing to do
    }

}
