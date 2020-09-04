package jmnet.moka.core.dps.excepton;

import jmnet.moka.core.dps.api.model.Api;

public class ParameterException extends Exception {

	private Api api;
	
	private static final long serialVersionUID = -7284442998682648063L;

	public ParameterException(String message, Exception cause) {
		super(message, cause);
	}

	public ParameterException(String message, Api api, Exception cause) {
		super(message, cause);
		this.api = api;
	}

	public ParameterException(String message, Api api) {
		super(message);
		this.api = api;
	}
				
	public Api getRequestConfig() {
		return this.api;
	}
}
