package jmnet.moka.core.dps.api.model;

import jmnet.moka.core.dps.api.handler.EvalRequestHandler;

public class EvalRequest implements Request {

	private String type;
	private boolean async;
	private String resultName;
	private String scriptContent;
	
	
	public EvalRequest(String type, boolean async, String resultName, String scriptContent) {
		this.type = type;
		this.async = async;
		this.resultName = resultName;
		this.scriptContent = scriptContent;
	}

	public String getType() {
		return this.type;
	}
	
	public boolean getAsync() {
		return this.async;
	}

	public String getResultName() {
		return this.resultName;
	}
	
	public String getScriptContent( ) {
		return this.scriptContent;
	}
	
	@Override
	public Class<?> getHandlerClass() {
		return EvalRequestHandler.class;
	}
	
	public String toString() {
		return String.join("/", this.type);
	}
}
