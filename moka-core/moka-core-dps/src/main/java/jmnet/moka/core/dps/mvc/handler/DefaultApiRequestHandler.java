package jmnet.moka.core.dps.mvc.handler;


import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.common.proxy.autoConfig.HttpProxyConfiguration;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiParameterChecker;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.ApiResolver;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.ext.AsyncRequestTask;
import jmnet.moka.core.dps.api.ext.AsyncRequestTaskManager;
import jmnet.moka.core.dps.mvc.forward.Forward;
import jmnet.moka.core.dps.mvc.forward.ForwardHandler;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.RequestHandler;
import jmnet.moka.core.dps.api.handler.SampleRequestHandler;
import jmnet.moka.core.dps.api.handler.UrlRequestHandler;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.api.model.DefaultApiConfig;
import jmnet.moka.core.dps.api.model.Request;
import jmnet.moka.core.dps.db.session.DpsSqlSessionFactory;
import jmnet.moka.core.dps.excepton.ApiException;
import jmnet.moka.core.dps.excepton.ParameterException;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.support.GenericBeanDefinition;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

public class DefaultApiRequestHandler implements ApiRequestHandler {

    public static final Logger logger = LoggerFactory.getLogger(DefaultApiRequestHandler.class);
    protected ForwardHandler forwardHandler;
    protected HashMap<Class<?>, RequestHandler> requestHandlerMap;

    @Autowired
    private GenericApplicationContext appContext;

    @Autowired
    protected ApiRequestHelper apiRequestHelper;

    @Autowired
    private DpsSqlSessionFactory sessionFactory;

    @Autowired
    @Qualifier("apiParameterChecker")
    protected ApiParameterChecker apiParameterChecker;

    @Autowired
    protected AsyncRequestTaskManager asyncRequestTaskManager;

    @Value("${dps.config.base}")
    private String configBasePath;

    @Value("${dps.config.sample.json.path}")
    private String sampleJsonPath;

    protected static Map<String, String> EMPTY_PARAM_MAP = new HashMap<String, String>(0);

    public DefaultApiRequestHandler(ForwardHandler forwardHandler) {
        this.forwardHandler = forwardHandler;
        this.requestHandlerMap = new HashMap<Class<?>, RequestHandler>(8);
    }

    public RequestHandler getRequestHandler(Class<?> requestHandlerBeanType)
            throws ClassNotFoundException {
        RequestHandler requestHandler = this.requestHandlerMap.get(requestHandlerBeanType);
        if (requestHandler == null) {
            synchronized (this) {
                // 중복 등록일 경우 오류가 발생하므로 다시 체크한다.
                requestHandler = this.requestHandlerMap.get(requestHandlerBeanType);
                if (requestHandler == null) {
                    // 빈등록방법1: RequestHandler registerBeanDefinition
                    GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
                    beanDefinition.setBeanClass(requestHandlerBeanType);
                    appContext.registerBeanDefinition(requestHandlerBeanType.getName(),
                            beanDefinition);

                    // 빈등록방법2: RequestHandler registerBean
                    //            appContext.registerBean(requestHandlerBeanType.getSimpleName(), requestHandlerBeanType,
                    //                    (beanDefinition) -> {
                    //                        beanDefinition.setScope(ConfigurableBeanFactory.SCOPE_SINGLETON);
                    //                    });

                    if (requestHandlerBeanType.equals(UrlRequestHandler.class)) {
                        HttpProxy httpProxy =
                                (HttpProxy) appContext.getBean(HttpProxyConfiguration.HTTP_PROXY);
                        requestHandler = appContext.getBean(UrlRequestHandler.class, httpProxy);
                    } else if (requestHandlerBeanType.equals(ModuleRequestHandler.class)) {
                        requestHandler = (RequestHandler) appContext
                                .getBean(ModuleRequestHandler.class, this.appContext);
                    } else if (requestHandlerBeanType.equals(SampleRequestHandler.class)) {
                        requestHandler = (RequestHandler) appContext.getBean(requestHandlerBeanType,
                                configBasePath, sampleJsonPath);
                    } else {
                        requestHandler =
                                (RequestHandler) appContext.getBean(requestHandlerBeanType);
                    }
                    this.requestHandlerMap.put(requestHandlerBeanType, requestHandler);
                }
            }
        }
        return requestHandler;
    }

    /**
     * @see ApiRequestHandler#processApi(jmnet.moka.core.dps.api.ApiContext)
     */
    public ApiResult processApi(ApiContext apiContext)
            throws ParameterException, ClassNotFoundException {
        return processApi(apiContext, false);
    }


