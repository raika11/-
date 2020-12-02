package jmnet.moka.core.dps.api.handler;

import java.util.HashMap;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.model.ScriptRequest;
import org.apache.commons.jexl3.JexlScript;
import org.apache.commons.jexl3.MapContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class ScriptRequestHandler implements RequestHandler {
    public final transient Logger logger = LoggerFactory.getLogger(getClass());
    private HashMap<String, JexlScript> scriptMap = new HashMap<String, JexlScript>(256);
    //    private SimpleTemplateMerger simpleTemplateMerger = new SimpleTemplateMerger();
    @Autowired
    private ApiRequestHandler apiRequestHandler;

    @Override
    public ApiResult processRequest(ApiContext apiContext) {
        long startTime = System.currentTimeMillis();
        ScriptRequest scriptRequest = (ScriptRequest) apiContext.getCurrentRequest();

        MapContext context = new MapContext();
        context.set(CONTEXT_ARH, apiRequestHandler);
        context.set(CONTEXT_API_CONTEXT, apiContext);
        context.set(CONTEXT_PARAM, apiContext.getCheckedParamMap());
        context.set("$mapper", ResourceMapper.getDefaultObjectMapper());
        //        context.set(CONTEXT_MERGER, simpleTemplateMerger);
        String jsKey = makeRequestKey(apiContext);
        JexlScript js = this.scriptMap.get(jsKey);
        if (js == null) {
            js = jexl.createScript(scriptRequest.getScriptContent());
            this.scriptMap.put(jsKey, js);
        }
        Object result = js.execute(context);
        long endTime = System.currentTimeMillis();
        return ApiResult.createApiResult(startTime, endTime, result, true, null);
    }

    @Override
    public void processAsyncRequest(AsyncRequestContext asyncRequestContext) {
        // eval에 대한 async는 사용하지 않음
    }

}
