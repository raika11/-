package jmnet.moka.web.dps.mvc.handler;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.dps.mvc.forward.Forward;
import jmnet.moka.core.dps.mvc.forward.ForwardHandler;
import jmnet.moka.core.dps.excepton.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.dps.api.ApiCacheHelper;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiResolver;
import jmnet.moka.core.dps.mvc.handler.DefaultApiRequestHandler;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.excepton.ParameterException;

public class MokaApiRequestHandler extends DefaultApiRequestHandler {

	public static final Logger logger = LoggerFactory.getLogger(MokaApiRequestHandler.class);

	@Autowired
	private CacheManager cacheManager;

	@Autowired
	private ActionLogger actionLogger;

	public MokaApiRequestHandler(ForwardHandler forwardHandler) {
		super(forwardHandler);
	}

	/**
	 * @see DefaultApiRequestHandler#apiRequest(java.lang.String, java.lang.String, java.util.Map)
	 */
    public ApiResult apiRequest(String apiPath, String apiId, Map<String, String> parameterMap) {
		try {
			ApiContext apiContext =  new ApiContext(this.apiRequestHelper, this.apiParameterChecker, 
                    new ApiResolver(apiPath, apiId), parameterMap);
			
            ApiResult apiResult = ApiCacheHelper.getCachedApiResult(apiContext, this.cacheManager);
            if (apiResult != null) {
                return apiResult;
			} else {
				apiResult = processApi(apiContext);
                ApiCacheHelper.setCache(apiContext, this.cacheManager, apiResult);
			}
			return apiResult;
		} catch (Exception e) {
			ApiResult errorResult = ApiResult.createApiErrorResult(e);
			return errorResult;
		} 
	}
	

