package jmnet.moka.web.dps.module;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.web.dps.module.MenuModule;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.web.dps.module.searchEngine.Collection;
import jmnet.moka.web.dps.module.searchEngine.SearchQueryResult;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;

public class SearchEngineModule implements ModuleInterface {
    private static final String PARAM_KEY = "Key";
    private static final String PARAM_KEYWORD = "Keyword";
    private static final String PARAM_SOURCE_CODE = "SourceCode";
    private static final String PARAM_LIST_TYPE = "ListType";
    private static final String PARAM_SCOPE_TYPE = "ScopeType";
    private static final String PARAM_START_SEARCH_DATE = "StartSearchDate";
    private static final String VALUE_KEYWORD = "Keyword";

    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;
    private static final String SEARCH_URI = "http://searchapi.joins.com/search_jsonp.jsp";

    public SearchEngineModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {
        return null;
    }

    public Object getLatestArticle(ApiContext apiContext)
            throws Exception {
        long startTime = System.currentTimeMillis();
        String categoryKey = (String) apiContext
                .getCheckedParamMap()
                .get("category");
        Integer startCount = (Integer) apiContext
                .getCheckedParamMap()
                .get("start");
        Integer listCount = (Integer) apiContext
                .getCheckedParamMap()
                .get("count");

        Map<String, Object> searchParamMap = (Map<String, Object>) getParameterByCategory(categoryKey);
        searchParamMap.put("collection", "news");
        searchParamMap.put("sort", "DATE/DESC,RANK/DESC");
        searchParamMap.put("srcGrpCode", "1");
        searchParamMap.put("listCount", listCount);
        searchParamMap.put("startCount", startCount);

        String resultString = moduleRequestHandler
                .getHttpProxy()
                .getString(SEARCH_URI, searchParamMap, false);
        SearchQueryResult sqr = new SearchQueryResult(resultString);
        List<Collection> collectionList = sqr.getCollectionList();
        if (collectionList != null && collectionList.size() > 0) {
            Collection collection = collectionList.get(0);
            ApiResult apiResult =
                    ApiResult.createApiResult(startTime, System.currentTimeMillis(), collection.getDocumentList(), true, ApiResult.MAIN_DATA);
            apiResult.addApiResult(ApiResult.MAIN_TOTAL, ApiResult.createApiResult(collection.getTotalCount()));
            return apiResult;
        }
        return null;
    }

    public Map<String, Object> getParameterByCategory(String categoryKey)
            throws Exception {
        jmnet.moka.web.dps.module.MenuModule
                menuModule = (jmnet.moka.web.dps.module.MenuModule) moduleRequestHandler.getModule(MenuModule.class.getName());
        Map<String, Object> paramMapFromMenu = menuModule.getSearchParmeterByCategory(categoryKey);
        Map<String, Object> resultMap = new HashMap<>();
        if (paramMapFromMenu != null) {
            for (Entry<String, Object> entry : paramMapFromMenu.entrySet()) {
                if (entry
                        .getKey()
                        .equals(PARAM_SCOPE_TYPE)) {
                    if (entry
                            .getValue()
                            .toString()
                            .equalsIgnoreCase(VALUE_KEYWORD)) {
                        resultMap.put("sfield", "ART_KWD");
                        //                        resultMap.put("sfield","ART_TITLE");
                    }
                } else if (entry
                        .getKey()
                        .equalsIgnoreCase(PARAM_KEYWORD)) {
                    resultMap.put("query", entry.getValue());
                } else if (entry
                        .getKey()
                        .equalsIgnoreCase(PARAM_SOURCE_CODE)) {
                    resultMap.put("SourceCode", entry.getValue());
                } else if (entry
                        .getKey()
                        .equalsIgnoreCase(PARAM_START_SEARCH_DATE)) {
                    resultMap.put("startDate", entry.getValue());
                }
            }
        }
        return resultMap;
    }

}