    /**
     * @see ApiRequestHandler#processApi(jmnet.moka.core.dps.api.ApiContext,
     *      boolean)
     */
    public ApiResult processApi(ApiContext apiContext, boolean asyncOnly)
            throws ParameterException, ClassNotFoundException {
        Api api = apiContext.getApi();
        ApiResult allResult = null;

        SqlSession sqlSession = null;
        if (api.hasDbRequest()) {
            sqlSession = this.sessionFactory.getSqlSession(apiContext.getApiPath());
            apiContext.setSqlSession(sqlSession);
        }
        try {
            allResult = processRequests(apiContext, asyncOnly);
            if (api.hasDbRequest()) {
                sqlSession.commit();
            }
        } catch (Exception e) {
            if (api.hasDbRequest()) {
                sqlSession.rollback();
            }
            logger.error("request exception : {}", e.getMessage(), e);
            return ApiResult.createApiErrorResult(String.format("%s %s %d", apiContext.getApiPath(),
                    apiContext.getApiId(), apiContext.getCurrentRequestIndex()), e);
        } finally {
            if (api.hasDbRequest()) {
                sqlSession.close();
            }
        }
        return allResult;
    }

    private ApiResult processRequests(ApiContext apiContext, boolean asyncOnly)
            throws ClassNotFoundException, ParameterException {
        ApiResult allResult = null;
        while (apiContext.hasNextRequest()) {
            Request request = apiContext.nextRequest();
            Class<?> handlerClass = request.getHandlerClass();
            RequestHandler requestHandler = this.getRequestHandler(handlerClass);
            if (asyncOnly == false && request.getAsync() == false) {
                ApiResult result = requestHandler.processRequest(apiContext);
                if (request.getResultName().equals(ApiResult.MAIN_DATA)) {
                    if (allResult == null) {
                        allResult = result;
                    } else {
                        // TODO : ApiResult.MAIN_DATA 여러개일때 처리 필요
                        // 현재 overwrite 시킴
                        //                          for ( @SuppressWarnings("rawtypes") Entry entry : allResult.entrySet()) {
                        //                              result.addApiResult((String)entry.getKey(), (ApiResult)entry.getValue());
                        //                          }
                        allResult = result;
                    }
                } else {
                    if (allResult == null) {
                        allResult = new ApiResult();
                    }
                    allResult.addApiResult(request.getResultName(), result);
                }
            } else if (request.getAsync()) {
                AsyncRequestContext asyncRequestContext = new AsyncRequestContext(apiContext);
                AsyncRequestTask task = new AsyncRequestTask(
                        getRequestHandler(request.getHandlerClass()), asyncRequestContext);
                this.asyncRequestTaskManager.processAsyncRequest(task);
            } else {
                // onlyAsync == true && request.getAsync() == true 인 경우
            }
            apiContext.setAllResult(allResult);
        }
        return allResult;
    }

    /**
     * @see ApiRequestHandler#apiRequest(java.lang.String,
     *      java.lang.String, java.util.Map)
     */
    public ApiResult apiRequest(String apiPath, String apiId, Map<String, String> parameterMap) {
        try {
            ApiResolver apiResolver = new ApiResolver(apiPath, apiId);
            ApiContext apiContext = new ApiContext(this.apiRequestHelper, this.apiParameterChecker,
                    apiResolver, parameterMap);
            ApiResult apiResult = processApi(apiContext);
            return apiResult;
        } catch (ClassNotFoundException | ParameterException e) {
            ApiResult errorResult = ApiResult.createApiErrorResult(e);
            return errorResult;
        }
    }

