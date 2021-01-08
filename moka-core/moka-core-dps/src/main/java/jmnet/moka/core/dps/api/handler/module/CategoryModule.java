package jmnet.moka.core.dps.api.handler.module;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.module.category.Category;
import jmnet.moka.core.dps.api.handler.module.category.CategoryParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class CategoryModule implements ModuleInterface {
    @Autowired
    @Qualifier("categoryParser")
    private CategoryParser categoryParser;

    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;
    public CategoryModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {
        Map<String, Object> paramMap = apiContext.getCheckedParamMap();
        return categoryParser.getCategoryList((String)paramMap.get(MokaConstants.MASTER_CODE_LIST),
                (String)paramMap.get(MokaConstants.SERVICE_CODE_LIST),(String)paramMap.get(MokaConstants.SOURCE_CODE_LIST) );
    }

    public List<Category> getCategoryList(String masterCodes, String serviceCodes, String sourceCodes) {
        return this.categoryParser.getCategoryList(masterCodes, serviceCodes, sourceCodes);
    }

    public Object getCodes(ApiContext apiContext)
            throws Exception {
        Map<String, Object> paramMap = apiContext.getCheckedParamMap();
        String categoryKey = (String)paramMap.get("category");
        return getCodes(categoryKey);
    }

    public Object getCodes(String categoryKey)
            throws Exception {
        Map<String,String> result = new HashMap<>();
        Category category = this.categoryParser.getCategory(categoryKey);
        return getCodes(category);
    }

    public Object getCodes(Category category)
            throws Exception {
        Map<String,String> result = new HashMap<>();
        if ( category != null) {
            result.put(MokaConstants.PARAM_CATEGORY, category.getKey());
            result.put(MokaConstants.MASTER_CODE_LIST, String.join(",", category.getMasterCodeList()));
            result.put(MokaConstants.SERVICE_CODE_LIST, String.join(",", category.getServiceCodeList()));
            result.put(MokaConstants.SOURCE_CODE_LIST, String.join(",", category.getSourceCodeList()));
            result.put(MokaConstants.EXCEPT_SOURCE_CODE_LIST, String.join(",", category.getExceptSourceCodeList()));
        }
        return result;
    }

}
