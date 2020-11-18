package jmnet.moka.core.dps.api.handler.module;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.category.Category;
import jmnet.moka.core.dps.api.category.CategoryParser;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;
import jmnet.moka.core.dps.api.menu.Menu;
import jmnet.moka.core.dps.api.menu.MenuParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class CategoryModule implements ModuleInterface {
    @Autowired
    @Qualifier("pcCategoryParser")
    private CategoryParser categoryParser;

    @Override
    public Object invoke(ApiContext apiContext, ApiRequestHandler apiRequestHandler,
            ApiRequestHelper apiRequestHelper)
            throws Exception {
        Map<String, Object> paramMap = apiContext.getCheckedParamMap();
        return categoryParser.getCategoryKeyList((String)paramMap.get("master"),
                (String)paramMap.get("service"),(String)paramMap.get("source") );
    }

    public Object getCodes(ApiContext apiContext, ApiRequestHandler apiRequestHandler,
            ApiRequestHelper apiRequestHelper)
            throws Exception {
        Map<String, Object> paramMap = apiContext.getCheckedParamMap();
        String key = (String)paramMap.get("category");
        Category category = this.categoryParser.getCategory(key);
        Map<String,String> result = new HashMap<>();
        if ( category != null) {
            result.put(MokaConstants.MASTER_CODE_LIST, String.join(",", category.getMasterCodeList()));
            result.put(MokaConstants.SERVICE_CODE_LIST, String.join(",", category.getServiceCodeList()));
            result.put(MokaConstants.SOURCE_CODE_LIST, String.join(",", category.getSourceCodeList()));
            result.put(MokaConstants.EXCEPT_SOURCE_CODE_LIST, String.join(",", category.getExceptSourceCodeList()));
        }
        return result;
    }

}
