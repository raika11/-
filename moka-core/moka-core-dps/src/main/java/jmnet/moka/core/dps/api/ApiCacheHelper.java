package jmnet.moka.core.dps.api;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.dps.api.model.Api;

public class ApiCacheHelper {

    public static final long EXPIRE_UNDEFINED = Long.MIN_VALUE;

    private static ObjectMapper MAPPER = new ObjectMapper();
    static {
        MAPPER.setDateFormat(MspConstants.jsonDateFormat());
        MAPPER.setTimeZone(TimeZone.getTimeZone(MspConstants.JSON_DATE_TIME_ZONE));
    }

    public static String makeCacheType(ApiContext apiContext) {
        return makeCacheType(apiContext.getApiPath(), apiContext.getApiId());
    }

    public static String makeCacheType(String apiPath, String apiId) {
        return apiPath + "_" + apiId;
    }

    public static String makeCacheKey(ApiContext apiContext) {
        return makeCacheKey(apiContext.getApi(), apiContext.getCheckedParamMap());
    }

    public static String makeCacheKey(Api api, Map<String, Object> checkedParam) {
        return makeCacheKey(api, api.getKeyList(), checkedParam);
    }

    public static String makeCacheKey(Api api, List<String> keyList,
            Map<String, Object> checkedParam) {
        String cacheKey = "*";
        if (keyList.size() > 0) {
            List<String> paramValueList = new ArrayList<String>(keyList.size());
            for (String key : keyList) {
                Object paramValue = checkedParam.get(key);
                if (paramValue != null) {
                    paramValueList.add(paramValue.toString());
                } else {
                    paramValueList.add("*");
                }
            }
            cacheKey = String.join("_", paramValueList);
        }
        return cacheKey;
    }

    public static String getCachedString(ApiContext apiContext, CacheManager cacheManager) {
        String cacheType = makeCacheType(apiContext);
        String cacheKey = makeCacheKey(apiContext);
        String cachedValue = cacheManager.get(cacheType, cacheKey);
        if (cachedValue != null) {
            return cachedValue;
        } else {
            return null;
        }
    }

    public static ApiResult getCachedApiResult(ApiContext apiContext, CacheManager cacheManager)
            throws JsonParseException, JsonMappingException, IOException {
        Api api = apiContext.getApi();
        if (api.getExpire() > 0) {
            String cachedString = getCachedString(apiContext, cacheManager);
            if (cachedString != null) {
                return MAPPER.readValue(cachedString, ApiResult.class);
            }
        }
        return null;
    }

    public static String setCache(ApiContext apiContext, CacheManager cacheManager,
            ApiResult result) throws JsonProcessingException {
        String cacheType = makeCacheType(apiContext);
        String cacheKey = makeCacheKey(apiContext);
        String cachedString = MAPPER.writeValueAsString(result);
        Api api = apiContext.getApi();
        if (api.isExpireUndefined()) {
            cacheManager.set(cacheType, cacheKey, MAPPER.writeValueAsString(result));
        } else if (api.getExpire() > 0) { // expire가 0일 경우 캐시하지 않는다.
            cacheManager.set(cacheType, cacheKey, MAPPER.writeValueAsString(result),
                    api.getExpire());
        }
        return cachedString;
    }

}
