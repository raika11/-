package jmnet.moka.web.dps.module;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;

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
        Map<String, Object> article = new HashMap<>();
        Map baseData = allApiResult.getDataListFirst(ApiResult.MAIN_DATA);
        if (baseData != null) {
            article.putAll(baseData);

        }
        article.put("codes", allApiResult.getDataList("CODE"));
        article.put("reporters", allApiResult.getDataList("REPORTER"));
        article.put("components", allApiResult.getDataList("COMPONENT"));
        processGrouping(article,"source",source);
        processGrouping(article,"shared",shared);
        processTypeSetting(article);
        processKeyword(article);
        // Key이름으로 정렬
        Map sortedMap = new LinkedHashMap(article.size());
        Object[] keyArray = article.keySet().toArray();
        Arrays.sort(keyArray);
        for ( Object key : keyArray) {
            sortedMap.put(key, article.get(key));
        }
        return Collections.singletonMap("article", sortedMap);
    }

    private static final String[] source = {"SOURCE_CODE","SOURCE_NAME","SOURCE_ETC","SOURCE_BASEURL"};
    private static final String[] shared = {"CLICK_CNT","TREND_RANK","SHR_FCNT","SHR_TCNT","SHR_ICNT",
                                              "SHR_GCNT","SHR_KSCNT", "SHR_KCNT","SHR_PCNT","EMAIL_CNT",
                                              "LIKE_CNT","HATE_CNT","REPLY_CNT","SCB_CNT"};

    private void processGrouping(Map article, String mapName, String[] columns) {
        Map<String,Object> groupingMap = new HashMap<>();
        for ( String column : columns) {
            groupingMap.put(column,article.get(column));
            article.remove(column);
        }
        article.put(mapName, groupingMap);
    }

    private static final String[] typeSettings = {"PRESS_PAN","PRESS_MYUN","PRESS_NUMBER","PRESS_DATE","PRESS_CATEGORY"};
    private void processTypeSetting(Map article) {
        // PRESS_PAN, PRESS_MYUN, PRESS_NUMBER(호), PRESS_DATE, PRESS_CATEGORY
        Map<String,Object> typeSettingMap = new HashMap<>();
        for ( String column : typeSettings) {
            if ( !column.equals("PRESS_DATE")) {
                typeSettingMap.put(column,article.get(column));
            } else { // 예외처리
                String serviceDate = (String)article.get("PRESS_DATE");
                if ( McpString.isNotEmpty(serviceDate)) {
                    try {
                        typeSettingMap.put(column, McpDate.date("YYYYMMDD",serviceDate));
                    } catch (ParseException e) {
                        typeSettingMap.put(column,article.get(column));
                    }
                } else {
                    typeSettingMap.put(column,article.get(column));
                }
            }
            article.remove(column);
        }
        article.put("typeSetting", typeSettingMap);
    }

    private void processKeyword(Map article) {
        Object keywordObj = article.get("KEYWORDS");
        List<Map<String, String>> keywordList = new ArrayList<>(16);
        if (McpString.isEmpty(keywordObj)) {
            return;
        }
        for (String keywordInfo : ((String) keywordObj).split(",")) {
            String[] token = keywordInfo.split("\\|:");
            if (token == null || token.length < 2) {
                continue;
            }
            String issueSeq = token[0].trim();
            Map<String, String> kewordMap = new HashMap<>(2);
            kewordMap.put("ISS_SEQ", issueSeq);
            kewordMap.put("KEYWORD", token[1]);
            kewordMap.put("SORT_NO", "0");
            if (!issueSeq.equals("0")) {
                keywordList.add(0, kewordMap);
            } else {
                keywordList.add(kewordMap);
            }
        }
        String keywords = "";
        for (int i = 0; i < keywordList.size(); i++) {
            String keyword = keywordList
                    .get(i)
                    .get("KEYWORD");
            if (i != 0) {
                keywords += ",";
            }
            keywords += keyword;
        }
        article.put("KEYWORDS", keywords);
        article.put("keywords", keywordList);
    }

    // 카테고리
    // - 마스터코드 : MASTER_CODE, SERVICE_KORNAME, SECTION_KORNAME, CONTENT_KORNAME
    // - 서비스코드 : SERVICE_CODE, FRST_(CODE,(KOR|ENG)_NM), SCND_(CODE,(KOR|ENG)_NM)

}
