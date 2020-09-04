package jmnet.moka.core.dps.api.handler;

import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlEngine;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.model.Api;

public interface RequestHandler{
    public final static JexlBuilder jexlb = new JexlBuilder();
    public final static JexlEngine jexl = jexlb.create();

    public static final String CONTEXT_ARH = "$arh";
    public static final String CONTEXT_PARAM = "$param";

	public ApiResult processRequest(ApiContext apiContext);
	public void processAsyncRequest(AsyncRequestContext asyncRequestContext);
	
    public default String makeRequestKey(ApiContext apiContext) {
        Api api = apiContext.getApi();
        return String.format("%s_%s_%d", api.getApiConfig().getPath(), api.getId(),
                apiContext.getCurrentRequestIndex());
    }
}
