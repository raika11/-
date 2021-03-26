package jmnet.moka.core.dps.api.handler;

import jmnet.moka.common.ApiResult;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.model.ApiCallRequest;
import jmnet.moka.core.dps.api.model.DbRequest;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.dps.api.handler
 * ClassName : ApiCallRequestHandler
 * Created : 2021-03-26 kspark
 * </pre>
 *
 * @author kspark
 * @since 2021-03-26 오전 10:58
 */
public class ApiCallRequestHandler implements RequestHandler {
    public final static Logger logger = LoggerFactory.getLogger(ApiCallRequestHandler.class);
    @Autowired
    private ApiRequestHandler apiRequestHandler;

    @Override
    public ApiResult processRequest(ApiContext apiContext) {
        ApiCallRequest apiCallRequest = (ApiCallRequest) apiContext.getCurrentRequest();
        String apiPath = McpString.isEmpty(apiCallRequest.getApiPath())? apiContext.getApiPath() : apiCallRequest.getApiPath();
        ApiResult result = apiRequestHandler.apiRequest(apiPath, apiCallRequest.getApiId(),apiContext.getParameterMap());
        return result;
    }

    @Override
    public void processAsyncRequest(AsyncRequestContext asyncRequestContext) {

    }

}
