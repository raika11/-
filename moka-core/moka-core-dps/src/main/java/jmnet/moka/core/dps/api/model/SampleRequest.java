package jmnet.moka.core.dps.api.model;

import jmnet.moka.core.dps.api.handler.SampleRequestHandler;

public class SampleRequest extends AbstractRequest {
	private String jsonFileName;

	public SampleRequest(String type, boolean async, String resultName, String jsonFileName) {
		super(type, async, resultName);
		this.jsonFileName = jsonFileName;
	}
	public String getJsonFileName() {
		return this.jsonFileName;
	}
	
	@Override
	public Class<?> getHandlerClass() {
		return SampleRequestHandler.class;
	}

	public String toString() {
		return String.join("/", this.type,this.jsonFileName);
	}
}
