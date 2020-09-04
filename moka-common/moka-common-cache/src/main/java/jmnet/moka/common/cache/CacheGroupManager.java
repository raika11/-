package jmnet.moka.common.cache;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.common.cache.model.Cache;
import jmnet.moka.common.cache.model.CacheGroup;

public class CacheGroupManager implements Runnable {
    private final static Logger logger = LoggerFactory.getLogger(CacheGroupManager.class);
    private CacheGroup cacheGroup;
    private Thread gcThread;
    private long gcInterval;
    private String name;
    private List<Cacheable> cacheList;

    public CacheGroupManager(CacheGroup cacheGroup) throws ClassNotFoundException,
            NoSuchMethodException, SecurityException, InstantiationException,
            IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        this.cacheGroup = cacheGroup;
        init();
    }

    public void init() throws ClassNotFoundException, NoSuchMethodException, SecurityException,
            InstantiationException, IllegalAccessException, IllegalArgumentException,
            InvocationTargetException {
        this.gcInterval = this.cacheGroup.getGcInterval();
        this.name = this.cacheGroup.getName();
        this.cacheList = new ArrayList<Cacheable>();
        for (Cache cache : cacheGroup.getCacheList()) {
            if (cache.isEnable()) {
                Class<?> claz = Class.forName(cache.getInstanceClass());
                Constructor<?> constructor = claz.getConstructor(Cache.class);
                Cacheable cachable = (Cacheable) constructor.newInstance(cache);
                this.cacheList.add(cachable);
            }
        }
        this.gcThread = new Thread(this, "CacheGroup GC Thread-" + this.name);
        this.gcThread.setDaemon(true);
        this.gcThread.start();
    }

    public void set(String type, String key, String value) {
        for (Cacheable cache : this.cacheList) {
            cache.set(type, key, value);
        }
    }

    public void set(String type, String key, String value, long expire) {
        for (Cacheable cache : this.cacheList) {
            cache.set(type, key, value, expire);
        }
    }

    public String get(String type, String key) {
        for (Cacheable cache : this.cacheList) {
            String value = cache.get(type, key);
            if (value != null) {
                return value;
            }
        }
        return null;
    }

    public List<Map<String, Object>> purge(String type, String key) throws CacheException {
        List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
        for (Cacheable cache : this.cacheList) {
            resultList.add(cache.purge(type, key));
        }
        return resultList;
    }

    public List<Map<String, Object>> purgeStartsWith(String type, String keyPrefix)
            throws CacheException {
        List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
        for (Cacheable cache : this.cacheList) {
            resultList.add(cache.purgeStartsWith(type, keyPrefix));
        }
        return resultList;
    }

    public List<Map<String, Object>> purgeAll(String type) throws CacheException {
        List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
        for (Cacheable cache : this.cacheList) {
            resultList.add(cache.purgeAll(type));
        }
        return resultList;
    }

    public void run() {
        try {
            while (true) {
                Thread.sleep(this.gcInterval);
                for (Cacheable cache : this.cacheList) {
                    cache.gc();
                }
            }
        } catch (InterruptedException e) {
            logger.warn("{} - {}", Thread.currentThread().getName(), e.getMessage());
        }
    }

    public void shutdown() {
        if (this.gcThread != null) {
            this.gcThread.interrupt();
        }
        for (Cacheable cache : this.cacheList) {
            cache.shutdown();
        }
    }
}
