package jmnet.moka.core.dps.api.model;

import jmnet.moka.core.dps.api.handler.SampleRequestHandler;

public class SampleRequest implements Request {

	private String type;
	private boolean async;
	private String resultName;
	private String jsonFileName;
	
	
	public SampleRequest(String type, boolean async, String resultName, String jsonFileName) {
		this.type = type;
		this.async = async;
		this.resultName = resultName;
		this.jsonFileName = jsonFileName;
	}

	public String getType() {
		return this.type;
	}

	public boolean getAsync() {
		return this.async;
	}
	
	public String getJsonFileName() {
		return this.jsonFileName;
	}
	
	@Override
	public Class<?> getHandlerClass() {
		return SampleRequestHandler.class;
	}

	@Override
	public String getResultName() {
		return this.resultName;
	}
	
	public String toString() {
		return String.join("/", this.type,this.jsonFileName);
	}
}
