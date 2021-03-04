package jmnet.moka.web.dps.module.article;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.api.handler.module.category.Category;
import jmnet.moka.core.dps.api.handler.module.category.CategoryParser;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class ArticleModule implements ModuleInterface {

    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;
    public ArticleModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {
        Map<String, Object> paramMap = apiContext.getCheckedParamMap();
        ApiResult allApiResult = apiContext.getAllResult();
        Map<String,Object> article = new HashMap<>();
        Map baseData =  allApiResult.getDataListFirst(ApiResult.MAIN_DATA);
        if ( baseData != null){
            article.putAll(baseData);

        }
        article.put("code",  allApiResult.getDataList("CODE"));
        article.put("reporter", allApiResult.getDataList("REPORTER"));
        article.put("component", allApiResult.getDataList("COMPONENT"));
        processKeyword(article);
        return Collections.singletonMap("article", article);
    }

    private void processKeyword(Map article) {
        Object keywordObj = article.get("KEYWORDS");
        List<Map<String,String>> keywordList = new ArrayList<>(16);
        if (McpString.isEmpty(keywordObj)) return;
        for ( String keywordInfo : ((String)keywordObj).split(",")) {
            String[] token =  keywordInfo.split("\\|:");
            if ( token == null || token.length < 2) continue;
            String issueSeq = token[0].trim();
            Map<String,String> kewordMap = new HashMap<>(2);
            kewordMap.put("ISS_SEQ",issueSeq);
            kewordMap.put("KEYWORD",token[1]);
            kewordMap.put("SORT_NO","0");
            if ( !issueSeq.equals("0")) {
                keywordList.add(0, kewordMap);
            } else {
                keywordList.add(kewordMap);
            }
        }
        String keywords = "";
        for ( int i=0; i< keywordList.size(); i++ )  {
            String keyword = keywordList.get(i).get("KEYWORD");
            if ( i != 0) {
                keywords += ",";
            }
            keywords += keyword;
        }
        article.put("KEYWORDS",keywords);
        article.put("keyword",keywordList);
    }
}
