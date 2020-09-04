package jmnet.moka.core.dps.api.handler.module;

import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;

public interface ModuleInterface {
    public Object invoke(ApiContext apiContext, ApiRequestHandler apiRequestHandler,
            ApiRequestHelper apiRequestHelper)
            throws Exception;
}
