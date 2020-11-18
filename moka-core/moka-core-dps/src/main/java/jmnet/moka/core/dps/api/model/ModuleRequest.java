package jmnet.moka.core.dps.api.model;

import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;

public class ModuleRequest implements Request {

	private String type;
	private boolean async;
	private String resultName;
    private String className;
    private String methodName;

	
    public ModuleRequest(String type, String className, String methodName, boolean async, String resultName) {
		this.type = type;
		this.async = async;
		this.resultName = resultName;
        this.className = className;
        this.methodName = methodName;
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

	public String getMethodName() { return this.methodName; }
	
	@Override
	public Class<?> getHandlerClass() {
        return ModuleRequestHandler.class;
	}
	
	public String toString() {
		return String.join("/", this.type);
	}
}
