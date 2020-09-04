package jmnet.moka.core.dps.api.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.ApiCacheHelper;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.model.PurgeRequest;

public class PurgeRequestHandler implements RequestHandler {
	public final transient Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private CacheManager cacheManager;

	@Override
	public ApiResult processRequest(ApiContext apiContext) {
		long startTime = System.currentTimeMillis();
        String purgeInfo = purge(apiContext);
		long endTime = System.currentTimeMillis();
        return ApiResult.createApiResult(startTime, endTime, "purged : " + purgeInfo, true, null);
	}

	@Override
	public void processAsyncRequest(AsyncRequestContext asyncRequestContext) {
        purge(asyncRequestContext.getApiContext());
    }

    private String purge(ApiContext apiContext) {
        if (this.cacheManager == null)
            return "Cache Manger Not Found";
        PurgeRequest purgeRequest = (PurgeRequest) apiContext.getCurrentRequest();
        String apiPath = McpString.isEmpty(purgeRequest.getApiPath()) ? apiContext.getApiPath()
                : purgeRequest.getApiPath();
        String apiId = purgeRequest.getApiId();
        String cacheType =
                ApiCacheHelper.makeCacheType(apiPath, apiId);
        String cacheKey = ApiCacheHelper.makeCacheKey(apiContext.getApi(),
                purgeRequest.getKeyList(), apiContext.getCheckedParamMap());
        try {
            this.cacheManager.purge(cacheType, cacheKey);
        } catch (CacheException e) {
            return String.join(" ", cacheType, cacheKey, "fail");
        }
        return String.join(" ", cacheType, cacheKey);
	}

}
