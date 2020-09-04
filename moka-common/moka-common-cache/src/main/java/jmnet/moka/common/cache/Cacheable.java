package jmnet.moka.common.cache;

import java.util.Map;
import jmnet.moka.common.cache.exception.CacheException;

public interface Cacheable {
    public static final String PURGE_RESULT = "result";
    public static final String PURGE_TYPE = "type";
    public static final String PURGE_KEY = "key";
    public static final String PURGE_KEY_PREFIX = "keyPrefix";
    public static final String PURGE_COUNT = "count";
    public static final String PURGE_EXCEPTION_MESSGAE = "exceptionMessage";

    public static final String PURGE_RESULT_SUCCESS = "success";
    public static final String PURGE_RESULT_EXCEPTION = "exception";
    public static final String PURGE_RESULT_NOTFOUND = "notFound";

    void set(String type, String key, String value);

    void set(String type, String key, String value, long expire);

    String get(String type, String key);

    Map<String, Object> purge(String type, String key) throws CacheException;

    Map<String, Object> purgeStartsWith(String type, String keyPrefix) throws CacheException;

    Map<String, Object> purgeAll(String type) throws CacheException;

    void gc();

    void shutdown();
}
