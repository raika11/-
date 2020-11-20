package jmnet.moka.core.dps.api.handler.module;

import java.util.HashMap;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;

public class ExampleModule implements ModuleInterface {

    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;
    public ExampleModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("message", String.format("%s %s api has called %s", apiContext.getApiPath(),
                apiContext.getApiId(), this.getClass().getName()));
        result.putAll(apiContext.getCheckedParamMap());
        return result;
    }

}
