package jmnet.moka.common.cache;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import org.xml.sax.SAXException;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.common.cache.model.CacheGroup;

public class CacheManager {
    private static String CACHE_GROUP_DEFAULT = "default";
    private Map<String, CacheGroup> cacheGroupMap;
    private Map<String, CacheGroupManager> cacheGrouManagerMap;
    private int cacheGroupSize;

    public CacheManager(File configXmlFile) throws XPathExpressionException,
            ParserConfigurationException, SAXException, IOException, ClassNotFoundException,
            NoSuchMethodException, SecurityException, InstantiationException,
            IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        this(Files.newInputStream(configXmlFile.toPath()));
    }

    public CacheManager(InputStream configXmlStream) throws XPathExpressionException,
            ParserConfigurationException, SAXException, IOException, ClassNotFoundException,
            NoSuchMethodException, SecurityException, InstantiationException,
            IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        this.cacheGrouManagerMap = new HashMap<String, CacheGroupManager>();
        this.loadConfig(configXmlStream);
        this.init();
    }

    public void loadConfig(InputStream configXmlStream) throws ParserConfigurationException,
            SAXException, IOException, XPathExpressionException {
        CacheConfigParser parser = new CacheConfigParser(configXmlStream);
        this.cacheGroupMap = parser.getCacheConfig();
        cacheGroupSize = this.cacheGroupMap.size();
    }

    private void init() throws ClassNotFoundException, NoSuchMethodException, SecurityException,
            InstantiationException, IllegalAccessException, IllegalArgumentException,
            InvocationTargetException {
        for (Entry<String, CacheGroup> cacheGroupEntry : this.cacheGroupMap.entrySet()) {
            this.cacheGrouManagerMap.put(cacheGroupEntry.getKey(),
                    new CacheGroupManager(cacheGroupEntry.getValue()));
        }
    }

    public Cacheable getCache(Class<?> claz) {
        for (CacheGroupManager cacheGrouManager: this.cacheGrouManagerMap.values()) {
            for ( Cacheable cachable : cacheGrouManager.getCacheList() ) {
                if ( claz.isInstance(cachable)) {
                    return cachable;
                }
            }
        }
        return null;
    }

    public boolean enabled() {
        return this.cacheGroupSize > 0;
    }

    public String get(String type, String key) {
        if (cacheGroupSize == 0)
            return null;
        return get(CACHE_GROUP_DEFAULT, type, key);
    }

    public String get(String cacheGroupName, String type, String key) {
        if (cacheGroupSize == 0)
            return null;
        CacheGroupManager cacheGroupManager = cacheGrouManagerMap.get(cacheGroupName);
        if (cacheGroupManager == null) {
            return null;
        } else {
            return cacheGroupManager.get(type, key);
        }
    }

    public void set(String type, String key, String value) {
        if (cacheGroupSize == 0)
            return;
        set(CACHE_GROUP_DEFAULT, type, key, value);
    }

    public void set(String type, String key, String value, long expire) {
        if (cacheGroupSize == 0)
            return;
        set(CACHE_GROUP_DEFAULT, type, key, value, expire);
    }

    public void set(String cacheGroupName, String type, String key, String value) {
        if (cacheGroupSize == 0)
            return;
        CacheGroupManager cacheGroupManager = cacheGrouManagerMap.get(cacheGroupName);
        if (cacheGroupManager == null) {
            return;
        } else {
            cacheGroupManager.set(type, key, value);
        }
    }

    public void set(String cacheGroupName, String type, String key, String value, long expire) {
        if (cacheGroupSize == 0)
            return;
        CacheGroupManager cacheGroupManager = cacheGrouManagerMap.get(cacheGroupName);
        if (cacheGroupManager == null) {
            return;
        } else {
            cacheGroupManager.set(type, key, value, expire);
        }
    }

    public List<Map<String, Object>> purge(String type, String key) throws CacheException {
        return purge(CACHE_GROUP_DEFAULT, type, key);
    }


    public List<Map<String, Object>> purge(String cacheGroupName, String type, String key)
            throws CacheException {
        if (cacheGroupSize == 0)
            throw new CacheException("Cache Group is empty");
        CacheGroupManager cacheGroupManager = cacheGrouManagerMap.get(cacheGroupName);
        if (cacheGroupManager == null) {
            throw new CacheException("Cache Group is not found");
        } else {
            return cacheGroupManager.purge(type, key);
        }
    }

    public List<Map<String, Object>> purgeStartsWith(String type, String key)
            throws CacheException {
        return purgeStartsWith(CACHE_GROUP_DEFAULT, type, key);
    }

    public List<Map<String, Object>> purgeStartsWith(String cacheGroupName, String type,
            String keyPrefix) throws CacheException {
        if (cacheGroupSize == 0)
            throw new CacheException("Cache Group is empty");
        CacheGroupManager cacheGroupManager = cacheGrouManagerMap.get(cacheGroupName);
        if (cacheGroupManager == null) {
            throw new CacheException("Cache Group is not found");
        } else {
            return cacheGroupManager.purgeStartsWith(type, keyPrefix);
        }
    }

    public List<Map<String, Object>> purgeAll(String type) throws CacheException {
        return purgeAll(CACHE_GROUP_DEFAULT, type);
    }

    public List<Map<String, Object>> purgeAll(String cacheGroupName, String type)
            throws CacheException {
        if (cacheGroupSize == 0)
            throw new CacheException("Cache Group is empty");
        CacheGroupManager cacheGroupManager = cacheGrouManagerMap.get(cacheGroupName);
        if (cacheGroupManager == null) {
            throw new CacheException("Cache Group is not found");
        } else {
            return cacheGroupManager.purgeAll(type);
        }
    }

    public List<Map<String, Object>> errorResult(Exception e) {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put(Cacheable.PURGE_RESULT, Cacheable.PURGE_RESULT_EXCEPTION);
        result.put(Cacheable.PURGE_EXCEPTION_MESSGAE, e.getMessage());
        List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
        resultList.add(result);
        return resultList;
    }


    public void shutdown() {
        for (CacheGroupManager cgm : cacheGrouManagerMap.values()) {
            cgm.shutdown();
        }
    }
}
