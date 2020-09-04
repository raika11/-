package jmnet.moka.core.dps.api.model;

import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;

public class ModuleRequest implements Request {

	private String type;
	private boolean async;
	private String resultName;
    private String className;
	
	
    public ModuleRequest(String type, String className, boolean async, String resultName) {
		this.type = type;
		this.async = async;
		this.resultName = resultName;
        this.className = className;
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
	
    public String getClassName() {
        return this.className;
	}
	
	@Override
	public Class<?> getHandlerClass() {
        return ModuleRequestHandler.class;
	}
	
	public String toString() {
		return String.join("/", this.type);
	}
}