    /**
     * @see ApiRequestHandler#apiRequest(javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse)
     */
    public ResponseEntity<?> apiRequest(HttpServletRequest request, HttpServletResponse response) {
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
                    return this.getApiNotFoundResponse(request, apiResolver);
                }
            }

            ApiContext apiContext = new ApiContext(this.apiRequestHelper, this.apiParameterChecker,
                    apiResolver, HttpHelper.getParamMap(request));

            // ACL, Cross Origin 적용
            String referer = request.getHeader("Referer");
            String accessControllAllowOrigin =  null;
            if ( !isPermittedIp(request,apiContext) && referer == null) {
                ApiResult errorResult = ApiResult.createApiErrorResult(new ApiException("Access Denied",
                        apiContext.getApiPath(), apiContext.getApiId()));
                ResponseEntity<?> responseEntity = ResponseEntity.badRequest()
                                                                 .header("Content-Type", MediaType.APPLICATION_JSON_UTF8.toString())
                                                                 .body(errorResult);
            } else {
                accessControllAllowOrigin =  getAccessControllAllowOrigin(referer,apiContext);
            }

            HttpHeaders responseHeaders = new HttpHeaders();
            if (accessControllAllowOrigin != null ) {
                responseHeaders.set("Access-Control-Allow-Origin", accessControllAllowOrigin);
            }

            ApiResult apiResult = processApi(apiContext);
            ResponseEntity<?> responseEntity = null;
            if ( apiContext.getApi().getContentType() != null) {
                responseHeaders.set("Content-Type",apiContext.getApi().getContentType());
                responseEntity = ResponseEntity.ok().headers(responseHeaders).body(apiResult.get(ApiResult.MAIN_DATA));
            } else {
                responseEntity = ResponseEntity.ok().headers(responseHeaders).body(apiResult);
            }
            return responseEntity;
        } catch (ParameterException | ClassNotFoundException e) {
            logger.error("api Request:{}", e.toString(), e);
            ApiResult errorResult = ApiResult.createApiErrorResult(e);
            ResponseEntity<?> responseEntity = ResponseEntity.badRequest()
                    .header("Content-Type", MediaType.APPLICATION_JSON_UTF8.toString())
                    .body(errorResult);
            return responseEntity;
        }
    }

    protected boolean isPermittedIp(HttpServletRequest request, ApiContext apiContext) {
        // ACL 적용
        String ip = HttpHelper.getRemoteAddr(request);
        String apiId = apiContext.getApiId();
        String apiPath = apiContext.getApiPath();
        DefaultApiConfig defaultApiConfig = this.apiRequestHelper.getDefaultApiConfig(apiPath);
        if (defaultApiConfig != null && defaultApiConfig.isAllow(apiId, ip) == false) {
           return false;
        }
        return true;
    }

    protected String getAccessControllAllowOrigin(String referer, ApiContext apiContext) {
        if ( referer != null) {
            try {
                URL refererUrl = new URL(referer);
                String host = refererUrl.getHost() + (refererUrl.getPort() == 80 ? "" : ":"+refererUrl.getPort());
                String apiPath = apiContext.getApiPath();
                DefaultApiConfig defaultApiConfig = this.apiRequestHelper.getDefaultApiConfig(apiPath);
                if (defaultApiConfig != null && defaultApiConfig.getRefererSet() !=  null) {
                    Set<String> refererSet = defaultApiConfig.getRefererSet();
                    if (refererSet.contains(host)) {
                        return refererUrl.getProtocol() + "://" + host;
                    } else {
                        return apiContext.getApi().getCors();
                    }
                }
            } catch (MalformedURLException e) {
                // referer 오류
                logger.warn("Referer is malformed URL : {} ",referer);
            }
        }
        return null;
    }

    protected ResponseEntity<?> getApiNotFoundResponse(HttpServletRequest request,
            ApiResolver apiResolver) {
        // apiPath는 존재하지만 apiId를 찾을 수 없는 경우
        ApiResult errorResult = ApiResult.createApiErrorResult(
                new ApiException("Api Not Found", apiResolver.getPath(), apiResolver.getId()));
        ResponseEntity<?> responseEntity = ResponseEntity.badRequest()
                .header("Content-Type", MediaType.APPLICATION_JSON_UTF8.toString())
                .body(errorResult);
        return responseEntity;
    }

    protected ResponseEntity<?> getMethodNotAllowedResponse(HttpServletRequest request,
            ApiResolver apiResolver) {
        // api는 존재하지만 method가 일치하지 않을 경우
        ApiResult errorResult = ApiResult.createApiErrorResult(
                new ApiException("Method Not Allowed", apiResolver.getPath(), apiResolver.getId()));
        ResponseEntity<?> responseEntity = ResponseEntity.badRequest()
                                                         .header("Content-Type", MediaType.APPLICATION_JSON_UTF8.toString())
                                                         .body(errorResult);
        return responseEntity;
    }

    @Override
    public List<Map<String, Object>> purge(HttpServletRequest request,
            HttpServletResponse response) throws CacheException {
        // api 결과를 캐시하지 않아 처리할 것이 없음
        return null;
    }

    @Override
    public List<Map<String, Object>> purgeStartsWith(HttpServletRequest request,
            HttpServletResponse response) throws CacheException {
        // api 결과를 캐시하지 않아 처리할 것이 없음
        return null;
    }

    @Override
    public void apiPeriodicRequest(String path, String id) {
        try {
            ApiContext apiContext = new ApiContext(this.apiRequestHelper, this.apiParameterChecker,
                    new ApiResolver(path, id), EMPTY_PARAM_MAP);
            processApi(apiContext);
        } catch (ClassNotFoundException | ParameterException e) {
            logger.error("apiPeriodicRequest exception : {}", e, e);
        }
    }


}
