package jmnet.moka.core.dps.api.handler.module.searchEngine;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 * <pre>
 *
 * Project : moka-web-bbs
 * Package : jmnet.moka.core.dps.api.handler.module.searchEngine
 * ClassName : AbstractModel
 * Created : 2020-11-23 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-23 오후 4:04
 */
public class ResultParser {
    protected static final String SEARCH_QUERY_RESLUT = "SearchQueryResult";
    protected static final String COLLECTION = "Collection";
    protected static final String DOCUMENT_SET = "DocumentSet";
    protected static final String ID = "Id";
    protected static final String TOTAL_COUNT = "TotalCount";
    protected static final String COUNT = "Count";
    protected static final String DOCUMENT = "Document";
    protected static final String FIELD = "Field";
    protected static final List<Object> EMPTY_LIST = new ArrayList<>(0);

    protected Object getObject(Object object, String key) {
        if ( object instanceof Map) {
            Map map = (Map)object;
            return map.get(key);
        }
        return null;
    }

    protected int getInt(Object object, String key) {
        if ( object instanceof Map) {
            Map map = (Map)object;
            Object resultObj =  map.get(key);
            if ( resultObj instanceof String) {
                return Integer.parseInt((String)resultObj);
            }
        }
        return 0;
    }

    protected Object stripJsonp(String jsonpString)
            throws ParseException {
        int startJson = jsonpString.indexOf('{');
        int endJson = jsonpString.lastIndexOf(");");
        String jsonString = jsonpString.substring(startJson,endJson);
        JSONParser parser = new JSONParser();
        Object resultJson = parser.parse(jsonString);
        return resultJson;
    }
}
