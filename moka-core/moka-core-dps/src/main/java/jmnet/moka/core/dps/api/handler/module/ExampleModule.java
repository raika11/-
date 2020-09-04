package jmnet.moka.core.dps.api.handler.module;

import java.util.HashMap;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;

public class ExampleModule implements ModuleInterface {

    @Override
    public Object invoke(ApiContext apiContext, ApiRequestHandler apiRequestHandler,
            ApiRequestHelper apiRequestHelper)
            throws Exception {
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("message", String.format("%s %s api has called %s", apiContext.getApiPath(),
                apiContext.getApiId(), this.getClass().getName()));
        result.putAll(apiContext.getCheckedParamMap());
        return result;
    }

}
