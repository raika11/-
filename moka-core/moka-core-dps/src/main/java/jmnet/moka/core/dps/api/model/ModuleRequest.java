package jmnet.moka.core.dps.api.model;

import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;

public class ModuleRequest extends AbstractRequest {

    private String className;
    private String methodName;

    public ModuleRequest(String type, String className, String methodName, boolean async, String resultName) {
    	super(type, async, resultName);
        this.className = className;
        this.methodName = methodName;
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
