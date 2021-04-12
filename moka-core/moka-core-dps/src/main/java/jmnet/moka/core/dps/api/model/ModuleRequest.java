package jmnet.moka.core.dps.api.model;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;

public class ModuleRequest extends AbstractRequest {

    private String className;
    private String methodName;
    private List<String> outParamList;

    public ModuleRequest(String type, String className, String methodName, boolean async, String resultName, String outParam) {
        super(type, async, resultName);
        this.className = className;
        this.methodName = methodName;
        if (McpString.isNotEmpty(outParam)) {
            this.outParamList = Arrays
                    .stream(outParam.split(","))
                    .map(param -> param.trim())
                    .collect(Collectors.toList());
        }
    }

    public String getClassName() {
        return this.className;
    }

    public String getMethodName() {
        return this.methodName;
    }

    @Override
    public Class<?> getHandlerClass() {
        return ModuleRequestHandler.class;
    }

    @Override
    public List<String> getOutParamList() {
        return this.outParamList;
    }

    public String toString() {
        return String.join("/", this.type);
    }
}
