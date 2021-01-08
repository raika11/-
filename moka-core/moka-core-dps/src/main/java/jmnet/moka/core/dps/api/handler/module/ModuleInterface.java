package jmnet.moka.core.dps.api.handler.module;

import jmnet.moka.core.dps.api.ApiContext;

public interface ModuleInterface {
    Object invoke(ApiContext apiContext)
            throws Exception;
}
