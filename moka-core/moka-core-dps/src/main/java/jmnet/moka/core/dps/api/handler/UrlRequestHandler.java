package jmnet.moka.core.dps.api.handler;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.List;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.model.UrlRequest;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class UrlRequestHandler implements RequestHandler {
	public final transient Logger logger = LoggerFactory.getLogger(getClass());
	
	private HttpProxy httpProxy ;
	
	@Autowired
	public UrlRequestHandler(HttpProxy httpProxy) {
		this.httpProxy = httpProxy;
	}
	
	
	@Override
	public ApiResult processRequest(ApiContext apiContext) {
		long startTime = System.currentTimeMillis();
		UrlRequest urlRequest = (UrlRequest)apiContext.getCurrentRequest();
		try {
			JSONResult jsonResult = httpProxy.getApiResult(urlRequest.getUrl(), apiContext.getCheckedParamMap(), false);			
			return getResult(startTime, jsonResult, urlRequest);
		} catch (IOException | ParseException | URISyntaxException e) {
			logger.error("Url Request Fail: {}",urlRequest.getUrl(), e.toString(), e);
			return ApiResult.createApiResult(startTime, System.currentTimeMillis(), "Request Failed:"+e.getLocalizedMessage(), true, null);
		}
	}
	
	@Override
	public void processAsyncRequest(AsyncRequestContext asyncRequestContext) {
		ApiContext apiContext =  asyncRequestContext.getApiContext();
		UrlRequest urlRequest = (UrlRequest)apiContext.getCurrentRequest();
		try {
			httpProxy.getApiResult(urlRequest.getUrl(), apiContext.getCheckedParamMap(), false);			
		} catch (IOException | ParseException | URISyntaxException e) {
			logger.error("Url Request Fail: {}",urlRequest.getUrl(), e.toString(), e);
		}
	}
	
	public ApiResult getResult(long startTime, JSONResult jsonResult, UrlRequest urlRequest) {
		ApiResult apiResult = new ApiResult();
		List<String> include = urlRequest.getIncude();
		List<String> exclude = urlRequest.getExclude();
		for ( String key : jsonResult.keySet() ) {
			if ( urlRequest.getSelector() != null && key.equals(urlRequest.getSelector())) {
				apiResult.put(ApiResult.MAIN_DATA, jsonResult.get(key));
			} else if ( include.contains(key)) {
				apiResult.put(key, jsonResult.get(key));
			} else if ( exclude.contains(key)) {
				jsonResult.remove(key);
			} else {
				apiResult.put(key, jsonResult.get(key));
			}
		}
        apiResult.put("_CREATE_TIME", ApiResult.df.format(LocalDateTime.now()));
		long endTime = System.currentTimeMillis();
		apiResult.put("_WORK_TIME", endTime - startTime);
		return apiResult;
	}

}
