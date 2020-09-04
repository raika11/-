package jmnet.moka.core.dps.api.ext;

import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.model.Request;

public class AsyncRequestContext {
	private ApiContext apiContext;
	private Request request;
	
	public AsyncRequestContext(ApiContext apiContext) {
		this.apiContext = apiContext;
		this.request = apiContext.getCurrentRequest();
	}
	
	public Request getRequest() {
		return this.request;
	}
	
	public ApiContext getApiContext() {
		return this.apiContext;
	}
	
	public String toString() {
		return apiContext.toString()+" "+request.toString();
	}
}
