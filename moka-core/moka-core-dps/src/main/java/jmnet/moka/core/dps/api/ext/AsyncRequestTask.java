package jmnet.moka.core.dps.api.ext;

import jmnet.moka.core.dps.api.handler.RequestHandler;
import jmnet.moka.core.dps.excepton.ParameterException;

public class AsyncRequestTask implements Runnable {
	
	private RequestHandler requestHandler;
	private AsyncRequestContext asyncRequestContext;
	
	public AsyncRequestTask(RequestHandler requestHandler,
			AsyncRequestContext asyncRequestContext) throws ParameterException, ClassNotFoundException {
		this.asyncRequestContext = asyncRequestContext;
		this.requestHandler = requestHandler;
	}

	@Override
	public void run() {
		this.requestHandler.processAsyncRequest(asyncRequestContext);
	}

	public AsyncRequestContext getAsyncRequestContext( ) {
		return this.asyncRequestContext;
	}
	
	public String toString() {
		return this.asyncRequestContext.toString();
	}
}
