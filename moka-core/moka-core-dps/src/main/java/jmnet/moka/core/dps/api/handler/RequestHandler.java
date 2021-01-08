package jmnet.moka.core.dps.api.handler;

import jmnet.moka.common.ApiResult;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.model.Api;
import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlEngine;

public interface RequestHandler {
    JexlBuilder jexlb = new JexlBuilder();
    JexlEngine jexl = jexlb.create();

    String CONTEXT_ARH = "$arh";
    String CONTEXT_API_CONTEXT = "$ac";
    String CONTEXT_PARAM = "$param";
    String CONTEXT_MERGER = "$merger";

    ApiResult processRequest(ApiContext apiContext);

    void processAsyncRequest(AsyncRequestContext asyncRequestContext);

    default String makeRequestKey(ApiContext apiContext) {
        Api api = apiContext.getApi();
        return String.format("%s_%s_%d", api
                .getApiConfig()
                .getPath(), api.getId(), apiContext.getCurrentRequestIndex());
    }
}
