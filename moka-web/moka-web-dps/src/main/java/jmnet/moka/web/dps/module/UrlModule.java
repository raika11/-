/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.dps.module;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import lombok.extern.slf4j.Slf4j;

/**
 * Description: url의 데이타를 로딩한다
 *
 * @author ssc
 * @since 2021-04-19
 */
@Slf4j
public class UrlModule implements ModuleInterface {
    private static final List<Object> EMPTY_LIST = new ArrayList<>();
    private ModuleRequestHandler moduleRequestHandler;

    public UrlModule(ModuleRequestHandler moduleRequestHandler) {
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {
        return null;
    }

    public Object getXmlLoad(ApiContext apiContext) {
        long startTime = System.currentTimeMillis();
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        ApiResult apiResult = ApiResult.createApiResult(startTime, System.currentTimeMillis(), EMPTY_LIST, true, null);

        try {
            String url = checkedParamMap
                    .get("url")
                    .toString();

            String resultString = moduleRequestHandler
                    .getHttpProxy()
                    .getString(url, false);

            // 결과를 이쁘게 변형할것

            return apiResult;

        } catch (Exception e) {
            log.error("module exception : {} {} {}", apiContext.getApiPath(), apiContext.getApiId(), e.getMessage(), e);
            checkedParamMap.put("_SUCCESS", false);
            checkedParamMap.put("_MESSAGE", e.getMessage());
            return apiResult;
        }
    }
}
