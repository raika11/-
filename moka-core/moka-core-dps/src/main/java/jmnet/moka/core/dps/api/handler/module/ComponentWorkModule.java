package jmnet.moka.core.dps.api.handler.module;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;

public class ComponentWorkModule implements ModuleInterface {

    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;
    public ComponentWorkModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {
        String apiPath = apiContext.getApiPath();
        ApiResult componentResult =
                apiRequestHandler.apiRequest(apiPath, "component", apiContext.getParameterMap());
        ApiResult componentWorkResult =
                apiRequestHandler.apiRequest(apiPath, "component.work",
                        apiContext.getParameterMap());
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> componentWorkList =
                (List<Map<String, Object>>) componentWorkResult.get(ApiResult.MAIN_DATA);
        if (componentWorkList.size() == 0)
            return componentResult;
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> componentList =
                (List<Map<String, Object>>) componentResult.get(ApiResult.MAIN_DATA);
        Map<String, Object> componentMap = componentList.get(0);
        Map<String, Object> componentWorkMap = componentWorkList.get(0);
        componentMap.put("TEMPLATE_SEQ", componentWorkMap.get("TEMPLATE_SEQ"));
        componentMap.put("DATASET_SEQ", componentWorkMap.get("DATASET_SEQ"));
        componentMap.put("SNAPSHOT_YN", componentWorkMap.get("SNAPSHOT_YN"));
        componentMap.put("SNAPSHOT_BODY", componentWorkMap.get("SNAPSHOT_BODY"));
        componentMap.put("MODIFIED_YMDT", MokaConstants.now());
        return componentList;
    }

}