	/**
	 * @see DefaultApiRequestHandler#apiRequest(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	public ResponseEntity<?> apiRequest(HttpServletRequest request, HttpServletResponse response)  {
		String remoteIp = HttpHelper.getRemoteAddr(request);
		long startTime = System.currentTimeMillis();
		try {

            ApiResolver apiResolver = new ApiResolver(request);
			Map<String, String> httpParamMap = HttpHelper.getParamMap(request);

            // Api가 존재하지 않을 경우
            if (this.apiRequestHelper.apiRequestExists(apiResolver) == false) {
				Forward forward = this.forwardHandler.getForward(request);
				if (forward != null) {
					apiResolver = new ApiResolver(forward.getApiPath(),forward.getApiId());
					forward.rebuildHttpParameter(request, httpParamMap);
				} else {
					actionLogger.fail(remoteIp, ActionType.API,
							System.currentTimeMillis() - startTime,
							String.format( "%s/%s : %s", apiResolver.getPath(),apiResolver.getId(),
							"Api Not Found"));
					return this.getApiNotFoundResponse(request, apiResolver);
				}
            }

            ApiContext apiContext = new ApiContext(this.apiRequestHelper, this.apiParameterChecker,
                    apiResolver, httpParamMap);

			// Method가 일치하는지 확인한다.
			if ( !apiContext.getApi().getMethod().matches(request.getMethod())) {
				actionLogger.fail(remoteIp, ActionType.API,
						System.currentTimeMillis() - startTime,
						String.format( "%s/%s : %s", apiResolver.getPath(),apiResolver.getId(),
								"Method Not Allowed"));
				return this.getMethodNotAllowedResponse(request, apiResolver);
			}

            // ACL, Cross Origin 적용
			String referer = request.getHeader("Referer");
			String accessControllAllowOrigin = null;
			if ( !isPermittedIp(request,apiContext) && referer == null) {
				ApiResult errorResult = ApiResult.createApiErrorResult(new ApiException("Access Denied",
						apiContext.getApiPath(), apiContext.getApiId()));
				actionLogger.fail(remoteIp, ActionType.API,
						System.currentTimeMillis() - startTime,
						String.format( "%s/%s : %s", apiResolver.getPath(),apiResolver.getId(),
								"Access Denied"));
				ResponseEntity<?> responseEntity = ResponseEntity.badRequest()
																 .header("Content-Type", MediaType.APPLICATION_JSON_UTF8.toString())
																 .body(errorResult);
				return responseEntity;
			} else {
				accessControllAllowOrigin =  getAccessControllAllowOrigin(referer,apiContext);
			}

            String cachedString = ApiCacheHelper.getCachedString(apiContext, this.cacheManager);
			ResponseEntity<?> responseEntity = null;
			HttpHeaders responseHeaders = new HttpHeaders();
			if (accessControllAllowOrigin != null ) {
				responseHeaders.set("Access-Control-Allow-Origin", accessControllAllowOrigin);
			}
			Api api = apiContext.getApi();
            if (cachedString != null) {
				//async가 있을 경우에 async만 수행한다.
				if ( api.hasAsyncRequest() ) {
					processApi(apiContext, true);
				}
			} else {
				ApiResult apiResult = processApi(apiContext);
				try {
					Object resultObject = null;
					if (api.isResultWrap()) {
						resultObject = apiResult;
					} else {
						resultObject = apiResult.unwrap(ApiResult.MAIN_DATA);
					}
					if ( apiContext.getApi().getContentType() != null) {
						responseHeaders.set("Content-Type",apiContext.getApi().getContentType());
						cachedString =
								ApiCacheHelper.setCache(apiContext, this.cacheManager, resultObject);
					} else {
						responseHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
						cachedString =
								ApiCacheHelper.setCache(apiContext, this.cacheManager, resultObject);
					}
				} catch (JsonProcessingException e) {
					actionLogger.error(remoteIp, ActionType.API,
							System.currentTimeMillis() - startTime,
							String.format( "%s/%s : %s", apiResolver.getPath(),apiResolver.getId(), e.toString()), e);
					logger.error("api Request:{} {} : {}", apiContext.getApiPath(), apiContext.getApiId(), e.toString(), e);

				}
			}
			responseEntity = ResponseEntity.ok().headers(responseHeaders).body(cachedString);
			actionLogger.success(remoteIp, ActionType.API,
					System.currentTimeMillis() - startTime,
					String.format("%s/%s", apiResolver.getPath(), apiResolver.getId()));
			return responseEntity;
		} catch (ParameterException|ClassNotFoundException e) {
			logger.error("api Request:{}",e.toString(), e);
			ApiResult errorResult = ApiResult.createApiErrorResult(e);
			ResponseEntity<?> responseEntity = ResponseEntity.badRequest()
					.header("Content-Type", MediaType.APPLICATION_JSON_UTF8.toString())
					.body(errorResult);
			actionLogger.error(remoteIp, ActionType.API,
					System.currentTimeMillis() - startTime,
					String.format( "%s : %s", request.getRequestURI(),
							e.toString()), e);
			return responseEntity;
		}
	}	
	
    public List<Map<String, Object>> purge(HttpServletRequest request,
            HttpServletResponse response) throws CacheException {
		try {
            Map<String, String> parameterMap = HttpHelper.getParamMap(request);
            String apiPath = parameterMap.get("apiPath");
            String apiId = parameterMap.get("apiId");
			if ( apiPath == null || apiId == null) {
				logger.warn("PURGE: apiPath or apiId is null: {} {}", apiPath, apiId);
                throw new CacheException("apiPath or apiId is null");
			}
			if ( parameterMap.size() == 2) {
                return this.cacheManager.purgeAll(ApiCacheHelper.makeCacheType(apiPath, apiId));
			} else {
				Api api = apiRequestHelper.getApi(apiPath, apiId);
                Map<String, Object> checkedParamMap =
                        apiParameterChecker.checkKeyParameter(api, parameterMap);
                String cacheKey = ApiCacheHelper.makeCacheKey(api, checkedParamMap);
                return this.cacheManager.purge(ApiCacheHelper.makeCacheType(apiPath, apiId),
                        cacheKey);
			}
		} catch (ParameterException e) {
			logger.error("api Request:{}",e.toString(), e);
            throw new CacheException("Parameter Error", e);
		}
	}
	
    public List<Map<String, Object>> purgeStartsWith(HttpServletRequest request,
            HttpServletResponse response) throws CacheException {
        Map<String, String> parameterMap = HttpHelper.getParamMap(request);
        String apiPath = parameterMap.get("apiPath");
        String apiId = parameterMap.get("apiId");
        String prefix = parameterMap.get("prefix");
        return this.cacheManager.purgeStartsWith(ApiCacheHelper.makeCacheType(apiPath, apiId),
                prefix);
    }

	@Override
    public void apiPeriodicRequest(String apiPath, String apiId) {
		try {
			ApiContext apiContext =  new ApiContext(this.apiRequestHelper, this.apiParameterChecker, 
                    new ApiResolver(apiPath, apiId), EMPTY_PARAM_MAP);
			ApiResult apiResult = processApi(apiContext);
            ApiCacheHelper.setCache(apiContext, this.cacheManager, apiResult);
		} catch (Exception e) {
			logger.error("apiPeriodicRequest exception : {}", e, e);
		}
	}

}
